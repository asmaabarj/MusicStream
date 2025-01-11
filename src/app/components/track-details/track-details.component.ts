import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, from } from 'rxjs';
import { Track } from '../../models/track.model';
import { TrackService } from '../../services/track.service';
import { TimePipe } from '../../pipes/time.pipe';
import { Store } from '@ngrx/store';
import * as PlayerActions from '../../store/actions/player.actions';
import * as PlayerSelectors from '../../store/selectors/player.selectors';
import { PlayerStatus } from '../../models/player-state.model';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, TimePipe]
})
export class TrackDetailsComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  audioUrl: string | undefined;
  track$!: Observable<Track>;
  playerStatus$ = this.store.select(PlayerSelectors.selectPlayerStatus);
  currentTime$ = this.store.select(PlayerSelectors.selectCurrentTime);
  duration$ = this.store.select(PlayerSelectors.selectDuration);
  volume$ = this.store.select(PlayerSelectors.selectVolume);
  error$ = this.store.select(PlayerSelectors.selectError);
  readonly PAUSED = PlayerStatus.PAUSED;
  readonly STOPPED = PlayerStatus.STOPPED;
  readonly PLAYING = PlayerStatus.PLAYING;

  constructor(
    private route: ActivatedRoute,
    private trackService: TrackService,
    private store: Store
  ) {}

  ngOnInit() {
    const trackId = this.route.snapshot.paramMap.get('id');
    if (trackId) {
      this.track$ = from(this.trackService.getTrackById(trackId));
      this.loadAudioUrl(trackId);
    }
  }

  async loadAudioUrl(trackId: string) {
    try {
      this.audioUrl = await this.trackService.getTrackAudioUrl(trackId);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'audio:', error);
    }
  }

  togglePlay() {
    const audio = this.audioPlayer.nativeElement;
    if (audio.paused) {
      this.store.dispatch(PlayerActions.play({ trackId: this.route.snapshot.paramMap.get('id')! }));
      audio.play();
    } else {
      this.store.dispatch(PlayerActions.pause());
      audio.pause();
    }
  }

  onTimeUpdate() {
    const currentTime = Math.floor(this.audioPlayer.nativeElement.currentTime);
    this.store.dispatch(PlayerActions.setCurrentTime({ time: currentTime }));
  }

  onMetadataLoaded() {
    const duration = Math.floor(this.audioPlayer.nativeElement.duration);
    this.store.dispatch(PlayerActions.setDuration({ duration }));
  }

  onVolumeChange(event: Event) {
    const volume = parseFloat((event.target as HTMLInputElement).value);
    this.store.dispatch(PlayerActions.setVolume({ volume }));
    this.audioPlayer.nativeElement.volume = volume;
  }

  onSeek(event: Event) {
    const time = parseFloat((event.target as HTMLInputElement).value);
    this.audioPlayer.nativeElement.currentTime = time;
    this.store.dispatch(PlayerActions.setCurrentTime({ time }));
  }

  onEnded() {
    this.store.dispatch(PlayerActions.stop());
  }

  getCoverUrl(coverUrl: any): string {
    if (coverUrl instanceof File) {
      return URL.createObjectURL(coverUrl);
    }
    
    return coverUrl || 'assets/default-cover.png';
  }

  skip(seconds: number) {
    const newTime = this.audioPlayer.nativeElement.currentTime + seconds;
    this.store.select(PlayerSelectors.selectDuration).subscribe(duration => {
      if (newTime >= 0 && newTime <= duration) {
        this.audioPlayer.nativeElement.currentTime = newTime;
        this.store.dispatch(PlayerActions.setCurrentTime({ time: newTime }));
      }
    }).unsubscribe();
  }
}
