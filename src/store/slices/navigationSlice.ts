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
        path: '/pics/candidate/100/0/0.png',
        description: '0'
      },
      {
        path: '/pics/candidate/100/0/1.png',
        description: '1'
      },
      {
        path: '/pics/candidate/100/0/2.png',
        description: '2'
      },
      {
        path: '/pics/candidate/100/0/3.png',
        description: '3'
      },
      {
        path: '/pics/candidate/100/0/4.png',
        description: '4'
      },
      {
        path: '/pics/candidate/100/0/5.png',
        description: '5'
      },

    ],
    imagesSurrounding: [
      '/pics/surrounding/100/0/0.jpg',
      '/pics/surrounding/100/0/1.jpg',
      '/pics/surrounding/100/0/2.jpg',
      '/pics/surrounding/100/0/3.jpg'
    ],
    currentImage: '/pics/current/100/0/current.jpg',
    currentDescription: '当前位置在房间的中心，面向北方',
    text: '我选择继续向前走，因为前方走廊更宽敞',
    video: '/videos/100/0/show_history.mp4'
  },
 
];

const initialState: NavigationState = {
  navigationInfos: defaultNavigationInfos,
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