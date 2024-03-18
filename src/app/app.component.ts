import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule, MatSidenavModule,MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Forum';
  router: Router = inject(Router)
  isLoginComponent : boolean = false


  navigateToLogin() {
    this.router.navigate(['/login']);
    this.isLoginComponent = true
  }

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //When router dectects the navigation it checks if it was login component
        this.isLoginComponent = event.url.includes('/login');
      }
    });
  }
}
