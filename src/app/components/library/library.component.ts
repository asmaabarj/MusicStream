import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadTracks } from '../../store/actions/track.actions';
import { selectAllTracks } from '../../store/selectors/track.selectors';
import { Track } from '../../models/track.model';
import { Observable } from 'rxjs';
import { TrackService } from '../../services/track.service';
import { TimePipe } from '../../pipes/time.pipe';

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
    private trackService: TrackService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(this.tracks$);
    
    this.store.dispatch(loadTracks());
  }

  async deleteTrack(trackId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette piste ?')) {
      try {
        await this.trackService.deleteTrack(trackId);
        this.store.dispatch(loadTracks());
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression de la piste');
      }
    }
  }

  // handleImageError(event: Event) {
  //   const target = event.target as HTMLImageElement;
  //   target.src = 'assets/default-cover.png';
  // }

  getCoverUrl(coverUrl: any): string {
    if (coverUrl instanceof File) {
      return URL.createObjectURL(coverUrl);
    }
    return coverUrl || 'assets/default-cover.png';
  }
}
