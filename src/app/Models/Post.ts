import { topic } from "./Topic"
import { userProfile } from "./userProfile"

export interface Post {
    postID: number
    title : string
    postContent : string
    userID : number
    userProfile? : userProfile
    topicID : number
    topic? : topic
    postCreated : Date
}