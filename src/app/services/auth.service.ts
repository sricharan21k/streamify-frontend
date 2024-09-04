import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseApiUrl = API_URL;
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  isAuthenticated(): boolean {
    return !!this.userService.getUsername();
  }

  login(loginData: any) {
    this.http
      .post<{ authToken: string; username: string }>(
        `${this.baseApiUrl}/login`,
        loginData
      )
      .subscribe((data) => {
        const token = data.authToken;
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('username', data.username);
          this.userService.getUserProfile().subscribe((data) => {
            localStorage.setItem('user', JSON.stringify(data));
            this.router.navigate(['/home']);
          });
        }
      });
  }
}
