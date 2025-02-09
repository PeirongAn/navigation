import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, ChatMessage } from '../../types';

const initialState: ChatState = {
  messages: [],
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
    
    clearMessages: (state) => {
      state.messages = [];
    }
  }
});

export const { addMessage,  clearMessages } = chatSlice.actions;
export default chatSlice.reducer; 