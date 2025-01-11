import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { trackReducer } from './store/reducers/track.reducer';
import { playerReducer } from './store/reducers/player.reducer';
import { TrackEffects } from './store/effects/track.effects';
import { PlayerEffects } from './store/effects/player.effects';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      track: trackReducer,
      player: playerReducer
    }),
    provideEffects([TrackEffects, PlayerEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
