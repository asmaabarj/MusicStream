import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import * as PlayerActions from '../actions/player.actions';
import { TrackService } from '../../services/track.service';
import { PlayerStatus } from '../../models/player-state.model';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private trackService: TrackService
  ) {}

  loadTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.play),
      mergeMap(({ trackId }) =>
        this.trackService.getTrackAudioUrl(trackId).then(
          (url) => PlayerActions.setStatus({ status: PlayerStatus.PLAYING }),
          (error) => PlayerActions.setError({ error: error.message })
        )
      )
    )
  );
} 