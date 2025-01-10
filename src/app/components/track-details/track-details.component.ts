import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, from } from 'rxjs';
import { Track } from '../../models/track.model';
import { TrackService } from '../../services/track.service';
import { TimePipe } from '../../pipes/time.pipe';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, TimePipe]
})
export class TrackDetailsComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  track$!: Observable<Track>;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  audioUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private trackService: TrackService
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
    if (this.audioPlayer.nativeElement.paused) {
      this.audioPlayer.nativeElement.play();
      this.isPlaying = true;
    } else {
      this.audioPlayer.nativeElement.pause();
      this.isPlaying = false;
    }
  }

  onTimeUpdate() {
    this.currentTime = Math.floor(this.audioPlayer.nativeElement.currentTime);
  }

  onMetadataLoaded() {
    this.duration = Math.floor(this.audioPlayer.nativeElement.duration);
  }

  onSeek(event: Event) {
    const time = (event.target as HTMLInputElement).value;
    this.audioPlayer.nativeElement.currentTime = Number(time);
  }

  onEnded() {
    this.isPlaying = false;
    this.currentTime = 0;
  }
}
