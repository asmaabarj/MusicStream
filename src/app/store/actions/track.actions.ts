import { createAction, props } from '@ngrx/store';
import { Track } from '../../models/track.model';

export const loadTracks = createAction('[Track] Load Tracks');
export const loadTracksSuccess = createAction(
  '[Track] Load Tracks Success',
  props<{ tracks: Track[] }>()
);
export const addTrack = createAction(
  '[Track] Add Track',
  props<{ track: Track }>()
);
