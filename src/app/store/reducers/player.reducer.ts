import { createReducer, on } from '@ngrx/store';
import { PlayerState, PlayerStatus } from '../../models/player-state.model';
import * as PlayerActions from '../actions/player.actions';

export const initialState: PlayerState = {
  status: PlayerStatus.STOPPED,
  currentTrackId: null,
  currentTime: 0,
  duration: 0,
  volume: 1,
  error: null
};

export const playerReducer = createReducer(
  initialState,
  on(PlayerActions.play, (state, { trackId }) => ({
    ...state,
    currentTrackId: trackId,
    status: PlayerStatus.LOADING
  })),
  on(PlayerActions.pause, (state) => ({
    ...state,
    status: PlayerStatus.PAUSED
  })),
  on(PlayerActions.stop, (state) => ({
    ...state,
    status: PlayerStatus.STOPPED,
    currentTime: 0
  })),
  on(PlayerActions.setStatus, (state, { status }) => ({
    ...state,
    status
  })),
  on(PlayerActions.setCurrentTime, (state, { time }) => ({
    ...state,
    currentTime: time
  })),
  on(PlayerActions.setDuration, (state, { duration }) => ({
    ...state,
    duration
  })),
  on(PlayerActions.setVolume, (state, { volume }) => ({
    ...state,
    volume
  })),
  on(PlayerActions.setError, (state, { error }) => ({
    ...state,
    status: PlayerStatus.ERROR,
    error
  }))
); 