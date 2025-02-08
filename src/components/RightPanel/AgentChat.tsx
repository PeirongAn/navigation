import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';
import NavigationInfo from './NavigationInfo';
import ChatInput from './ChatInput';
import { Empty } from 'antd';

const AgentChat: React.FC = () => {
  const navigationInfos = useSelector((state: RootState) => state.navigation.navigationInfos);
  const { isDarkMode } = useTheme();

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
      </div>
      <div className="p-4 border-t">
        <ChatInput />
      </div>
    </div>
  );
};

export default AgentChat;