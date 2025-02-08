import React, { useState } from 'react';
import { Layout, Switch, Button } from 'antd';
import { BulbOutlined, BulbFilled, BugOutlined } from '@ant-design/icons';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import TaskSelector from './components/LeftPanel/TaskSelector';
import EnvironmentView from './components/LeftPanel/EnvironmentView';
import AgentChat from './components/RightPanel/AgentChat';
import ResizeableDivider from './components/ResizeableDivider';
import WebSocketClient from './components/WebSocketClient';
import DebugDrawer from './components/DebugDrawer';

const { Header } = Layout;

const AppContent: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [debugVisible, setDebugVisible] = useState(false);

  return (
    <Layout className={`h-screen flex flex-col ${isDarkMode ? 'bg-[#141414]' : 'bg-white'}`}>
      <WebSocketClient />
      {/* 标题栏 */}
      <Header className={`${
        isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-gray-200'
      } border-b flex items-center justify-between py-2 px-6`}>
        <h1 className={`text-2xl font-bold m-0 ${
          isDarkMode ? 'text-[#177ddc]' : 'text-[#1890ff]'
        }`}>
          Agent导航助手
        </h1>
        
        {/* 主题切换开关 */}
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={<BugOutlined />}
            onClick={() => setDebugVisible(true)}
            className={isDarkMode ? 'text-white' : ''}
          />
          <Switch
            checkedChildren={<BulbOutlined />}
            unCheckedChildren={<BulbFilled />}
            checked={isDarkMode}
            onChange={toggleTheme}
          />
        </div>
      </Header>

      {/* 主体内容 */}
      <div className="flex-1 flex flex-row p-4 overflow-hidden content-container">
        {/* 左侧面板 */}
        <div className="left-panel flex flex-col space-y-4 overflow-y-auto" style={{ width: '35%' }}>
          <TaskSelector />
          <EnvironmentView />
        </div>
        
        {/* 可调节分隔栏 */}
        <ResizeableDivider />
        
        {/* 右侧面板 */}
        <div className="flex-1">
          <AgentChat />
        </div>
      </div>
      <DebugDrawer 
        visible={debugVisible}
        onClose={() => setDebugVisible(false)}
      />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App; 