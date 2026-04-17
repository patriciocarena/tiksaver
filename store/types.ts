export interface Preferences {
  theme: "dark" | "light";
}

export interface DownloadHistoryItem {
  id: string;
  url: string;
  videoTitle: string;
  thumbnail: string;
  downloadDate: string;
  localPath: string;
}
