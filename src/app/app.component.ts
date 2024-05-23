import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatIconModule} from '@angular/material/icon';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Post} from './Models/Post';
import { RecentPostsService } from './Services/recentpostsservice.Service';


@Component({
  selector: 'app-root',
  standalone: true, // Not a child component
  imports: [
    CommonModule, 
    RouterOutlet, 
    MatIconModule, 
    MatSidenavModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './app.component.html', // HTML template file
  styleUrl: './app.component.css' // CSS styling file
})

export class AppComponent {
  title = 'Forum'; // Title of the application
  router: Router = inject(Router) // Injecting Router service
  isLoginComponent : boolean = false // Flag to indicate if the current component is the login component
  searchterm: string = ""; // Search term to be used in the search bar

  constructor(private http: HttpClient,private recentPostsService: RecentPostsService) {
    // Subscribe to router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // When the router detects navigation, check if the current route is the login component
        this.isLoginComponent = event.url.includes('/login');
      }
    });
  }
    // Method to navigate to the login page
    navigateToLogin() {
      this.router.navigate(['/login']); // Navigate to '/login' route
      this.isLoginComponent = true; // Set flag to indicate that the login component is active
    }
  //methode to handle logout
  logout(): void{
    // Clear the authentication token 
    localStorage.removeItem('auth_token');
    // Navigate to the login page after logout
    this.router.navigate(['/login']);
    //set flag to indicate that the login component is active
    this.isLoginComponent = true;
  }
  // search method
  search():void{
    console.log('Search for:', this.searchterm);
    if (this.searchterm.trim() === '') {
      return;
    }

    this.http.get<Post[]>('/api/search', { params: { term: this.searchterm } })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred while searching', error);
          return throwError('Error occurred while searching');
        })
      )
      .subscribe((data: Post[]) => {
        console.log('Search results:', data);
        this.recentPostsService.updateRecentPosts(data);
        this.searchterm = ''; // Clear the search term after search
      });
  }
  //method to navigate to the homepage
  navigatetohomepage(): void{
    this.router.navigate(['/']);
  }
}