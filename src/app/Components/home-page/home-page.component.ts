import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostService } from '../../Services/post.service';
import { Post } from '../../Models/Post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  recentPosts: Post[] = []// Array to store recent posts
  postService : PostService = inject(PostService)// Service for fetching posts
  router: Router = inject(Router)// Router service for navigation

  ngOnInit(): void {
    // Fetch recent posts when component initializes
    this.postService.getRecentPosts()
      .subscribe(posts => {
        this.recentPosts = posts;// Assign fetched posts to recentPosts array
      });
  }
  // Method to navigate to a specific post
  navigateToPost(postId: number): void {
    this.router.navigate(['/post', postId]);// Navigate to the post detail page with postId as route parameter
  }
}