import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrackService } from '../../services/track.service';
import { MusicCategory, Track } from '../../models/track.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-form',
  templateUrl: './track-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TrackFormComponent {
  trackForm: FormGroup;
  categories = Object.values(MusicCategory);
  audioFile!: File;
  imageFile!: File;

  constructor(private fb: FormBuilder, private trackService: TrackService) {
    this.trackForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', Validators.required],
      description: ['', Validators.maxLength(200)],
      category: [MusicCategory.POP, Validators.required],
    });
  }

  onAudioFileChange(event: any) {
    const file = event.target.files[0];
    if (file && this.validateFile(file, ['audio/mpeg', 'audio/wav', 'audio/ogg'], 15)) {
      this.audioFile = file;
    } else {
      alert('Invalid audio file. Please upload a valid MP3, WAV, or OGG file under 15MB.');
    }
  }

  onImageFileChange(event: any) {
    const file = event.target.files[0];
    if (file && this.validateFile(file, ['image/jpeg', 'image/png'], 5)) {
      this.imageFile = file;
    } else {
      alert('Invalid image file. Please upload a valid JPEG or PNG file under 5MB.');
    }
  }

  validateFile(file: File, allowedTypes: string[], maxSizeMB: number): boolean {
    return allowedTypes.includes(file.type) && file.size <= maxSizeMB * 1024 * 1024;
  }

  async submit() {
    if (this.trackForm.valid && this.audioFile && this.imageFile) {
      const trackId = Math.random().toString(36).substr(2, 9);

      const metadata: Track = {
        ...this.trackForm.value,
        id: trackId,
        addedDate: new Date(),
        duration: Math.floor(Math.random() * 300) + 180,
        coverUrl: URL.createObjectURL(this.imageFile), // Utiliser coverUrl au lieu de imageUrl
        fileUrl: URL.createObjectURL(this.audioFile),
      };

      try {
        await this.trackService.addTrackMetadata(metadata);
        await this.trackService.addTrackFile(trackId, this.audioFile);
        alert('Track added successfully!');
        this.trackForm.reset();
      } catch (error) {
        console.error('Error adding track:', error);
      }
    } else {
      alert('Please fill in all fields and upload valid files.');
    }
  }
}
