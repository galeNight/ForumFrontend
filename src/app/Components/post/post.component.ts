import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PostService } from '../../Services/post.service';
import { Post } from '../../Models/Post';
import { MatIconModule } from '@angular/material/icon';
import { Reply } from '../../Models/Reply';
import { PostComment } from '../../Models/Comment';
import { Like, postLike } from '../../Models/Like';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'] 
})
export class PostComponent {
  selectedId: number = 0;
  postDetails!: Post;
  route: ActivatedRoute = inject(ActivatedRoute);
  postService: PostService = inject(PostService);
  commentSectionIsOpened: boolean = false;
  comments : PostComment[] = [];

  postLikes: postLike[] = [];
  openedReplies = new Set<number>();

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = Number(params.get('id'));
        // Resetting comments and likes for new post
        this.comments = [];
        this.postService.getPostLikesForPost(this.selectedId)
        .subscribe(postlikes =>{
          this.postLikes = postlikes
        });
        this.commentSectionIsOpened = false;
        this.openedReplies.clear(); 
        return this.postService.getPostById(this.selectedId);
      })
    ).subscribe(post => {
      this.postDetails = post;
    });
  }

  getTotalLikes(): number {
    return this.postLikes.filter(like => like.status === Like.Like).length;
  }
  getTotaDislLikes(): number {
    return this.postLikes.filter(like => like.status === Like.Dislike).length;
  }

  likePost(){
    
  }
  
  toggleCommentsForPost(){
    this.commentSectionIsOpened = !this.commentSectionIsOpened;

    if (this.commentSectionIsOpened && (!this.comments || this.comments.length === 0)){
        this.postService.getCommentsForPost(this.selectedId)
        .subscribe(Comments => {
          this.comments = Comments;
        });
      }
  }

  toggleRepliesForComment(comment : PostComment): void {
    if (this.openedReplies.has(comment.commentID)) {
      this.openedReplies.delete(comment.commentID);
    } else {
      
      this.openedReplies.add(comment.commentID);

      if (!comment.replies || comment.replies.length === 0){
        this.postService.getRepliesForSpecficComment(comment.commentID)
        .subscribe(replies => {
          comment.replies = replies;
        });
      }
    }
  }
}