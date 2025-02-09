export interface TaskState {
  taskId: string;
  description: string;
  isRunning: boolean;
}

export interface NavigationInfo {
  id: string;
  timestamp: number;
  type: 'decision' | 'question';
  images: string[];
  currentImage: string;
  currentDescription: string;
  video?: string;
  decision?: string;
  question?: string;
}

export interface NavigationState {
  navigationInfos: NavigationInfo[];
  currentTimestamp: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
  type: 'human' | 'agent';
}

export interface ChatState {
  messages: ChatMessage[];
} 