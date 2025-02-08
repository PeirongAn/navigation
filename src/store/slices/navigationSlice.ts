import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageInfo {
  path: string;
  description: string;
}
interface NavigationInfo {
  id: string; // '1'
  timestamp: number; // index + 1
  type: 0 | 1; // 0: decision, 1: question
  imagesCandidate: ImageInfo[]; // 候选点图片
  imagesSurrounding: string[]; // 周围点图片
  currentImage?: string; // 当前点图片
  currentDescription?: string; // 当前位置描述
  video?: string; // 路径回放视频
  text?: string; // agent回复text
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
    type: 0, // 0 表示 decision
    imagesCandidate: [
      {
        path: '/images/1/point1.jpeg',
        description: '前方通道'
      },
      {
        path: '/images/1/point2.jpg',
        description: '右侧房间'
      },
      {
        path: '/images/1/point3.jpg',
        description: '左侧通道'
      },
      {
        path: '/images/1/point4.jpg',
        description: '后方出口'
      }
    ],
    imagesSurrounding: [
      '/images/1/surrounding1.jpg',
      '/images/1/surrounding2.jpg',
      '/images/1/surrounding3.jpg',
      '/images/1/surrounding4.jpg'
    ],
    currentImage: '/images/1/current.jpeg',
    currentDescription: '当前位置在房间的中心，面向北方',
    text: '我决定向前移动，因为前方通道看起来更开阔'
  },
  {
    id: '2',
    timestamp: 2,
    type: 1, // 1 表示 question
    imagesCandidate: [
      {
        path: '/images/2/point1.jpeg',
        description: '左转通道'
      },
      {
        path: '/images/2/point2.jpg',
        description: '右转房间'
      },
      {
        path: '/images/2/point3.jpg',
        description: '直行通道'
      }
    ],
    imagesSurrounding: [
      '/images/2/surrounding1.jpg',
      '/images/2/surrounding2.jpg',
      '/images/2/surrounding3.jpg',
      '/images/2/surrounding4.jpg'
    ],
    currentImage: '/images/2/current.jpeg',
    currentDescription: '当前位置在房间的北侧，面向东方',
    video: '/videos/path_1_to_2.mp4',
    text: '这里有三个可能的方向，我需要帮助决定下一步该往哪个方向走？'
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