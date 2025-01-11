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

  async onMetadataLoaded() {
    this.duration = Math.floor(this.audioPlayer.nativeElement.duration);
    
    const trackId = this.route.snapshot.paramMap.get('id');
    if (trackId) {
      try {
        const track = await this.trackService.getTrackById(trackId);
        track.duration = this.duration;
        await this.trackService.updateTrack(track);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la durée:', error);
      }
    }
  }

  onSeek(event: Event) {
    const time = (event.target as HTMLInputElement).value;
    this.audioPlayer.nativeElement.currentTime = Number(time);
  }

  onEnded() {
    this.isPlaying = false;
    this.currentTime = 0;
  }

  getCoverUrl(coverUrl: any): string {
    if (coverUrl instanceof File) {
      return URL.createObjectURL(coverUrl);
    }
    
    return coverUrl || 'assets/default-cover.png';
  }

  skip(seconds: number) {
    const newTime = this.audioPlayer.nativeElement.currentTime + seconds;
    if (newTime >= 0 && newTime <= this.duration) {
      this.audioPlayer.nativeElement.currentTime = newTime;
    }
  }
}
