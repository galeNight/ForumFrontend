import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { userAccount } from '../Models/UserAccount';
import { Observable, throwError,firstValueFrom, lastValueFrom  } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginUrl: string = `${environment.apiBaseUrl}/Auth/login`;
  validateUrl: string = `${environment.apiBaseUrl}/Auth/validateUserId`;
  accountDetailsUrl: string = `${environment.apiBaseUrl}/Auth/account-details`;
  passwordCheckerUrl: string = `${environment.apiBaseUrl}/Auth/password-checker`;
  http: HttpClient = inject(HttpClient)  constructor(private http: HttpClient) {}


  // Send userAccount to server which then test if it
  login(userAcc : userAccount){
    return this.http.post<{token: string}>(this.loginUrl, userAcc)
    .pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.token);
      }),
      catchError(error => {
        // Handle HTTP errors
        throw error;
      })
    );
  }

  checkTokenValidity(): boolean | string {
    const token = this.getAuthToken();
    if (!token) {
        return 'No token found.';
    }
    try {
        const decoded = jwtDecode<any>(token); // Decodes the token
        const isTokenValid = decoded.exp > Date.now() / 1000;
        if (!isTokenValid) {
            localStorage.removeItem('auth_token');
            return 'Token has expired.';
        } else {
            return true; // The token is valid
        }
    } catch (error) {
        return 'Error decoding token.'+error;
    }
}


  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  // If this token is there, return true. This dosen't check if the token is still valid
  isLoggedIn() {
    return !!this.getAuthToken();
  }

  logout() {
    localStorage.removeItem('auth_token');
  }


  validateUserId(id: number): Observable<boolean> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // No token found, return an observable error
      return throwError(() => new Error('No JWT token available.'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    return this.http.get<boolean>(`${this.validateUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        // Handle HTTP errors
        return throwError(() => new Error('Error fetching when Validating user: ' + error));
      })
    );
  }

  isPasswordCorrect(password: string) {
    const encodedPassword = encodeURIComponent(password);
    const body = { encodedPassword: encodedPassword };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.post<boolean>(this.passwordCheckerUrl+"/"+encodedPassword, { headers }));
  }


  async fetchAccountDetails() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No JWT token available.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    try {
      const accountDetails = await lastValueFrom(
        this.http.get<userAccount>(this.accountDetailsUrl, { headers })
      );
      return accountDetails; // This will be of type userAccount
    } catch (error: any) { 
      const errorMsg = error.error?.message || 'Error fetching account details';
      throw new Error(errorMsg + ': ' + (error.message || 'Unknown error'));
    }
  }
}