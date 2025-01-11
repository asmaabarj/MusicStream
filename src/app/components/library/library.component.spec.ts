import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TrackService } from '../../services/track.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let store: MockStore;
  let trackService: jasmine.SpyObj<TrackService>;

  beforeEach(async () => {
    const trackServiceSpy = jasmine.createSpyObj('TrackService', ['deleteTrack', 'getAllTracks']);
    trackServiceSpy.deleteTrack.and.returnValue(Promise.resolve());
    trackServiceSpy.getAllTracks.and.returnValue(Promise.resolve([]));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule
      ],
      providers: [
        provideMockStore({
          initialState: {
            tracks: []
          }
        }),
        { provide: TrackService, useValue: trackServiceSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    trackService = TestBed.inject(TrackService) as jasmine.SpyObj<TrackService>;
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer', () => {
    expect(component).toBeTruthy();
  });

  it('devrait filtrer les pistes lors de la recherche', () => {
    const mockEvent = { target: { value: 'test' } } as any;
    component.onSearchChange(mockEvent);
    expect(component.searchTerm).toBe('test');
  });

  it('devrait appeler deleteTrack lors de la confirmation de suppression', async () => {
    await component.deleteTrack('123');
    expect(trackService.deleteTrack).toHaveBeenCalledWith('123');
  });

  it('devrait retourner une URL valide pour getCoverUrl', () => {
    const url = component.getCoverUrl('test.jpg');
    expect(url).toBe('test.jpg');
  });
});
