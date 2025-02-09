import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Input, Tag, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import { clearNavigationInfos, startTask } from '../../store/slices/navigationSlice';
import { wsService } from '../../services/websocket';

const { Option } = Select;

type TaskStatus = '未选择' | '未开始' | '进行中' | '已结束';

interface TaskDescription {
  description: string;
}

const TaskSelector: React.FC = () => {
  const [taskId, setTaskId] = useState<string>();
  const [description, setDescription] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState<TaskStatus>('未选择');
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  // 使用真实任务数据
  const taskOptions = (window.taskInfos || []).map(info => ({
    value: info.id,
    label: `任务 ${info.id}`,
    description: info.descriptionZh
  }));

  useEffect(() => {
    wsService.addMessageHandler('finish', () => {
      setDisabled(false);
      setStatus('已结束');
      Modal.success({
        title: '任务完成',
        content: '当前任务已执行完毕，您可以重新开始或选择其他任务。',
        okText: '确定',
        className: isDarkMode ? 'ant-modal-dark' : '',
      });
    });
    return () => {
      wsService.removeMessageHandler('finish');
    };
  }, [isDarkMode]);

  const handleTaskChange = (value: string) => {
    setTaskId(value);
    setDescription(taskOptions.find(option => option.value === value)?.description || '');
    setStatus('未开始');
    dispatch(clearNavigationInfos());
  };

  const handleStartTask = () => {
    if (taskId) {
      if (!wsService.isConnected()) {
        Modal.error({
          title: '连接失败',
          content: '无法连接到服务器，请检查网络连接后重试。',
          okText: '确定',
          className: isDarkMode ? 'ant-modal-dark' : '',
        });
        return;
      }
      
      dispatch(clearNavigationInfos());
      wsService.sendMessage('start_task', taskId );
      dispatch(startTask(taskId));
      setDisabled(true);
      setStatus('进行中');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case '未选择': return isDarkMode ? 'gray' : 'default';
      case '未开始': return 'blue';
      case '进行中': return 'orange';
      case '已结束': return 'success';
      default: return 'default';
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
            disabled={disabled}
            dropdownStyle={{ minWidth: '200px' }}
            getPopupContainer={(trigger) => trigger.parentElement!}
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
        <div className="flex items-center gap-4">
          <div className={`font-bold w-24 ${
            isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-600'
          }`}>
            任务状态
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Tag color={getStatusColor()}>
              {status}
            </Tag>
          </div>
        </div>
        <Button 
          type="primary" 
          className={`w-full ${
            isDarkMode ? 
              'bg-[#177ddc] hover:bg-[#1765ad] border-[#177ddc]' : 
              'bg-[#1890ff] hover:bg-[#40a9ff] border-[#1890ff]'
          } text-white`}
          disabled={!taskId || disabled}
          onClick={handleStartTask}
        >
          {status === '已结束' ? '重新开始' : '开始执行'}
        </Button>
      </div>
    </Card>
  );
};


export default TaskSelector; 