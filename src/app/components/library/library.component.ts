import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadTracks } from '../../store/actions/track.actions';
import { selectAllTracks } from '../../store/selectors/track.selectors';
import { Track } from '../../models/track.model';
import { Observable } from 'rxjs';
import { TrackService } from '../../services/track.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class LibraryComponent implements OnInit {
  tracks$: Observable<Track[]> = this.store.select(selectAllTracks);

  constructor(
    private store: Store,
    private trackService: TrackService
  ) {}

  ngOnInit() {
    this.store.dispatch(loadTracks());
  }

  async deleteTrack(trackId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette piste ?')) {
      try {
        await this.trackService.deleteTrack(trackId);
        // Recharger la liste des tracks après la suppression
        this.store.dispatch(loadTracks());
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression de la piste');
      }
    }
  }
}
