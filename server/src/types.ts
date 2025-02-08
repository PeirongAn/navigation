export interface ImageInfo {
  path: string;
  description: string;
}

export interface NavigationInfo {
  id: string;
  timestamp: number;
  type: 0 | 1;
  imagesCandidate: ImageInfo[];
  imagesSurrounding: string[];
  currentImage?: string;
  currentDescription?: string;
  video?: string;
  text?: string;
} 