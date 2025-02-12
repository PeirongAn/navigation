import React, { useState } from 'react';
import { Layout, Switch, Button, ConfigProvider, Modal, Image, Steps, Avatar, Dropdown } from 'antd';
import { BulbOutlined, BulbFilled, BugOutlined, GlobalOutlined, QuestionCircleOutlined, ReadOutlined, EnvironmentOutlined, SolutionOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import TaskSelector from './components/LeftPanel/TaskSelector';
import EnvironmentView from './components/LeftPanel/EnvironmentView';
import AgentChat from './components/RightPanel/AgentChat';
import ResizeableDivider from './components/ResizeableDivider';
import WebSocketClient from './components/WebSocketClient';
import DebugDrawer from './components/DebugDrawer';
import enUS from 'antd/locale/en_US';
import Login from './components/Login';
import { clearNavigationInfos, resetTask } from 'store/slices/navigationSlice';
import { clearMessages } from 'store/slices/chatSlice';
import { useDispatch } from 'react-redux';

const { Header } = Layout;

const AppContent: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [debugVisible, setDebugVisible] = useState(false);
  const [isExampleVisible, setIsExampleVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const dispatch = useDispatch();
  const handleLogin = (newUserId: string) => {
    setUserId(newUserId);
    localStorage.setItem('userId', newUserId);
  };

  const handleLogout = () => {
    dispatch(clearNavigationInfos());
    dispatch(resetTask());
    dispatch(clearMessages());
    localStorage.removeItem('userId');
    setUserId(null);
  };

  if (!userId) {
    return <Login onLogin={handleLogin} />;
  }

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: language === 'en' ? 'Logout' : '退出登录',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout className={`h-screen flex flex-col ${isDarkMode ? 'bg-[#141414]' : 'bg-white'}`}>
      <WebSocketClient />
      {/* 标题栏 */}
      <Header className={`${
        isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-gray-200'
      } border-b flex items-center justify-between py-2 px-6`}>
        <div className="flex items-center">
          <h1 className={`text-2xl font-bold m-0 ${
            isDarkMode ? 'text-[#177ddc]' : 'text-[#1890ff]'
          }`}>
            {language === 'en' ? 'AI Navigation Assistant' : 'AI导航助手'}
          </h1>
        </div>
        
        {/* 主题切换开关 */}
        <div className="flex items-center gap-4">
          <Button
              icon={<QuestionCircleOutlined />}
              onClick={() => setIsExampleVisible(true)}
              className={isDarkMode ? 'text-[#177ddc]' : 'text-[#1890ff]'}
              type="link"
            />
          <Button
            type="text"
            icon={<GlobalOutlined />}
            onClick={toggleLanguage}
            className={isDarkMode ? 'text-white' : ''}
          />
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
          <Dropdown menu={userMenu} placement="bottomRight">
            <div className="flex items-center cursor-pointer hover:opacity-80">
              <Avatar 
                icon={<UserOutlined />} 
                className={`${isDarkMode ? 'bg-[#177ddc]' : 'bg-[#1890ff]'}`}
              />
              <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {userId}
              </span>
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* 主体内容 */}
      <div className="flex-1 flex flex-row p-4 overflow-hidden content-container">
        {/* 左侧面板 */}
        <div className="left-panel flex flex-col space-y-4 overflow-hidden" style={{ width: '35%' }}>
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
      <Modal
        width={1200}
        title={language === 'en' ? "Instructions" : "注意事项"}
        open={isExampleVisible}
        onCancel={() => setIsExampleVisible(false)}
        footer={null}
        centered
        className={isDarkMode ? 'ant-modal-dark' : ''}
      >
        {/* 步骤条 */}
        <div className="mb-8">
          <Steps
            items={[
              {
                title: '理解指令',
                status: 'finish',
                icon: <ReadOutlined />,
                description: '阅读任务目标',
              },
              {
                title: '理解环境',
                status: 'finish',
                icon: <EnvironmentOutlined />,
                description: '观察周围场景',
              },
              {
                title: '理解问题',
                status: 'finish',
                icon: <QuestionCircleOutlined />,
                description: '分析当前情况',
              },
              {
                title: '给出指导',
                status: 'finish',
                icon: <SolutionOutlined />,
                description: '提供导航建议',
              },
            ]}
            className={`${isDarkMode ? 'steps-dark' : ''}`}
          />
        </div>

        {/* 系统说明部分 */}
        <div className={`mb-6 ${isDarkMode ? 'text-[#d9d9d9]' : 'text-gray-800'}`}>
          <h3 className={`text-lg font-medium mb-2 ${
            isDarkMode ? 'text-[#177ddc]' : 'text-[#1890ff]'
          }`}>
            1. 界面说明
          </h3>
          <div className={`text-sm ${isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'}`}>
            任务开始后，智能体将自动开始导航，下图是对应功能说明：
          </div>
          <div className={`mt-4 border rounded-lg overflow-hidden ${
            isDarkMode ? 'border-[#303030]' : 'border-gray-200'
          }`}>
            <Image
              src="/intro.jpeg"
              alt="introduction"
              className="w-full"
              preview={false}
            />
          </div>
        </div>

        {/* 回答问题要求部分 */}
        <div className={isDarkMode ? 'text-[#d9d9d9]' : 'text-gray-800'}>
          <h3 className={`text-lg font-medium mb-2 ${
            isDarkMode ? 'text-[#177ddc]' : 'text-[#1890ff]'
          }`}>
            2. 回答问题要求
          </h3>
          <div className={`text-sm ${isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'}`}>
            仅有当智能体寻求帮助时，用户才需要回答问题
          </div>
          <div className={`space-y-2 text-sm ${
            isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'
          }`}>
            <div className="flex items-start gap-2">
              <span className="font-medium">a.</span>
              <div>
                <span className={`font-medium ${
                  isDarkMode ? 'text-[#49aa19]' : 'text-[#52c41a]'
                }`}>最期待的回答是：</span>
                向前走，越过茶几之后右转到卧室（高层的语义信息）
              </div>
            </div>
            {/* ... 其他示例内容 ... */}
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={enUS}>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;


