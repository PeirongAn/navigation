import React, { useRef, useEffect } from 'react';
import { Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import NavigationInfo from './NavigationInfo';
import ChatInput from './ChatInput';
import { RootState } from '../../store';
import { setCurrentTimestamp } from '../../store/slices/navigationSlice';
import { ChatMessage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const AgentChat: React.FC = () => {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const navigationInfos = useSelector((state: RootState) => state.navigation.navigationInfos);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  
  // 添加消息容器的引用
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 当消息列表或导航信息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, navigationInfos]);

  const handleTimestampClick = (timestamp: number) => {
    dispatch(setCurrentTimestamp(timestamp));
  };

  const renderMessage = (msg: ChatMessage) => {
    const isHuman = msg.type === 'human';
    return (
      <div key={msg.id} className="flex items-start gap-3 mb-4">
        {/* 头像 */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isHuman ? 
            (isDarkMode ? 'bg-[#177ddc]' : 'bg-[#1890ff]') : 
            (isDarkMode ? 'bg-[#49aa19]' : 'bg-[#52c41a]')
        }`}>
          {isHuman ? (
            <UserOutlined className="text-white" />
          ) : (
            <RobotOutlined className="text-white" />
          )}
        </div>

        <div className="flex flex-col flex-1">
          {/* 时间戳 */}
          <div 
            className={`mb-1 cursor-pointer ${
              isDarkMode ? 
                'text-[#8c8c8c] hover:text-[#177ddc]' : 
                'text-gray-500 hover:text-[#1890ff]'
            }`}
            onClick={() => handleTimestampClick(msg.timestamp)}
          >
            {isHuman ? 'Human' : 'Agent'} T={msg.timestamp}
          </div>

          {/* 消息内容 */}
          <div className={`rounded-lg p-3 ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-100'}`}>
            <div className={`rounded p-3 shadow-md ${
              isDarkMode ? 
                'bg-[#1f1f1f] text-white' : 
                'bg-white text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card 
      className={`h-full flex flex-col ${
        isDarkMode ? 
          'bg-[#1f1f1f] border-[#303030]' : 
          'bg-white border-gray-200'
      }`}
      bodyStyle={{ 
        padding: '16px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* 聊天历史区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto">
        {/* Agent导航信息 */}
        {navigationInfos.map(info => (
          <NavigationInfo 
            key={info.id}
            {...info}
          />
        ))}
        
        {/* 聊天消息 */}
        {messages.map(renderMessage)}

        {/* 添加一个空的 div 作为滚动目标 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框区域 - 固定在底部 */}
      <div className={`flex-shrink-0 pt-4 border-t mt-4 ${
        isDarkMode ? 'border-[#303030]' : 'border-gray-200'
      }`}>
        <ChatInput />
      </div>
    </Card>
  );
};

export default AgentChat; 