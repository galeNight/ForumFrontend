import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { AuthService } from '../../Services/auth.service';
import { Role, userAccount } from '../../Models/UserAccount';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,MatButtonModule,MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService : AuthService = inject(AuthService)// AuthService for authentication
  showRegisterScreen : boolean = false // Flag to toggle between login and register screens
  userAcc: userAccount = { // Object to store user account details
    userID: 0, 
    userEmail : "user1@example.com", 
    userPassword: "password1", 
    role : Role.User };// Default role is User
  router: Router = inject(Router) // Router service for navigation
  constructor() {
    // Redirect user if already logged in for testing purpose
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
  // Method to handle user login
  login(): void {
    this.authService.login(this.userAcc).subscribe({
      next: (res) => {
        // Redirect to home page after successful login
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed:', err);// Log error if login fails
      }
    });
  }
  // Method to toggle between login and register screens
  toggleRegister(): void {
    this.showRegisterScreen = !this.showRegisterScreen;
  }
}