export enum PlayerStatus {
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  STOPPED = 'stopped',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success'
}

export interface PlayerState {
  status: PlayerStatus;
  currentTrackId: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  error?: string | null;
} 