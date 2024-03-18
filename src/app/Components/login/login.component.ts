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
  authService : AuthService = inject(AuthService)
  showRegisterScreen : boolean = false
  userAcc: userAccount = { userID: 0, userEmail : "ffff", userPassword: "Fanks", role : Role.User };
  router: Router = inject(Router)
  constructor() {
    // Redirect user if already logged in for testing purpose
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    console.log("WORK")
  }

  login(): void {
    this.authService.login(this.userAcc).subscribe({
      next: (res) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }
  
  toggleRegister(): void {
    this.showRegisterScreen = !this.showRegisterScreen;
  }
}
