import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrackService } from '../../services/track.service';
import { MusicCategory, Track } from '../../models/track.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-track-form',
  templateUrl: './track-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
  ]
})
export class TrackFormComponent implements OnInit {
  trackForm!: FormGroup;
  categories = Object.values(MusicCategory);
  audioFile!: File;
  imageFile!: File;
  isEditMode = false;
  trackId: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private trackService: TrackService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm() {
    this.trackForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', Validators.required],
      description: ['', Validators.maxLength(200)],
      category: [MusicCategory.POP, Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      if (params['id']) {
        this.isEditMode = true;
        this.trackId = params['id'];
        await this.loadTrackData(params['id']);
      }
    });
  }

  async loadTrackData(trackId: string) {
    try {
      const track = await this.trackService.getTrackById(trackId);
      this.trackForm.patchValue({
        title: track.title,
        artist: track.artist,
        description: track.description,
        category: track.category
      });
    } catch (error) {
      console.error('Erreur lors du chargement du track:', error);
    }
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
    if (this.trackForm.valid) {
      try {
        if (this.isEditMode && this.trackId) {
          const updatedTrack = {
            ...await this.trackService.getTrackById(this.trackId),
            ...this.trackForm.value
          };
          await this.trackService.updateTrack(updatedTrack);
          
          if (this.audioFile) {
            await this.trackService.addTrackFile(this.trackId, this.audioFile);
          }
          if (this.imageFile) {
            const coverUrl = URL.createObjectURL(this.imageFile);

            await this.trackService.addTrackCover(this.trackId, this.imageFile);
          }
          alert('Track modifié avec succès!');
        } else {
          const trackId = Math.random().toString(36).substr(2, 9);

          const metadata: Track=  {
            ...this.trackForm.value,
            id: trackId,
            addedDate: new Date(),
            coverUrl: '',
          };
          
          metadata.coverUrl= this.imageFile;
          console.log("eeeeeeeeeeeee");
          console.log(this.imageFile);
          
          
          console.log(metadata);
          
          await this.trackService.addTrackMetadata(metadata);
          await this.trackService.addTrackFile(trackId, this.audioFile);
                      
         alert('Track added successfully!');
        }
       // this.router.navigate(['/library']);
      } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue');
      }
    }
  }
}
