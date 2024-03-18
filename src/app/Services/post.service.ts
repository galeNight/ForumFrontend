import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../Models/Post';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Reply } from '../Models/Reply';
import { PostComment } from '../Models/Comment';
import { postLike } from '../Models/Like';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  postUrl : string = environment.apiBaseUrl+"/Post"
  commentUrl  : string = environment.apiBaseUrl+"/Comment"
  replyUrl : string = environment.apiBaseUrl+"/Reply"
  
  constructor(private http: HttpClient) {}
  
  getRecentPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postUrl);
  }
  
  getPostById(postId:number){
    return this.http.get<Post>(`${this.postUrl}/${postId}`);
  }
  
  getCommentsForPost(postId : number){
    return this.http.get<PostComment[]>(`${this.commentUrl}/post/${postId}`);
  }

  getRepliesForSpecficComment(commentId: number){
    return this.http.get<Reply[]>(`${this.replyUrl}/comment/${commentId}`);
  }

  getPostLikesForPost(postId: number){
    return this.http.get<postLike[]>(`${this.postUrl}/get-likes/${postId}`);
  }

  createLikeForPost(like: postLike){
    return this.http.post<postLike>(`${this.postUrl}/send-likes`,like)
  }
}
