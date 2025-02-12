import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { userId: string }) => {
    setLoading(true);
    try {
      onLogin(values.userId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDarkMode ? 'bg-[#141414]' : 'bg-gray-100'
    }`}>
      <Card 
        className={`w-96 ${isDarkMode ? 'bg-[#1f1f1f]' : 'bg-white'}`}
        title={
          <div className={`text-center text-xl font-bold ${
            isDarkMode ? 'text-[#177ddc]' : 'text-[#1890ff]'
          }`}>
            {language === 'en' ? 'Login' : '登录'}
          </div>
        }
      >
        <Form
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="userId"
            label={language === 'en' ? 'User ID' : '用户ID'}
            rules={[{ required: true, message: language === 'en' ? 'Please input your user ID!' : '请输入用户ID！' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={loading}
            >
              {language === 'en' ? 'Confirm' : '确认'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 