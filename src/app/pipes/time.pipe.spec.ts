import { TimePipe } from './time.pipe';

describe('TimePipe', () => {
  let pipe: TimePipe;

  beforeEach(() => {
    pipe = new TimePipe();
  });

  it('devrait créer une instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('devrait formater 61 secondes en "1:01"', () => {
    expect(pipe.transform(61)).toBe('1:01');
  });

  it('devrait formater 0 seconde en "0:00"', () => {
    expect(pipe.transform(0)).toBe('0:00');
  });

  it('devrait formater 3599 secondes en "59:59"', () => {
    expect(pipe.transform(3599)).toBe('59:59');
  });
}); 