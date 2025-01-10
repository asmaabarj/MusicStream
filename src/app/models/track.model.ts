export interface Track {
    id: string;
    title: string;
    artist: string;
    description?: string;
    duration: number;
    category: MusicCategory;
    addedDate: Date | string;
    fileUrl: string;
    coverUrl?: File;
    audioFile?: File;
}

export enum MusicCategory {
    POP = 'pop',
    ROCK = 'rock',
    RAP = 'rap',
    CHAABI = 'cha3bi',
    JAZZ = 'jazz',
    CLASSIQUE = 'classique',    
    OTHER = 'other',
}
  