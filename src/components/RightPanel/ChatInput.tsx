import React, { useState } from 'react';
import { Input, Button} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setIsSending } from '../../store/slices/chatSlice';
import { RootState } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';
import { wsService } from '../../services/websocket';
import { useLanguage } from '../../contexts/LanguageContext';
import { messages } from '../../locales';

interface ChatInputProps {
  onSend?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const t = messages[language].chat;
  // 获取当前时间戳
  // const currentTimestamp = useSelector((state: RootState) => state.navigation.currentTimestamp);
  
  // 获取导航信息列表
  const navigationInfos = useSelector((state: RootState) => state.navigation.navigationInfos);
  // 获取任务状态
  const taskStarted = useSelector((state: RootState) => state.navigation.taskStarted);
  const isSending = useSelector((state: RootState) => state.chat.isSending);
  // 判断是否可以发送消息
  const canSendMessage = !isSending && taskStarted && navigationInfos.length > 0  &&

    navigationInfos[navigationInfos.length - 1].type === 1;
  // const canSendMessage = true;

  const handleSend = () => {
    if (!message.trim() || !canSendMessage) return;
    
    // 发送消息到 WebSocket
    wsService.sendMessage('user_input', message.trim());
    
    // 添加到本地聊天记录
    dispatch(addMessage({message: message.trim(), timestamp: navigationInfos[navigationInfos.length - 1].timestamp + 1}));
    setMessage('');
    // 触发发送回调
    onSend?.();
    dispatch(setIsSending(true));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input.TextArea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={canSendMessage ? "请输入消息..." : `${taskStarted ? '等待Agent提问...' : '当前任务已结束，请选择其他任务'}`}
          autoSize={{ minRows: 1, maxRows: 4 }}
          onKeyPress={handleKeyPress}
          disabled={!canSendMessage}
          className={`
            ${isDarkMode ? 
              'bg-[#262626] border-[#303030] text-white hover:border-[#177ddc] focus:border-[#177ddc]' :
              'bg-white border-gray-300 text-gray-800 hover:border-[#1890ff] focus:border-[#1890ff]'
            }
            disabled:bg-opacity-50 disabled:cursor-not-allowed
          `}
        />
      
          <Button 
            type="primary"
            onClick={handleSend}
            className={`whitespace-nowrap ${
              isDarkMode ? 
                'bg-[#177ddc] hover:bg-[#1765ad] border-[#177ddc]' :
                'bg-[#1890ff] hover:bg-[#40a9ff] border-[#1890ff]'
            } text-white`}
            disabled={!canSendMessage}
          >
            {t.send}
          </Button>
       
      </div>


    </div>
  );
};

export default ChatInput; 