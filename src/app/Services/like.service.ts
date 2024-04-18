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
    postUrl: string = environment.apiBaseUrl + "/Post"
    commentUrl: string = environment.apiBaseUrl + "/Comment"
    replyUrl: string = environment.apiBaseUrl + "/Reply"
    authService: AuthService = inject(AuthService)
    constructor(private http: HttpClient) { }

    getLikesOrDislikes(postTypeGiven: postType, Id: number){
        let nonAuthorizedLikes = false;
        const tokenValidity = this.authService.checkTokenValidity();

        if (tokenValidity !== true) {
            nonAuthorizedLikes = true;
        }

        // Retrieve the JWT token from local storage
        const token = localStorage.getItem('auth_token');
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

        return this.http.get<LikeStats>(url, { headers });
    }

    async createLikeOrDislike(contentId: number, contentType: postType, like: Like) {

        if (like === Like.NONE) {
            throw new Error('Unsupported like status: NONE');
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('Authentication required: No JWT token available.');
        }
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

        // Map content types to URLs
        const contentTypeUrlMap = {
            [postType.POST]: `${this.postUrl}/send-likes`,
            [postType.COMMENT]: `${this.commentUrl}/send-likes`,
            [postType.REPLY]: `${this.replyUrl}/send-likes`
        };

        const url = contentTypeUrlMap[contentType];
        if (!url) {
            throw new Error('Unsupported content type');
        }

        // Construct the body based on the like type and content ID
        const body = { userID: 0, contentID: contentId, status: like };

        // Execute the request and return the response
        return firstValueFrom(this.http.post<number>(url, body, { headers }));
    }
}