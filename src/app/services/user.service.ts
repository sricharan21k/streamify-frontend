import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Media } from '../model/media';
import { Router } from '@angular/router';
import { NewUser } from '../model/new-user';
import { UserProfile } from '../model/UserProfile';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = `${API_URL}/users`;
  constructor(private http: HttpClient, private router: Router) {}

  getUser() {
    const item = localStorage.getItem('user');
    if (item) {
      const user = JSON.parse(item) as UserProfile;
      return user;
    }
    return;
  }

  getUserProfile() {
    return this.http.get<UserProfile>(
      `${this.baseUrl}/user-profile/${this.getUsername()}`
    );
  }

  getUsername(): string {
    const username = localStorage.getItem('username');
    if (!username) {
      this.router.navigate(['/login']);
    }
    return username ? username : '';
  }

  checkUserExists(username: string) {
    return this.http.get<boolean>(`${this.baseUrl}/check/${username}`);
  }

  addNewUser(user: NewUser) {
    return this.http.post<{ data: string }>(`${this.baseUrl}/register`, user);
  }

  updatePassword(email: string, password: string) {
    return this.http.patch<User>(`${this.baseUrl}/password`, {
      email: email,
      password: password,
    });
  }

  uploadProfile(image: FormData) {
    return this.http.post<string>(
      `${this.baseUrl}/${this.getUsername()}/profile-image`,
      image
    );
  }

  getProfileImage() {
    return `${this.baseUrl}/${this.getUsername()}/profile-image`;
  }

  deleteImage(filename: string) {
    return this.http.delete<boolean>(
      `${this.baseUrl}/${this.getUsername()}/profile-image/${filename}`
    );
  }

  getLastPlayed() {
    return this.http.get<{ data: string }>(
      `${this.baseUrl}/${this.getUsername()}/last-played`
    );
  }

  getUserWatchHistory() {
    return this.http.get<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/watch-history`
    );
  }

  getUserWatchlist() {
    return this.http.get<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/watchlist`
    );
  }

  getUserRecentPlays() {
    return this.http.get<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/recent-plays`
    );
  }

  getUserPlayQueue() {
    return this.http.get<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/play-queue`
    );
  }

  getUserSearchHistory() {
    return this.http.get<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/search-history`
    );
  }

  addItemToUserWatchHistory(item: string) {
    return this.http.put<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/watch-history`,
      item
    );
  }

  addItemToUserWatchlist(item: string) {
    return this.http.put<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/watchlist`,
      item
    );
  }

  addItemToUserRecentPlays(item: string) {
    return this.http.put<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/recent-plays`,
      item
    );
  }

  addItemToUserPlayQueue(item: string) {
    return this.http.put<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/play-queue`,
      item
    );
  }

  addItemToUserSearchHistory(item: string) {
    return this.http.put<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/search-history`,
      item
    );
  }

  deleteItemFromUserWatchHistory(item: string) {
    return this.http.delete<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/watch-history/${item}`
    );
  }

  deleteItemFromUserWatchlist(item: string) {
    return this.http.delete<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/watchlist/${item}`
    );
  }

  deleteItemFromUserRecentPlays(item: string) {
    return this.http.delete<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/recent-plays/${item}`
    );
  }

  deleteItemFromUserPlayQueue(item: string) {
    return this.http.delete<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/play-queue/${item}`
    );
  }

  deleteItemFromUserSearchHistory(item: string) {
    return this.http.delete<Media[]>(
      `${this.baseUrl}/${this.getUsername()}/search-history/${item}`
    );
  }

  updateLastPlayed(update: string) {
    const updatedData = {
      data: update,
    };
    this.http
      .post(`${this.baseUrl}/${this.getUsername()}/last-played`, updatedData)
      .subscribe();
  }
}
