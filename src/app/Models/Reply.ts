import {LikeStats} from "./Like"
export interface Reply {
    replyID : number
    postID : number
    commentID : number
    userID : number
    likeStats : LikeStats
    replyContent : string
    created : Date
}