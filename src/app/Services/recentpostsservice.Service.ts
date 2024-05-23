import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Post } from '../Models/Post';

@Injectable({
  providedIn: 'root'
})
export class RecentPostsService {
  private recentPostsSubject = new BehaviorSubject<Post[]>([]);
  recentPosts$ = this.recentPostsSubject.asObservable();

  updateRecentPosts(posts: Post[]): void {
    this.recentPostsSubject.next(posts);
  }
}
