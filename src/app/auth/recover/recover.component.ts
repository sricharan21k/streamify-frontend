import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterEvent, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { validatePasswordStrength } from '../register/validate-password-strength';
import { validatePasswordMatch } from '../register/validate-password-match';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css',
})
export class RecoverComponent {
  recoveryForm: FormGroup;
  passwordForm: FormGroup;
  otpForm: FormGroup;
  showEmail: boolean = true;
  // showSendOtpButton: boolean = true;
  showPasswordForm: boolean = false;
  showSpinner: boolean = false;
  showOTPInput: boolean = false;
  otpVerified: boolean = false;
  // otpNotVerified: boolean = false;
  showExpired: boolean = false;
  showSuccessMessage = false;
  userEmail = '';
  timer: number = 120;
  intervalId: any;
  displayTime: string = '';

  constructor(
    private verificationService: VerificationService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.recoveryForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.passwordForm = this.fb.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        validatePasswordStrength(),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        validatePasswordMatch(),
      ]),
    });

    this.otpForm = this.fb.group({
      num1: [],
      num2: [],
      num3: [],
      num4: [],
      num5: [],
      num6: [],
    });
  }

  onOtpInput(
    event: any,
    nextInput?: HTMLInputElement,
    prevInput?: HTMLInputElement
  ) {
    const input = event.target;
    const keyCode = event.keyCode || event.which;

    // Check if backspace is pressed and the current input is empty
    if (keyCode === 8 && input.value.length === 0 && prevInput) {
      prevInput.focus();
      return;
    }

    // Check if entered value is a single digit and if there's a next input field
    if (input.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  sendOtp() {
    this.timer = 120;
    // this.showSendOtpButton = false;
    this.showSpinner = true;
    this.showExpired = false;

    this.userEmail = this.recoveryForm.get('email')?.value;
    this.verificationService.generateOtp(this.userEmail).subscribe((res) => {
      if (res) {
        this.showOTPInput = true;
        this.showSpinner = false;
        this.startTimer();
      }
    });
  }

  retry() {
    // this.otpNotVerified = false;
    this.showOTPInput = false;
    // this.showSendOtpButton = true;
    this.showEmail = true;
  }

  verifyOtp() {
    this.showSpinner = true;
    const otp = Object.keys(this.otpForm.controls)
      .map((control) => this.otpForm.controls[control].value)
      .join('');

    this.verificationService
      .verifyOtp(this.recoveryForm.get('email')?.value, otp)
      .subscribe((isVerified) => {
        this.showEmail = false;
        this.showOTPInput = false;
        this.showSpinner = false;
        if (isVerified) {
          this.otpVerified = true;
        } else {
          // this.otpNotVerified = true;
          this.showExpired = false;
        }
      });
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const password = this.passwordForm.get('password')?.value;
      this.userService
        .updatePassword(this.userEmail, password)
        .subscribe((res) => {
          this.showSuccessMessage = true;
        });
    }
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      if (this.timer > 0) {
        console.log(this.timer);
        this.timer -= 1;
        this.updateDisplayTime(this.timer);
      } else {
        this.showOTPInput = false;
        this.showExpired = true;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }
  updateDisplayTime(seconds: number): void {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    this.displayTime = `${this.padZero(minutes)}:${this.padZero(
      remainingSeconds
    )}`;
  }

  padZero(number: number): string {
    return number < 10 ? `0${number}` : number.toString();
  }
}
