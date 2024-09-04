import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MusicGenre } from '../model/audio/music-genre';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = API_URL;
  constructor(private http: HttpClient) {}

  getMusicGenres() {
    return this.http.get<MusicGenre>(`${this.baseUrl}/music/genres`);
  }
}
