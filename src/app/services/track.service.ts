import { Injectable } from '@angular/core';
import { Track } from '../models/track.model';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private dbName = 'MusicStreamDB';
  private metadataStore = 'tracks';
  private audioStore = 'audioFiles';
  private db!: IDBDatabase;

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event: any) => {
        this.db = event.target.result;
        if (!this.db.objectStoreNames.contains(this.metadataStore)) {
          this.db.createObjectStore(this.metadataStore, { keyPath: 'id' });
        }
        if (!this.db.objectStoreNames.contains(this.audioStore)) {
          this.db.createObjectStore(this.audioStore);
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = () => {
        console.error('IndexedDB initialization failed.');
        reject();
      };
    });
  }

  private async ensureDBReady(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  async addTrackMetadata(track: any): Promise<void> {
    await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.metadataStore, 'readwrite');
      const store = transaction.objectStore(this.metadataStore);
      const request = store.add(track);

      request.onsuccess = () => resolve();
      request.onerror = () => reject();
    });
  }

  async addTrackFile(id: string, file: Blob): Promise<void> {
    await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.audioStore, 'readwrite');
      const store = transaction.objectStore(this.audioStore);
      const request = store.put(file, id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject();
    });
  }

  async getAllTracks(): Promise<Track[]> {
    await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.metadataStore, 'readonly');
      const store = transaction.objectStore(this.metadataStore);
      const request = store.getAll();

      request.onsuccess = () => {
        const tracks = request.result;
        console.log(tracks);
        resolve(tracks);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTrack(id: string): Promise<void> {
    await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      // Supprimer les métadonnées
      const metadataTransaction = this.db.transaction(this.metadataStore, 'readwrite');
      const metadataStore = metadataTransaction.objectStore(this.metadataStore);
      const metadataRequest = metadataStore.delete(id);

      metadataRequest.onsuccess = () => {
        // Supprimer le fichier audio associé
        const audioTransaction = this.db.transaction(this.audioStore, 'readwrite');
        const audioStore = audioTransaction.objectStore(this.audioStore);
        const audioRequest = audioStore.delete(id);

        audioRequest.onsuccess = () => resolve();
        audioRequest.onerror = () => reject();
      };
      metadataRequest.onerror = () => reject();
    });
  }

  async getTrackById(id: string): Promise<Track> {
    await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.metadataStore, 'readonly');
      const store = transaction.objectStore(this.metadataStore);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          reject(new Error('Track not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getTrackAudioUrl(id: string): Promise<string> {
    await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.audioStore, 'readonly');
      const store = transaction.objectStore(this.audioStore);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          const blob = request.result;
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Audio file not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateTrack(track: Track): Promise<void> {
    await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.metadataStore, 'readwrite');
      const store = transaction.objectStore(this.metadataStore);
      const request = store.put(track);

      request.onsuccess = () => resolve();
      request.onerror = () => reject();
    });
  }
}
