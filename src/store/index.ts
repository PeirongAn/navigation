import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import chatReducer from './slices/chatSlice';
import navigationReducer from './slices/navigationSlice';
import ratingReducer from './slices/ratingSlice';

export const store = configureStore({
  reducer: {
    task: taskReducer,
    chat: chatReducer,
    navigation: navigationReducer,
    rating: ratingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 