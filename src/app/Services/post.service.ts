import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from '../Models/Post';
import { environment } from '../../environments/environment';
import { Observable, firstValueFrom } from 'rxjs';
import { Reply } from '../Models/Reply';
import { PostComment } from '../Models/Comment';
import {Like, postType} from '../Models/Enums'


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

  getRepliesForSpecificComment(commentId: number){
    return this.http.get<Reply[]>(`${this.replyUrl}/comment/${commentId}`);
  }
}