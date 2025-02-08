import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';
import NavigationInfo from './NavigationInfo';
import ChatInput from './ChatInput';
import { Empty } from 'antd';

const AgentChat: React.FC = () => {
  const navigationInfos = useSelector((state: RootState) => state.navigation.navigationInfos);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const { isDarkMode } = useTheme();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, navigationInfos]);

  if (navigationInfos.length === 0) {
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
        {navigationInfos.map((info) => (
          <NavigationInfo key={info.id} {...info} />
        ))}
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-[#177ddc]' : 'bg-[#1890ff]'
            }`}>
              <span className="text-white">H</span>
            </div>
            <div className="flex flex-col flex-1">
              <div className={`mb-1 ${
                isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'
              }`}>
                Human
              </div>
              <div className={`rounded-lg p-3 ${
                isDarkMode ? 'bg-[#262626] text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <ChatInput />
      </div>
    </div>
  );
};

export default AgentChat;