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
    replies? : Reply[]
    created : Date
}