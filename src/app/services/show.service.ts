import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShowGenre } from '../model/video/show-genre';
import { Show } from '../model/video/show';
import { Episode } from '../model/video/episode';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class ShowService {
  baseUrl = `${API_URL}/shows`;
  constructor(private http: HttpClient) {}

  getShow(showId: number) {
    return this.http.get<Show>(`${this.baseUrl}/${showId}`);
  }

  getEpisode(episodeId: number) {
    return this.http.get<Episode>(`${this.baseUrl}/episode/${episodeId}`);
  }

  getNewReleases() {
    return this.http.get<Show[]>(`${this.baseUrl}/new-releases`);
  }

  getShowsOfGenre(genre: string) {
    return this.http.get<Show[]>(`${this.baseUrl}/genre/${genre}`);
  }

  getGenres() {
    return this.http.get<ShowGenre>(`${this.baseUrl}/genres`);
  }
}
