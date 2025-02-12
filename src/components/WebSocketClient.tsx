import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'antd';
import { addNavigationInfo } from '../store/slices/navigationSlice';
import { wsService } from '../services/websocket';
import { useTheme } from '../contexts/ThemeContext';
import { setIsSending } from 'store/slices/chatSlice';

const WebSocketClient: React.FC = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const hasShownError = useRef(false);

  useEffect(() => {
    // 添加连接错误处理器
    const handleConnectionError = () => {
      if (!hasShownError.current) {
        console.log('WebSocket连接失败，使用默认数据');
        Modal.error({
          title: '连接失败',
          content: '无法连接到服务器，请检查网络连接后刷新页面重试。',
          okText: '确定',
          className: isDarkMode ? 'ant-modal-dark' : '',
        });
        hasShownError.current = true;
      }
    };

    // 添加导航信息处理器
    const handleNavigation = (navigationInfo: any) => {
      dispatch(addNavigationInfo(navigationInfo));
      dispatch(setIsSending(false));
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
  }, [dispatch, isDarkMode]);

  return null;
};

export default WebSocketClient; 