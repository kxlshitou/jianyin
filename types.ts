export enum AssetType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  TEXT = 'TEXT'
}

export interface Asset {
  id: string;
  type: AssetType;
  src: string; // URL or Base64
  name: string;
  duration: number; // In seconds
  thumbnail?: string;
}

export interface TrackClip {
  id: string;
  assetId: string;
  trackId: string;
  startTime: number; // Position on timeline in seconds
  duration: number; // Duration of the clip on timeline
  offset: number; // Start point within the source asset
  name: string;
  type: AssetType;
  src: string;
}

export interface Track {
  id: string;
  type: 'MAIN' | 'OVERLAY' | 'AUDIO' | 'TEXT';
  clips: TrackClip[];
}

export interface ProjectState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  tracks: Track[];
  assets: Asset[];
  selectedClipId: string | null;
}