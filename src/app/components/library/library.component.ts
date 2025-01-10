import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadTracks } from '../../store/actions/track.actions';
import { selectAllTracks } from '../../store/selectors/track.selectors';
import { Track } from '../../models/track.model';
import { Observable } from 'rxjs';
import { TrackService } from '../../services/track.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule]
})
export class LibraryComponent implements OnInit {
  tracks$: Observable<Track[]> = this.store.select(selectAllTracks);

  constructor(
    private store: Store,
    private trackService: TrackService
  ) {}

  ngOnInit() {
    console.log(this.tracks$);
    
    this.store.dispatch(loadTracks());
  }

  async confirmDelete(trackId: string) {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!'
    });

    if (result.isConfirmed) {
      this.deleteTrack(trackId);
    }
  }

  async deleteTrack(trackId: string) {
    try {
      await this.trackService.deleteTrack(trackId);
      this.store.dispatch(loadTracks());
      Swal.fire('Supprimé!', 'La piste a été supprimée.', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Swal.fire('Erreur!', 'Une erreur est survenue lors de la suppression de la piste', 'error');
    }
  }

  getCoverUrl(coverUrl: any): string {
    if (coverUrl instanceof File) {
      return URL.createObjectURL(coverUrl);
    }
    return coverUrl || 'assets/default-cover.png';
  }
}
