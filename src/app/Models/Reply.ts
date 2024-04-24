import {LikeStats} from "./Like"// Importing the LikeStats interface from the Like module
// Interface representing a reply to a comment
export interface Reply {
    replyID : number // Unique identifier for the reply
    postID : number // ID of the post to which the reply belongs
    commentID : number // ID of the comment to which the reply is made
    userID : number // ID of the user who posted the reply
    likes? : LikeStats // Optional statistics about the likes received by the reply
    replyContent : string // Content of the reply
    created : Date // Timestamp indicating when the reply was created
}