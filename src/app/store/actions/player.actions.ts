import { createAction, props } from '@ngrx/store';
import { PlayerStatus } from '../../models/player-state.model';

export const play = createAction('[Player] Play', props<{ trackId: string }>());
export const pause = createAction('[Player] Pause');
export const stop = createAction('[Player] Stop');
export const setStatus = createAction('[Player] Set Status', props<{ status: PlayerStatus }>());
export const setCurrentTime = createAction('[Player] Set Current Time', props<{ time: number }>());
export const setDuration = createAction('[Player] Set Duration', props<{ duration: number }>());
export const setVolume = createAction('[Player] Set Volume', props<{ volume: number }>());
export const setError = createAction('[Player] Set Error', props<{ error: string }>()); 