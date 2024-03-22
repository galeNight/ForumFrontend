import { Like } from "./Enums"

export interface LikeStats{
    totalLikes: number;
    totalDislikes: number;
    pressedLikeButton?: Like
}

export interface LikeDislikeAction{
    userID: number;
    contentID: number;
    status: Like;
}