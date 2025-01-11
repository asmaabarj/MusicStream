import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from '../../models/player-state.model';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectPlayerStatus = createSelector(
  selectPlayerState,
  (state) => state.status
);

export const selectCurrentTrackId = createSelector(
  selectPlayerState,
  (state) => state.currentTrackId
);

export const selectCurrentTime = createSelector(
  selectPlayerState,
  (state) => state.currentTime
);

export const selectDuration = createSelector(
  selectPlayerState,
  (state) => state.duration
);

export const selectVolume = createSelector(
  selectPlayerState,
  (state) => state.volume
);

export const selectError = createSelector(
  selectPlayerState,
  (state) => state.error
); 