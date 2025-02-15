import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Input, Tag, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import { clearNavigationInfos, startTask, stopTask, setTaskId, resetTask } from '../../store/slices/navigationSlice';
import { wsService } from '../../services/websocket';
import { clearMessages } from '../../store/slices/chatSlice';
import { RootState } from '../../store';
import { DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const TaskSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const taskId = useSelector((state: RootState) => state.navigation.taskId);
  const taskStatus = useSelector((state: RootState) => state.navigation.taskStatus);
  const taskStarted = useSelector((state: RootState) => state.navigation.taskStarted);
 
  // 使用真实任务数据
  const taskOptions = (window.taskInfos || []).map(info => ({
    value: info.id,
    label: `任务 ${info.id}`,
    description: info.descriptionZh
  }));

  const [description, setDescription] = useState(() => {
    // 初始化时从 taskId 加载描述
    return taskId ? 
      taskOptions.find(option => option.value === taskId)?.description || '' : 
      '';
  });

  // 监听 taskId 变化，更新 description
  useEffect(() => {
    if (taskId) {
      const description = taskOptions.find(option => option.value === taskId)?.description || '';
      setDescription(description);
    }else {
      setDescription('');
    }
  }, [taskId, taskOptions]);

  useEffect(() => {
    wsService.addMessageHandler('finish', () => {
      dispatch(stopTask());
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
    console.log('handleTaskChange', value);
    dispatch(setTaskId(value));
    dispatch(clearNavigationInfos());
    dispatch(clearMessages());
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
      wsService.sendMessage('start_task', taskId);
      dispatch(startTask(taskId));
    }
  };

  const getStatusColor = () => {
    switch (taskStatus) {
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
        {!taskStarted && (
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
              disabled={taskStarted}
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
        )}
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
          <div className="flex flex-1 justify-between">
            <Tag color={getStatusColor()}>
              {taskStatus}
            </Tag>
            <Button
            danger
            size="small"
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => {
              dispatch(clearNavigationInfos()); 
              dispatch(resetTask()); 
              dispatch(clearMessages());}}
            className={isDarkMode ? 'text-[#177ddc]' : 'text-[#1890ff]'}
          >
            清空任务
          </Button>
          </div>
        </div>
        {taskId && !taskStarted && <Button 
          type="primary" 
          className={`w-full ${
            isDarkMode ? 
              'bg-[#177ddc] hover:bg-[#1765ad] border-[#177ddc]' : 
              'bg-[#1890ff] hover:bg-[#40a9ff] border-[#1890ff]'
          } text-white`}
          disabled={!taskId || taskStarted}
          onClick={handleStartTask}
        >
          {taskStatus === '已结束' ? '重新开始' : '开始执行'}
        </Button>}
      </div>
    </Card>
  );
};

export default TaskSelector; 