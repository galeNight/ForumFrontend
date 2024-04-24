import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from '../Models/Post';
import { environment } from '../../environments/environment';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import { Reply } from '../Models/Reply';
import { PostComment } from '../Models/Comment';
import {Like, postType} from '../Models/Enums'


@Injectable({
  providedIn: 'root'
})
export class PostService {
  // Base URLs for different types of content
  postUrl : string = environment.apiBaseUrl+"/Post"
  commentUrl  : string = environment.apiBaseUrl+"/Comment"
  replyUrl : string = environment.apiBaseUrl+"/Reply"
  
  constructor(private http: HttpClient) {}
  // Method to fetch recent posts
  getRecentPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postUrl);
  }
  // Method to fetch a post by its ID
  getPostById(postId:number){
    return this.http.get<Post>(`${this.postUrl}/${postId}`);
  }
  // Method to fetch comments for a post by its ID
  getCommentsForPost(postId : number){
    return this.http.get<PostComment[]>(`${this.commentUrl}/post/${postId}`);
  }
  // Method to fetch replies for a specific comment by its ID
  getRepliesForSpecificComment(commentId: number){
    return this.http.get<Reply[]>(`${this.replyUrl}/comment/${commentId}`);
  }
}