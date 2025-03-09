import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NasService } from '../../services/nas.service';
import { Location } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-nas-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './nas-login.component.html',
  styleUrls: ['./nas-login.component.css'],
})
export class NasLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private nas: NasService,
    private location:Location
  ) {
    // Initialize the form
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Username field with required validation
      password: ['', Validators.required], // Password field with required validation
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return; // Don't submit if the form is invalid
    }
    const { username, password } = this.loginForm.value;
    this.nas.login(username, password).subscribe({next: (response: any) => {
      if (response.QDocRoot.authPassed['#cdata-section'] === '1') {
        this.location.back()
      } else {
        this.errorMessage = 'Invalid credentials';
      }
    },
    error: (error) => {
      this.errorMessage = 'Error logging in';
      console.error(error);
    },})
  }
}
