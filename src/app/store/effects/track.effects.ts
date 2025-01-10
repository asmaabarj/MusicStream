import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TrackService } from '../../services/track.service';
import { loadTracks, loadTracksSuccess, addTrack } from '../actions/track.actions';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class TrackEffects {
  constructor(private actions$: Actions, private trackService: TrackService) {}

  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTracks),
      mergeMap(() =>
        this.trackService.getAllTracks().then((tracks) =>
          loadTracksSuccess({ tracks })
        )
      )
    )
  );

  addTrack$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addTrack),
        mergeMap(({ track }) => this.trackService.addTrackMetadata(track))
      ),
    { dispatch: false }
  );
}
