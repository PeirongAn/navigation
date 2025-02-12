import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, ChatMessage } from '../../types';

// 从 localStorage 获取已存储的消息，如果没有则返回空数组
const getStoredMessages = (): ChatMessage[] => {
  const stored = localStorage.getItem('chatMessages');
  return stored ? JSON.parse(stored) : [];
};

const initialState: ChatState = {
  messages: getStoredMessages(),
  isSending: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{message: string, timestamp: number}>) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: action.payload.message,
        timestamp: action.payload.timestamp,
        type: 'human'
      };
      state.messages.push(newMessage);
      // 将更新后的消息保存到 localStorage
      localStorage.setItem('chatMessages', JSON.stringify(state.messages));
    },
    setIsSending: (state, action: PayloadAction<boolean>) => {
      state.isSending = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      // 清空 localStorage 中的消息
      localStorage.removeItem('chatMessages');
    }
  }
});

export const { addMessage,  clearMessages, setIsSending } = chatSlice.actions;
export default chatSlice.reducer; 