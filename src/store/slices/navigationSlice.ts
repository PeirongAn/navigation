import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationInfo {
  id: string;
  timestamp: number;
  type: 'decision' | 'question';
  images: string[];
  currentImage?: string;
  currentDescription?: string;
  video?: string;
  decision?: string;
  question?: string;
}

interface NavigationState {
  navigationInfos: NavigationInfo[];
  currentTimestamp: number | null;
}

// 默认导航数据
const defaultNavigationInfos: NavigationInfo[] = [
  {
    id: '1',
    timestamp: 1,
    type: 'decision',
    images: [
      '/images/point1.jpg',
      '/images/point2.jpg',
      '/images/point3.jpg',
      '/images/point4.jpg'
    ],
    decision: '向前移动',
    currentImage: '/images/point1.jpg',
    currentDescription: '当前位置在房间的中心，面向北方'
  },
  {
    id: '2',
    timestamp: 2,
    type: 'question',
    images: [
      '/images/point1.jpg',
      '/images/point2.jpg',
      '/images/point3.jpg',
      '/images/point4.jpg'
    ],
    video: '/test.mp4',
    question: '下一步应该往哪个方向走？',
    currentImage: '/images/point2.jpg',
    currentDescription: '当前位置在房间的北侧，面向东方'
  }
];

const initialState: NavigationState = {
  navigationInfos: defaultNavigationInfos,
  currentTimestamp: defaultNavigationInfos[defaultNavigationInfos.length - 1].timestamp,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    addNavigationInfo: (state, action: PayloadAction<NavigationInfo>) => {
      // 检查是否已存在相同时间戳的信息
      const existingIndex = state.navigationInfos.findIndex(
        info => info.timestamp === action.payload.timestamp
      );

      if (existingIndex !== -1) {
        // 更新现有信息
        state.navigationInfos[existingIndex] = action.payload;
      } else {
        // 添加新信息并按时间戳排序
        state.navigationInfos.push(action.payload);
        state.navigationInfos.sort((a, b) => a.timestamp - b.timestamp);
      }

      // 如果没有选中的时间戳，设置为最新的时间戳
      if (!state.currentTimestamp) {
        state.currentTimestamp = action.payload.timestamp;
      }
    },
    setCurrentTimestamp: (state, action: PayloadAction<number>) => {
      state.currentTimestamp = action.payload;
    },
    clearNavigationInfos: (state) => {
      state.navigationInfos = [];
      state.currentTimestamp = null;
    },
    resetToDefault: (state) => {
      state.navigationInfos = defaultNavigationInfos;
      state.currentTimestamp = defaultNavigationInfos[defaultNavigationInfos.length - 1].timestamp;
    },
  },
});

export const { 
  addNavigationInfo, 
  setCurrentTimestamp,
  clearNavigationInfos,
  resetToDefault
} = navigationSlice.actions;

export default navigationSlice.reducer; 