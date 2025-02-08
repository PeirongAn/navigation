declare global {
  interface Window {
    taskInfos: {
      id: string;
      descriptionZh: string;
      descriptionEn: string;
    }[];
    websocketURL: string;
  }
}

export {}; 