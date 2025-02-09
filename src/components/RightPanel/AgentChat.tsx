import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';
import NavigationInfo from './NavigationInfo';
import ChatInput from './ChatInput';
import { Empty, Progress } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

interface CombinedMessage {
  type: 'navigation' | 'chat' | 'waiting';
  timestamp: number;
  content: any;
}

const AgentChat: React.FC = () => {
  const navigationInfos = useSelector((state: RootState) => state.navigation.navigationInfos);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const taskStarted = useSelector((state: RootState) => state.navigation.taskStarted);
  const { isDarkMode } = useTheme();
  const [progress, setProgress] = useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [showWaiting, setShowWaiting] = useState(false);

  // 监听新消息到达
  useEffect(() => {
    if (navigationInfos.length > 0) {
      setShowWaiting(false);
    }
  }, [navigationInfos]);

  // 合并并排序消息
  const combinedMessages = React.useMemo(() => {
    const combined: CombinedMessage[] = [
      ...navigationInfos.map(info => ({
        type: 'navigation' as const,
        timestamp: info.timestamp,
        content: info
      })),
      ...messages.map(msg => ({
        type: 'chat' as const,
        timestamp: msg.timestamp,
        content: msg
      }))
    ];

    const sorted = combined.sort((a, b) => a.timestamp - b.timestamp);

    // 如果需要显示等待状态，添加到最后
    if (showWaiting) {
      sorted.push({
        type: 'waiting',
        timestamp: Date.now(),
        content: null
      });
    }

    return sorted;
  }, [navigationInfos, messages, showWaiting]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (taskStarted && navigationInfos.length === 0) {
      // 模拟进度条
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(timer);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
    } else {
      setProgress(0);
    }
    return () => clearInterval(timer);
  }, [taskStarted, navigationInfos.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, navigationInfos]);

  if (taskStarted && navigationInfos.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <Progress 
          type="circle" 
          percent={Math.round(progress)} 
          status="active"
          strokeColor={{
            '0%': isDarkMode ? '#177ddc' : '#1890ff',
            '100%': isDarkMode ? '#49aa19' : '#52c41a',
          }}
        />
        <div className={`mt-4 text-lg ${
          isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'
        }`}>
          模型加载中...
        </div>
      </div>
    );
  } else  if (navigationInfos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className={isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'}>
              请在左上方选择任务开始导航
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {combinedMessages.map((item) => {
          if (item.type === 'navigation') {
            return <NavigationInfo key={`nav-${item.timestamp}`} {...item.content} />;
          } else if (item.type === 'waiting') {
            return (
              <div key="waiting" className="flex items-start gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-[#49aa19]' : 'bg-[#52c41a]'
                }`}>
                   <RobotOutlined className="text-white" />
                </div>
                <div className="flex flex-col flex-1">
                  <div className={`mb-1 ${
                    isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'
                  }`}>
                    <span>Agent</span>
                  </div>
                  <div className={`rounded-lg p-3 ${
                    isDarkMode ? 'bg-[#262626]' : 'bg-gray-100'
                  }`}>
                    <div className="flex gap-1">
                      <span className={`animate-[blink_1s_ease-in-out_infinite] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>.</span>
                      <span className={`animate-[blink_1s_ease-in-out_0.3s_infinite] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>.</span>
                      <span className={`animate-[blink_1s_ease-in-out_0.6s_infinite] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>.</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={`chat-${item.timestamp}`} className="flex items-start gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-[#177ddc]' : 'bg-[#1890ff]'
                }`}>
                  <span className="text-white">H</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className={`mb-1 ${
                    isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'
                  }`}>
                    Human T={item.timestamp}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    isDarkMode ? 'bg-[#262626] text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.content.content}
                  </div>
                </div>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <ChatInput onSend={() => setShowWaiting(true)} />
      </div>
    </div>
  );
};

export default AgentChat;