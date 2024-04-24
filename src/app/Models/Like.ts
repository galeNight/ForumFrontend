import { Like } from "./Enums" // Importing the Like enum from the Enums module
// Interface representing statistics about likes and dislikes
export interface LikeStats{
    totalLikes: number; // Total number of likes
    totalDislikes: number; // Total number of dislikes
    pressedLikeButton?: Like // Optional property representing the current state of the like button
}
// Interface representing an action related to liking or disliking content
export interface LikeDislikeAction{
    userID: number; // ID of the user performing the action
    contentID: number; // ID of the content being liked or disliked
    status: Like; // Status indicating whether the action is a like, dislike, or none
}