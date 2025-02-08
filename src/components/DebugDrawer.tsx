import React from 'react';
import { Drawer, Button, Tag } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import { wsService } from '../services/websocket';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const DebugDrawer: React.FC<Props> = ({ visible, onClose }) => {
  const { isDarkMode } = useTheme();
  const [logs, setLogs] = React.useState<any[]>([]);
  const [isConnected, setIsConnected] = React.useState(wsService.isConnected());

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
    </Drawer>
  );
};

export default DebugDrawer; 