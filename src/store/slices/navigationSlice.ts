import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface ImageInfo {
  path: string;
  description: string;
}
interface NavigationInfoOrigin {
  type: 0 | 1; // 0: decision, 1: question
  imagesCandidate: ImageInfo[]; // 候选点图片
  imagesSurrounding: string[]; // 周围点图片
  currentImage?: string; // 当前点图片
  currentDescription?: string; // 当前位置描述
  video?: string; // 路径回放视频
  text?: string; // agent回复text
}
interface NavigationInfo extends NavigationInfoOrigin {
  id: string;
  timestamp: number;
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
    type: 0,
    imagesCandidate: [
      {
        path: '/images/1/point1.jpg',
        description: '前方走廊'
      },
      {
        path: '/images/1/point2.jpg',
        description: '右侧房间'
      },
      {
        path: '/images/1/point3.jpg',
        description: '左转通道'
      }
    ],
    imagesSurrounding: [
      '/images/1/surrounding1.jpg',
      '/images/1/surrounding2.jpg',
      '/images/1/surrounding3.jpg',
      '/images/1/surrounding4.jpg'
    ],
    currentImage: '/images/1/current.jpg',
    currentDescription: '当前位置在房间的中心，面向北方',
    text: '我选择继续向前走，因为前方走廊更宽敞'
  },
  {
    id: '2',
    timestamp: 2,
    type: 1,
    imagesCandidate: [
      {
        path: '/images/2/point1.jpg',
        description: '左转'
      },
      {
        path: '/images/2/point2.jpg',
        description: '右转'
      }
    ],
    imagesSurrounding: [
      '/images/2/surrounding1.jpg',
      '/images/2/surrounding2.jpg',
      '/images/2/surrounding3.jpg',
      '/images/2/surrounding4.jpg'
    ],
    currentImage: '/images/2/current.jpg',
    currentDescription: '当前位置在走廊中间，两侧都有岔路',
    video: '/videos/path_1_to_2.mp4',
    text: '这里有两个选择，我需要帮助决定接下来往哪个方向走？'
  }
];

const initialState: NavigationState = {
  navigationInfos: [],
  currentTimestamp: 0,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    addNavigationInfo: (state, action: PayloadAction<NavigationInfoOrigin>) => {
      const timestamp = state.navigationInfos.length + 1;
      const navigationInfo: NavigationInfo = {
        ...action.payload,
        id: timestamp.toString(),
        timestamp,
      };

    
      state.navigationInfos.push(navigationInfo);
      state.currentTimestamp = navigationInfo.timestamp;
      
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