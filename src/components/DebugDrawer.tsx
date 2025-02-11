import React, { useState } from 'react';
import { Drawer, Button, Tag, Modal, Table, Input, Space, message } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import { wsService } from '../services/websocket';
import { DeleteOutlined, EditOutlined, ExportOutlined } from '@ant-design/icons';

interface TaskInfo {
  id: string;
  descriptionZh: string;
  descriptionEn: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

const DebugDrawer: React.FC<Props> = ({ visible, onClose }) => {
  const { isDarkMode } = useTheme();
  const [logs, setLogs] = React.useState<any[]>([]);
  const [isConnected, setIsConnected] = React.useState(wsService.isConnected());
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [taskInfos, setTaskInfos] = useState<TaskInfo[]>([]);
  const [editingTask, setEditingTask] = useState<TaskInfo | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // 加载任务信息
  const loadTaskInfos = () => {
    const tasks = (window as any).taskInfos || [];
    updateTaskInfos(tasks);
  };

  // 导出任务信息
  const exportTaskInfos = () => {
    const taskInfosContent = `window.taskInfos = ${JSON.stringify(taskInfos, null, 2)};`;
    const blob = new Blob([taskInfosContent], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskInfos.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('导出成功');
  };

  // 删除任务
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      onOk: () => {
        const newTaskInfos = taskInfos.filter(task => task.id !== id);
        setTaskInfos(newTaskInfos);
        // 同步更新 window.taskInfos
        (window as any).taskInfos = newTaskInfos;
        message.success('删除成功');
      }
    });
  };

  // 编辑任务
  const handleEdit = (task: TaskInfo) => {
    setEditingTask(task);
    setIsEditModalVisible(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingTask) {
      const newTaskInfos = taskInfos.map(task => 
        task.id === editingTask.id ? editingTask : task
      );
      setTaskInfos(newTaskInfos);
      // 同步更新 window.taskInfos
      (window as any).taskInfos = newTaskInfos;
      setIsEditModalVisible(false);
      setEditingTask(null);
      message.success('保存成功');
    }
  };

  // 添加一个同步更新函数
  const updateTaskInfos = (newTaskInfos: TaskInfo[]) => {
    setTaskInfos(newTaskInfos);
    (window as any).taskInfos = newTaskInfos;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '中文描述',
      dataIndex: 'descriptionZh',
      key: 'descriptionZh',
      ellipsis: true,
    },
    {
      title: '英文描述',
      dataIndex: 'descriptionEn',
      key: 'descriptionEn',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TaskInfo) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    const updateLogs = (newLogs: any[]) => setLogs([...newLogs]);
    wsService.addLogHandler(updateLogs);

    // 定期更新连接状态
    const interval = setInterval(() => {
      setIsConnected(wsService.isConnected());
    }, 1000);

    return () => {
      wsService.removeLogHandler(updateLogs);
      clearInterval(interval);
    };
  }, []);

  const renderMessage = (messageStr: string) => {
    try {
      const message = JSON.parse(messageStr);


      return (
        <div>
          <div className="pl-2">
              <pre className="text-xs whitespace-pre-wrap pl-2">
                {JSON.stringify(message, null, 2)}
              </pre>
            </div>
        </div>
      );
    } catch (error) {
      return <div>解析错误: {messageStr}</div>;
    }
  };


  return (
    <Drawer
      title="调试面板"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      className={isDarkMode ? 'ant-drawer-dark' : ''}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span>WebSocket状态:</span>
          <Tag color={isConnected ? 'success' : 'error'}>
            {isConnected ? '已连接' : '未连接'}
          </Tag>
        </div>
        <div className="flex justify-between items-center">
          <Button 
            type="primary" 
            onClick={() => {
              loadTaskInfos();
              setIsTaskModalVisible(true);
            }}
          >
            任务编辑
          </Button>
        </div>
        <div className="flex justify-between">
          <span>消息记录:</span>
          <Button size="small" onClick={() => wsService.clearLogs()}>
            清空
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                isDarkMode ? 'bg-[#1f1f1f]' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Tag color={log.type === 'send' ? 'blue' : 'green'}>
                  {log.type === 'send' ? '发送' : '接收'}
                </Tag>
                <span className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              {renderMessage(log.data)}
            </div>
          ))}
        </div>
      </div>

      <Modal
        title="任务列表"
        open={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        footer={[
          <Button 
            key="export" 
            type="primary" 
            icon={<ExportOutlined />}
            onClick={exportTaskInfos}
          >
            导出
          </Button>
        ]}
        width={800}
      >
        <Table 
          dataSource={taskInfos} 
          columns={columns} 
          rowKey="id"
          pagination={false}
          scroll={{ y: 400 }}
        />
      </Modal>

      <Modal
        title="编辑任务"
        open={isEditModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingTask(null);
        }}
      >
        {editingTask && (
          <div className="space-y-4">
            <div>
              <div className="mb-2">ID</div>
              <Input 
                value={editingTask.id} 
                onChange={e => setEditingTask({
                  ...editingTask,
                  id: e.target.value
                })}
              />
            </div>
            <div>
              <div className="mb-2">中文描述</div>
              <Input.TextArea 
                value={editingTask.descriptionZh} 
                onChange={e => setEditingTask({
                  ...editingTask,
                  descriptionZh: e.target.value
                })}
                rows={4}
              />
            </div>
            <div>
              <div className="mb-2">英文描述</div>
              <Input.TextArea 
                value={editingTask.descriptionEn} 
                onChange={e => setEditingTask({
                  ...editingTask,
                  descriptionEn: e.target.value
                })}
                rows={4}
              />
            </div>
          </div>
        )}
      </Modal>
    </Drawer>
  );
};

export default DebugDrawer; 