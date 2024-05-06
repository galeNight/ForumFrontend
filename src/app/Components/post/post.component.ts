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
  Like = Like;// Enum for like, dislike, or none
  postType = postType;// Enum for post, comment, or reply
  disabledLikes: Boolean = false;// Flag for disabling likes

  ngOnInit(): void {
    // Fetch post details and likes/dislikes stats when component initializes
    this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = Number(params.get('id'));
        //console.log("selected id", this.selectedId); //log for debugging
        // Single call to get both likes and dislikes
        return this.likeService.getLikesOrDislikes(postType.POST, this.selectedId);
      })
    ).subscribe((likeStats: LikeStats) => {
      this.postLikeStatus = likeStats;
      this.comments = [];// Clear existing comments
      this.commentSectionIsOpened = false;// Close comment section
      this.openedReplies.clear();// Clear opened replies
      // Fetch post details
      //console.log("selected id", this.selectedId);
      this.postService.getPostById(this.selectedId).subscribe(post => {
        this.postDetails = post;
        //console.log(post); // log for debugging
        //console.log(this.postDetails); //log for debugging
      });
    });
    // Check token validity to disable likes if not valid
    const tokenValidity = this.authService.checkTokenValidity();

    if (tokenValidity !== true) {
      this.disabledLikes = true;
    }

  }
  // Method to handle liking or disliking a post, comment, or reply
  TestlikeOrDislike(id: number, contentType: postType, SendLike: Like, likestats: LikeStats | undefined) {
    if (likestats !== undefined) {
      if (SendLike === Like.LIKE) {
        // Create or update like for the content
        this.likeService.createLikeOrDislike(id, contentType, Like.LIKE);
        // Update like stats based on the action
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
        // Create or update dislike for the content
        this.likeService.createLikeOrDislike(id, contentType, Like.DISLIKE);
        // Update like stats based on the action
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
  // Toggle visibility of comments for a post
  toggleCommentsForPost() {
    this.commentSectionIsOpened = !this.commentSectionIsOpened;
    if (this.commentSectionIsOpened && (!this.comments || this.comments.length === 0)) {
      // Fetch comments for the post and their respective like stats
      this.postService.getCommentsForPost(this.selectedId)
        .subscribe(async (Comments) => {
          // Use Promise.all to fetch likes stats in parallel for all comments
          const updatedComments = await Promise.all(Comments.map(async (comment) => {
            const likesStats: LikeStats = await firstValueFrom(
              this.likeService.getLikesOrDislikes(postType.COMMENT, comment.commentID)
            );
            return {
              // Returns a new object with comment properties and with the like stats
              ...comment,
              likes: {
                totalLikes: likesStats.totalLikes,
                totalDislikes: likesStats.totalDislikes,
                pressedLikeButton: likesStats.pressedLikeButton
              }
            };
          }));

          this.comments = updatedComments; // Update comments with new like stats
        });
    }
  }
  // Toggle visibility of replies for a comment
  toggleRepliesForComment(comment: PostComment): void {
    if (this.openedReplies.has(comment.commentID)) {
      this.openedReplies.delete(comment.commentID);
    } else {
      this.openedReplies.add(comment.commentID);
      if (!comment.replies || comment.replies.length === 0) {
        // Fetch replies for the comment and their respective like stats
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
            comment.replies = updatedReplies;// Update replies with new like stats
          }
        );
      }
    }
  }
}