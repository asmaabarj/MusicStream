import { Routes } from '@angular/router';
import { LibraryComponent } from './components/library/library.component';
import { TrackFormComponent } from './components/track-form/track-form.component';
import { TrackDetailsComponent } from './components/track-details/track-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/library', pathMatch: 'full' },
  { path: 'library', component: LibraryComponent },
  { path: 'add-track', component: TrackFormComponent },
  { path: 'track/:id', component: TrackDetailsComponent },
  { path: '**', redirectTo: '/library' }
];
