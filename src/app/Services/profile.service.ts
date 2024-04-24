import { Injectable, inject } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { userAccount } from '../Models/UserAccount';
import { Observable, throwError } from 'rxjs';
import { userProfile } from '../Models/userProfile';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http: HttpClient = inject(HttpClient);// Injecting HttpClient instance
  url : string = `${environment.apiBaseUrl}/Profile`;// Base URL for profile-related API endpoints
  // Method to fetch personal profile of the authenticated user
  getPersonalProfile(): Observable<userProfile> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // No token found, return an observable error
      return throwError(() => new Error('No JWT token available.'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`// Set Authorization header with JWT token
    });

    return this.http.get<userProfile>(`${this.url}/Personal`, { headers }).pipe(
      catchError(error => {
        // Handle HTTP errors
        return throwError(() => new Error('Error fetching personal profile: ' + error));
      })
    );
  }
  // Method to fetch user profile by ID
  getProfile(id: number): Observable<userProfile> {
    return this.http.get<userProfile>(`${this.url}/${id}`).pipe(
      catchError(error => {
        // Handle HTTP errors
        return throwError(() => new Error('Error fetching user profile: ' + error));
      })
    );
  }
}