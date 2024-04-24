import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-root',
  standalone: true, // Not a child component
  imports: [
    CommonModule, 
    RouterOutlet, 
    MatIconModule, 
    MatSidenavModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html', // HTML template file
  styleUrl: './app.component.css' // CSS styling file
})
export class AppComponent {
  title = 'Forum'; // Title of the application
  router: Router = inject(Router) // Injecting Router service
  isLoginComponent : boolean = false // Flag to indicate if the current component is the login component

  // Method to navigate to the login page
  navigateToLogin() {
    this.router.navigate(['/login']); // Navigate to '/login' route
    this.isLoginComponent = true // Set flag to indicate that the login component is active
  }

  constructor() {
    // Subscribe to router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // When the router detects navigation, check if the current route is the login component
        this.isLoginComponent = event.url.includes('/login');
      }
    });
  }
}
