import { TestBed } from '@angular/core/testing';
import { TrackService } from './track.service';

describe('TrackService', () => {
  let service: TrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });
});
