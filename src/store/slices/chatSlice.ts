import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, ChatMessage } from '../../types';

const initialState: ChatState = {
  messages: [],
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
    },
    setIsSending: (state, action: PayloadAction<boolean>) => {
      state.isSending = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  }
});

export const { addMessage,  clearMessages, setIsSending } = chatSlice.actions;
export default chatSlice.reducer; 