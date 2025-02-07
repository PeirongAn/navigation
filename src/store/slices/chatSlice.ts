import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, ChatMessage } from '../../types';

const initialState: ChatState = {
  messages: [],
  currentTimestamp: 3, // 当前时间戳，默认为3
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<string>) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: action.payload,
        timestamp: state.currentTimestamp,
        type: 'human'
      };
      state.messages.push(newMessage);
    },
    setCurrentTimestamp: (state, action: PayloadAction<number>) => {
      state.currentTimestamp = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  }
});

export const { addMessage, setCurrentTimestamp, clearMessages } = chatSlice.actions;
export default chatSlice.reducer; 