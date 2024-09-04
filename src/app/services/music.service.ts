import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MusicArtist } from '../model/audio/music-artist';
import { retry } from 'rxjs';
import { Album } from '../model/audio/album';
import { Song } from '../model/audio/song';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  baseUrl = `${API_URL}/music`;
  constructor(private http: HttpClient) {}

  getAlbum(artistId: number) {
    return this.http.get<Album>(`${this.baseUrl}/album/${artistId}`);
  }

  getTrack(trackId: number) {
    return this.http.get<Song>(`${this.baseUrl}/track/${trackId}`);
  }

  getArtists() {
    return this.http.get<MusicArtist[]>(`${this.baseUrl}/artists`);
  }

  getGenres() {
    return this.http.get<string[]>(`${this.baseUrl}/genres`);
  }

  getNewReleases() {
    return this.http.get<Album[]>(`${this.baseUrl}/new-releases`);
  }

  getPopularAlbums() {
    return this.http.get<Album[]>(`${this.baseUrl}/popular-albums`);
  }

  getPopularGenres() {
    return this.http.get<string[]>(`${this.baseUrl}/popular-genres`);
  }

  getGenreAlbums(genre: string) {
    return this.http.get<Album[]>(`${this.baseUrl}/genre/${genre}/albums`);
  }

  getArtistAlbums(artistId: number) {
    return this.http.get<Album[]>(`${this.baseUrl}/artist/${artistId}/albums`);
  }

  getTrendingSongs() {
    return this.http.get<Album[]>(`${this.baseUrl}/trending-songs`);
  }

  getTrendingAlbums() {
    return this.http.get<Album[]>(`${this.baseUrl}/trending-albums`);
  }
}
