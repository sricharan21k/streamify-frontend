import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NewUser } from '../../model/new-user';
import { UserService } from '../../services/user.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { validatePasswordStrength } from './validate-password-strength';
import { validatePasswordMatch } from './validate-password-match';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  userExists: boolean = false;

  registerForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^[a-zA-Z0-9]+$/),
      ]),
      firstname: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        validatePasswordStrength(),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        validatePasswordMatch(),
      ]),
      // validatePasswordMatch
    });
  }

  checkUsername() {
    this.registerForm
      .get('username')
      ?.valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((query) => this.userService.checkUserExists(query))
      )
      .subscribe((res) => (this.userExists = res));
  }

  register() {
    if (this.registerForm.invalid) return;

    const newUser: NewUser = { ...this.registerForm.value };

    this.userService.addNewUser(newUser).subscribe((data) => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}
