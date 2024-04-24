import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Like, postType } from '../Models/Enums';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { LikeStats } from '../Models/Like';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class LikeService {
    // URLs for different types of content
    postUrl: string = environment.apiBaseUrl + "/Post"
    commentUrl: string = environment.apiBaseUrl + "/Comment"
    replyUrl: string = environment.apiBaseUrl + "/Reply"
    authService: AuthService = inject(AuthService) // Inject AuthService for token validation
    constructor(private http: HttpClient) { }
    // Method to get like statistics for a post, comment, or reply
    getLikesOrDislikes(postTypeGiven: postType, Id: number){
        let nonAuthorizedLikes = false;
        const tokenValidity = this.authService.checkTokenValidity();
        // Check token validity and set nonAuthorizedLikes flag accordingly
        if (tokenValidity !== true) {
            nonAuthorizedLikes = true;
        }
        // Retrieve the JWT token from local storage
        const token = localStorage.getItem('auth_token');
        // Determine the base URL based on the post type and authorization status
        let baseUrl: string;
        switch (postTypeGiven) {
            case postType.POST:
                baseUrl = nonAuthorizedLikes ? `${this.postUrl}/get-likes/` : `${this.postUrl}/get-likes-user/`;
                break;
            case postType.COMMENT:
                baseUrl = nonAuthorizedLikes ? `${this.commentUrl}/get-likes/` : `${this.commentUrl}/get-likes-user/`;
                break;
            case postType.REPLY:
                baseUrl = nonAuthorizedLikes ? `${this.replyUrl}/get-likes/` : `${this.replyUrl}/get-likes-user/`;
                break;
            default:
                throw new Error('Invalid post type');
        }

        let url = `${baseUrl}${Id}`;
        console.log(url);
        // Set the Authorization header if the token exists
        const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
        // Make a GET request to retrieve like statistics
        return this.http.get<LikeStats>(url, { headers });
    }
    // Method to create a new like or dislike for a post, comment, or reply
    async createLikeOrDislike(contentId: number, contentType: postType, like: Like) {
        // Validate the like status
        if (like === Like.NONE) {
            throw new Error('Unsupported like status: NONE');
        }
        // Retrieve JWT token from local storage
        const token = localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('Authentication required: No JWT token available.');
        }
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

        // Map content types to corresponding URLs
        const contentTypeUrlMap = {
            [postType.POST]: `${this.postUrl}/send-likes`,
            [postType.COMMENT]: `${this.commentUrl}/send-likes`,
            [postType.REPLY]: `${this.replyUrl}/send-likes`
        };
        // Get the URL for the specified content type
        const url = contentTypeUrlMap[contentType];
        if (!url) {
            throw new Error('Unsupported content type');
        }

        // Construct the request body
        const body = { userID: 0, contentID: contentId, status: like };

        // Execute the POST request to create the like or dislike
        return firstValueFrom(this.http.post<number>(url, body, { headers }));
    }
}