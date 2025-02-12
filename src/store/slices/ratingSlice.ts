import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Rating {
  timestamp: number;
  confidenceScore: number;
  difficultyScore: number;
  timingScore: number;
  contentScore: number;
  interactionScore: number;
  locationScore: number;
  comment: string;
  userId: string;
  taskId: string;
}

interface RatingState {
  ratings: Rating[];
  loading: boolean;
  error: string | null;
}

const initialState: RatingState = {
  ratings: [],
  loading: false,
  error: null
};

export const submitRating = createAsyncThunk(
  'rating/submit',
  async (ratingData: Rating) => {
    const response = await axios.post('/api/ratings', ratingData);
    return response.data;
  }
);

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitRating.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '提交评价失败';
      });
  }
});

export default ratingSlice.reducer; 