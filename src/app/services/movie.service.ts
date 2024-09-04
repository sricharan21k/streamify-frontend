import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MovieGenre } from '../model/video/movie-genre';
import { Movie } from '../model/video/movie';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  baseUrl = `${API_URL}/movies`;
  constructor(private http: HttpClient) {}

  getGenres() {
    return this.http.get<MovieGenre>(`${this.baseUrl}/genres`);
  }

  getMovie(movieId: number) {
    return this.http.get<Movie>(`${this.baseUrl}/${movieId}`);
  }

  getNewReleases() {
    return this.http.get<Movie[]>(`${this.baseUrl}/new-releases`);
  }

  getMoviesOfGenre(genre: string) {
    return this.http.get<Movie[]>(`${this.baseUrl}/genre/${genre}`);
  }
}
