export interface postLike {
    userID : number
    commentID : number
    status : Like
}


export interface replyLike {
    userID : number
    commentID : number
    status : Like
}

export enum Like {
    Dislike,
    Like
}