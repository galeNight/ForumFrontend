import { LikeStats } from "./Like"// Importing the LikeStats interface from the Like module
import { Post } from "./Post"// Importing the Post interface from the Post module
import { Reply } from "./Reply"// Importing the Reply interface from the Reply module
import { userProfile } from "./userProfile"// Importing the userProfile interface from the userProfile module

// Interface definition for a Post Comment
export interface PostComment {
    commentID : number // Unique identifier for the comment
    commentContent : string // Content of the comment
    postID : number // ID of the post to which the comment belongs
    post? : Post // Optional reference to the post associated with the comment
    userID : number // ID of the user who made the comment
    profile? : userProfile // Optional reference to the user profile of the commenter
    likes? : LikeStats // Optional statistics about the likes received by the comment
    replies? : Reply[] // Optional array of replies to the comment
    created : Date // Timestamp indicating when the comment was created
}