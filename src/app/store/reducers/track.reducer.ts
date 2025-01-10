import { createReducer, on } from '@ngrx/store';
import { Track } from '../../models/track.model';
import * as TrackActions from '../actions/track.actions';

export interface TrackState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
}

export const initialState: TrackState = {
  tracks: [],
  loading: false,
  error: null
};

export const trackReducer = createReducer(
  initialState,
  on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({
    ...state,
    tracks: tracks
  }))
);
