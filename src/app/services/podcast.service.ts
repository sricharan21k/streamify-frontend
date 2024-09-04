import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Podcast } from '../model/audio/podcast';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class PodcastService {
  baseUrl = `${API_URL}/podcasts`;
  constructor(private http: HttpClient) {}

  getNewPodcasts() {
    return this.http.get<Podcast[]>(`${this.baseUrl}/new-releases`);
  }

  getTrendingPodcasts() {
    return this.http.get<Podcast[]>(`${this.baseUrl}/trending`);
  }

  getPopularPodcasts() {
    return this.http.get<Podcast[]>(`${this.baseUrl}/popular`);
  }

  getAllTopics() {
    return this.http.get<string[]>(`${this.baseUrl}/all-topics`);
  }

  getPodcastsOfTopic(topic: string) {
    return this.http.get<Podcast[]>(`${this.baseUrl}/topic/${topic}`);
  }
}
