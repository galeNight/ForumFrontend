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

interface SearchResult{
  id:number;
  title:string;
  content:string;
  type:string;
}

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
  searchResults: SearchResult[] = [] // Array to store search results 
  recentPosts: Post[] = [] // Array to store recent posts
  searchterm: string = "" // Variable to store the search term

  ngOnInit():void{
    this.recentPostsService.recentPosts$.subscribe(posts => { // Subscribe to the recentPosts observable to get the latest posts
      this.recentPosts = posts;
    })
  }

  constructor(private recentPostsService: RecentPostsService) {
    this.router.events.subscribe(event => {// Subscribe to router events
      if (event instanceof NavigationEnd) {
        this.isLoginComponent = event.url.includes('/login');// When the router detects navigation, check if the current route is the login component
      }
    });

  }
    navigateToLogin() { // Method to navigate to the login page
      this.router.navigate(['/login']); // Navigate to '/login' route
      this.isLoginComponent = true; // Set flag to indicate that the login component is active
    }

  logout(): void{ //methode to handle logout
    localStorage.removeItem('auth_token'); // Clear the authentication token 
    this.router.navigate(['/login']);// Navigate to the login page after logout
    this.isLoginComponent = true; //set flag to indicate that the login component is active
  }

  search():void{// search method
    if (this.searchterm.trim() ===""){
      return;
    }
    this.searchResults = this.recentPosts.filter(post => // Filter the recentPosts array to find matches based on the search term
      post.title.includes(this.searchterm) || post.postContent.includes(this.searchterm)
    ).map(post => ({
      id: post.postID,
      title: post.title,
      content: post.postContent,
      type: 'post'
    }));
    const posts = this.searchResults.map(this.convertSearchResultToPost);//Update recent post service with the search results
    this.recentPostsService.updateRecentPosts(posts);
    this.searchterm = "";
   }

  navigatetohomepage(): void{//method to navigate to the homepage
    this.router.navigate(['/']);
  }

  navigateToPost(postID: number): void{//method to navigate to a specific post
    this.router.navigate(['/post', postID]);
  }

  SearchResult(result:SearchResult):void{
    this.navigateToPost(result.id)
  }
  
  private convertSearchResultToPost(result: SearchResult): Post {
    return {
      postID: 0,
      title: result.title,
      postContent: result.content,
      userID: 0,
      topicID: 0,
      postCreated: new Date()
    };
  }
}