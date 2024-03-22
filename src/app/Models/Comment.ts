import { LikeStats } from "./Like"
import { Post } from "./Post"
import { Reply } from "./Reply"
import { userProfile } from "./userProfile"

export interface PostComment {
    commentID : number
    commentContent : string
    postID : number
    post? : Post
    userID : number
    profile? : userProfile
    likes? : LikeStats
    replies? : Reply[]
    created : Date
}