import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import { clearNavigationInfos } from '../../store/slices/navigationSlice';
import { wsService } from '../../services/websocket';

const { Option } = Select;

interface TaskDescription {
  description: string;
}

const TaskSelector: React.FC = () => {
  const [taskId, setTaskId] = useState<string>();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  // 生成20个任务选项
  const taskOptions = Array.from({ length: 20 }, (_, i) => ({
    value: `task_${i + 1}`,
    label: `任务 ${i + 1}`
  }));

  useEffect(() => {
    // 添加任务描述处理器
    wsService.addMessageHandler('task_description', (data) => {
      setDescription(data.description);
      setLoading(false);
    });

    return () => {
      wsService.removeMessageHandler('task_description');
    };
  }, []);

  const handleTaskChange = (value: string) => {
    setTaskId(value);
    setLoading(true);
    dispatch(clearNavigationInfos());
    
    // 发送获取任务描述的消息
    wsService.sendMessage('get_task_description', { taskId: value });
  };

  const handleStartTask = () => {
    if (taskId) {
      // 发送开始任务的消息
      wsService.sendMessage('start_task', { taskId });
    }
  };

  return (
    <Card 
      className={`mb-4 ${
        isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-gray-200'
      }`}
      bodyStyle={{ padding: '12px' }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className={`font-bold w-24 ${
            isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-600'
          }`}>
            任务ID选择
          </div>
          <Select
            placeholder="请选择任务ID"
            className="flex-1"
            value={taskId}
            onChange={handleTaskChange}
            loading={loading}
            disabled={loading}
          >
            {taskOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className={`font-bold w-24 ${
            isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-600'
          }`}>
            目标描述
          </div>
          <Input.TextArea 
            rows={4} 
            value={description}
            placeholder="选择任务ID后自动获取目标描述"
            readOnly
            className={`${
              isDarkMode ? 
                'bg-[#262626] border-[#303030] text-white' : 
                'bg-gray-50 border-gray-200 text-gray-800'
            } hover:border-[#177ddc] focus:border-[#177ddc]`}
          />
        </div>
        <Button 
          type="primary" 
          className={`w-full ${
            isDarkMode ? 
              'bg-[#177ddc] hover:bg-[#1765ad] border-[#177ddc]' : 
              'bg-[#1890ff] hover:bg-[#40a9ff] border-[#1890ff]'
          } text-white`}
          disabled={!taskId || loading}
          loading={loading}
          onClick={handleStartTask}
        >
          开始执行
        </Button>
      </div>
    </Card>
  );
};

export default TaskSelector; 