import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  apiBaseUrl = API_URL;

  constructor(private http: HttpClient) {}

  generateOtp(email: string) {
    return this.http.post<boolean>(`${this.apiBaseUrl}/send-otp`, email);
  }
  verifyOtp(email: string, otp: string) {
    return this.http.post<boolean>(`${this.apiBaseUrl}/validate-otp`, {
      email: email,
      code: otp,
    });
  }
}
