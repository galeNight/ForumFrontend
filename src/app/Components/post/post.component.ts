import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PostService } from '../../Services/post.service';
import { Post } from '../../Models/Post';
import { MatIconModule } from '@angular/material/icon';
import { PostComment } from '../../Models/Comment';
import { firstValueFrom } from 'rxjs';
import { Like, postType } from '../../Models/Enums';
import { LikeService } from '../../Services/like.service';
import { LikeStats } from '../../Models/Like';
import { AuthService } from '../../Services/auth.service';
import { userProfile } from '../../Models/userProfile';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  selectedId: number = 0;
  postDetails!: Post;
  route: ActivatedRoute = inject(ActivatedRoute);
  postService: PostService = inject(PostService);
  likeService: LikeService = inject(LikeService)
  authService: AuthService = inject(AuthService)
  commentSectionIsOpened: boolean = false;
  comments: PostComment[] = [];
  profileLinks: userProfile[] = []; // Contain names for comments and replies + other details.

  openedReplies = new Set<number>(); // includes every induvidual opened reply section id.
  postLikeStatus: LikeStats = { totalLikes: 0, totalDislikes: 0 }
  Like = Like;
  postType = postType;
  disabledLikes: Boolean = false;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = Number(params.get('id'));
        // Single call to get both likes and dislikes
        return this.likeService.getLikesOrDislikes(postType.POST, this.selectedId);
      })
    ).subscribe((likeStats: LikeStats) => {
      this.postLikeStatus = likeStats;
      this.comments = [];
      this.commentSectionIsOpened = false;
      this.openedReplies.clear();

      this.postService.getPostById(this.selectedId).subscribe(post => {
        this.postDetails = post;
      });
    });

    const tokenValidity = this.authService.checkTokenValidity();

    if (tokenValidity !== true) {
      this.disabledLikes = true;
    }

  }

  TestlikeOrDislike(id: number, contentType: postType, SendLike: Like, likestats: LikeStats | undefined) {
    if (likestats !== undefined) {
      if (SendLike === Like.LIKE) {
        this.likeService.createLikeOrDislike(id, contentType, Like.LIKE);
        if (likestats.pressedLikeButton === Like.LIKE) {
          likestats.pressedLikeButton = Like.NONE
          likestats.totalLikes--;
        }
        else if (likestats.pressedLikeButton === Like.DISLIKE) {
          likestats.pressedLikeButton = Like.LIKE;
          likestats.totalLikes++;
          likestats.totalDislikes--;
        }
        else if (likestats.pressedLikeButton === Like.NONE) {
          likestats.pressedLikeButton = Like.LIKE;
          likestats.totalLikes++;
        }
      }
      else if (SendLike === Like.DISLIKE) {
        this.likeService.createLikeOrDislike(id, contentType, Like.DISLIKE);
        if (likestats.pressedLikeButton === Like.LIKE) {
          likestats.pressedLikeButton = Like.DISLIKE
          likestats.totalLikes--;
          likestats.totalDislikes++;
        }
        else if (likestats.pressedLikeButton === Like.DISLIKE) {
          likestats.pressedLikeButton = Like.NONE
          likestats.totalDislikes--;
        }
        else if (likestats.pressedLikeButton === Like.NONE) {
          likestats.pressedLikeButton = Like.DISLIKE
          likestats.totalDislikes++;
        }
      }
    }
  }
  toggleCommentsForPost() {
    this.commentSectionIsOpened = !this.commentSectionIsOpened;
    if (this.commentSectionIsOpened && (!this.comments || this.comments.length === 0)) {
      // Fetch call comments at once, then async with promise.all to get all of the likestats and return it to the specfic comment.
      //updatedComments contains every comment but now with new like stats.
      this.postService.getCommentsForPost(this.selectedId)
        .subscribe(async (Comments) => {
          // Use Promise.all to fetch likes stats in parallel for all comments
          const updatedComments = await Promise.all(Comments.map(async (comment) => {
            const likesStats: LikeStats = await firstValueFrom(
              this.likeService.getLikesOrDislikes(postType.COMMENT, comment.commentID)
            );
            return {
              // returns a new object with comment propties and with the likestats.
              ...comment,
              likes: {
                totalLikes: likesStats.totalLikes,
                totalDislikes: likesStats.totalDislikes,
                pressedLikeButton: likesStats.pressedLikeButton
              }
            };
          }));

          this.comments = updatedComments;
        });
    }
  }
  toggleRepliesForComment(comment: PostComment): void {
    if (this.openedReplies.has(comment.commentID)) {
      this.openedReplies.delete(comment.commentID);
    } else {
      this.openedReplies.add(comment.commentID);
      if (!comment.replies || comment.replies.length === 0) {
        this.postService.getRepliesForSpecificComment(comment.commentID)
          .subscribe(async (replies) => {
            const updatedReplies = await Promise.all(replies.map(async (reply) => {
              const likesStats = await firstValueFrom(
                this.likeService.getLikesOrDislikes(postType.REPLY, reply.replyID)
              );
              return {
                ...reply,
                likes: {
                  totalLikes: likesStats.totalLikes,
                  totalDislikes: likesStats.totalDislikes,
                  pressedLikeButton: likesStats.pressedLikeButton
                }
              };
            }));
            comment.replies = updatedReplies;
          });
      }
    }
  }
}