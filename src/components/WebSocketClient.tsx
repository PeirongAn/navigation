import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNavigationInfo, resetToDefault } from '../store/slices/navigationSlice';
import { wsService } from '../services/websocket';

const WebSocketClient: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 添加连接错误处理器
    const handleConnectionError = () => {
      console.log('WebSocket连接失败，使用默认数据');
      dispatch(resetToDefault());
    };

    // 添加导航信息处理器
    const handleNavigation = (navigationInfo: any) => {
      dispatch(addNavigationInfo(navigationInfo));
    };

    // 连接WebSocket
    wsService.connect();

    // 添加消息处理器
    wsService.addMessageHandler('navigation', handleNavigation);
    wsService.addErrorHandler(handleConnectionError);

    // 清理函数
    return () => {
      wsService.removeMessageHandler('navigation');
      wsService.removeErrorHandler(handleConnectionError);
      wsService.disconnect();
    };
  }, [dispatch]);

  return null;
};

export default WebSocketClient; 