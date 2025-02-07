import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskState } from '../../types';

const initialState: TaskState = {
  taskId: '',
  description: '',
  isRunning: false,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTaskId: (state, action: PayloadAction<string>) => {
      state.taskId = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    startTask: (state) => {
      state.isRunning = true;
    },
    stopTask: (state) => {
      state.isRunning = false;
    },
  },
});

export const { setTaskId, setDescription, startTask, stopTask } = taskSlice.actions;
export default taskSlice.reducer; 