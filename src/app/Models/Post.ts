import { topic } from "./Topic" // Importing the topic interface from the Topic module
import { userProfile } from "./userProfile" // Importing the userProfile interface from the userProfile module

export interface Post {
    postID: number // Unique identifier for the post
    title : string // Title of the post
    postContent : string // Content of the post
    userID : number // ID of the user who created the post
    userProfile? : userProfile // Optional reference to the user profile of the post creator
    topicID : number // ID of the topic/category to which the post belongs
    topic? : topic // Optional reference to the topic/category object
    postCreated : Date // Timestamp indicating when the post was created
}