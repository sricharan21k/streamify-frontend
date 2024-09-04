import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { Media } from '../model/media';
import { UserService } from './user.service';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  apiBaseUrl = `${API_URL}/app`;

  private maxPlayer = new Subject<boolean>();
  private miniPlayer = new Subject<boolean>();
  private showMiniPlayer = new BehaviorSubject<boolean>(true);
  private carousel = new Subject<boolean>();
  private currentTopic = new BehaviorSubject<string>(this.getCurrentTopic());
  $hideMaxPlayer = this.maxPlayer.asObservable();
  $hideMiniPlayer = this.miniPlayer.asObservable();
  $showMiniPlayer = this.showMiniPlayer.asObservable();
  $hideCarousel = this.carousel.asObservable();
  $currentTopic = this.currentTopic.asObservable();

  constructor(private http: HttpClient) {}

  setCurrentTopic(header: string) {
    this.currentTopic.next(header);
    localStorage.setItem('header', header);
  }

  getCurrentTopic(): string {
    const header = localStorage.getItem('header');
    return header ? (header as string) : 'home';
  }

  closeMaxPlayer(value: boolean) {
    this.maxPlayer.next(value);
  }

  closeMiniPlayer(value: boolean) {
    this.miniPlayer.next(value);
  }

  setShowMiniPlayer(value: boolean) {
    this.showMiniPlayer.next(value);
  }

  hideCarousel(value: boolean) {
    this.carousel.next(value);
  }

  searchLibrary(keyword: string) {
    return this.http.get<Media[]>(`${this.apiBaseUrl}/search/${keyword}`);
  }
}
