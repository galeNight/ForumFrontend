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
  recentPosts: Post[] = []
  postService : PostService = inject(PostService)
  router: Router = inject(Router)

  ngOnInit(): void {
    this.postService.getRecentPosts()
      .subscribe(posts => {
        this.recentPosts = posts;
      });
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/post', postId]);
  }
}