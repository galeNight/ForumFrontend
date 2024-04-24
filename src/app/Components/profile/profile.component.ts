import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { userProfile } from '../../Models/userProfile';
import { userAccount } from '../../Models/UserAccount';
import { ProfileService } from '../../Services/profile.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialog, MatDialogModule} from '@angular/material/dialog'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { jwtDecode } from "jwt-decode";

import { EditWindowComponent } from './edit-window/edit-window.component';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatDialogModule,
    EditWindowComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profile?: userProfile;// Variable to hold the user profile
  privateUser?:userAccount; // Variable to hold the private user account details
  profileService = inject(ProfileService);// Injected ProfileService for fetching user profiles
  route = inject(ActivatedRoute); // Injected ActivatedRoute for accessing route parameters
  router: Router = inject(Router)// Router service for navigation
  dialog: MatDialog = inject(MatDialog)// MatDialog for opening dialogs
  
  authService: AuthService = inject(AuthService)// AuthService for authentication

  isTokenValid: boolean = false;// Flag to indicate if the token is valid
  isPrivateProfile: boolean = false;// Flag to indicate if the profile being viewed is private
  EditBtn: boolean = false;// Flag to indicate if the edit button is clicked
  notVerifedForPrivateDetails: boolean = true;// Flag to indicate if the user is not verified for private details
  

  ngOnInit(): void {
    // Check token validity when the component initializes
    const tokenValidity = this.authService.checkTokenValidity();
    if (tokenValidity === true){
      this.isTokenValid = true;// Set isTokenValid flag to true if the token is valid
    }
    else{
      this.isTokenValid = false;// Set isTokenValid flag to false if the token is invalid
      console.log(tokenValidity)
    }
    this.loadProfile();// Load the user profile
  }

  // Method to check if the user is on their personal profile
  isUserOnPersonalProfile(): void {
    const userIdToValidate: number = +this.route.snapshot.params['id']; // Get the ID from route parameters and ensure it's a number with '+'
    if (!userIdToValidate) {
      console.error('User ID is not provided or invalid.');
      this.isPrivateProfile = false;// Set isPrivateProfile flag to false if the user ID is not provided or invalid
      return;
    }
    if (this.isTokenValid){
      // Validate user ID if the token is valid
      this.authService.validateUserId(userIdToValidate).subscribe({
        next: (isValid) => {
          console.log('User validation status:', isValid);// Log the validation status
          this.isPrivateProfile = isValid;// Set isPrivateProfile flag based on the validation status
        },
        error: (error) => {
          this.isPrivateProfile = false;// Set isPrivateProfile flag to false if there's an error during validation
          console.error('Error validating user:', error.message || 'An unknown error occurred while validating the user.');
        }
      }); 
    }
    else{
      console.log('Token is invalid or not present.');
      this.isPrivateProfile = false;// Set isPrivateProfile flag to false if the token is invalid or not present
    }
  
  }
  // Method to load the user profile
  private loadProfile(): void {
    const id: number = +this.route.snapshot.params['id']; // Convert to number to ensure correct type
    // Check if there is an ID in the route parameters to determine if we're viewing another user's profile
    if (id) {
      this.isUserOnPersonalProfile();// Check if the user is on their personal profile
      this.fetchProfile(id);// Fetch the profile if there's an ID in the route parameters
    } else {
      if (this.isTokenValid === true) {
        this.isPrivateProfile = true;// Set isPrivateProfile flag to true if the token is valid
        this.fetchPersonalProfile();// Fetch the personal profile if there's no ID in the route parameters
      } else {
        // Token is invalid or not present; navigate back to a default or login page
        this.router.navigate(['login']);
      }
    }
  }
  // Method to fetch the personal profile
  private fetchPersonalProfile(): void {
    this.profileService.getPersonalProfile().subscribe(
      response => this.profile = response, // Assign the fetched profile to the profile variable
      error => console.error('Failed to load personal profile:', error)// Log error if failed to load personal profile
    );
  }
  
  private fetchProfile(id: number): void {
    this.profileService.getProfile(id).subscribe(
      response => this.profile = response,// Assign the fetched profile to the profile variable
      error => console.error('Failed to load profile:', error)// Log error if failed to load profile
    );
  }
  // Method to switch the EditBtn flag
  switchEditBtn(){
    this.EditBtn = !this.EditBtn;// Toggle the EditBtn flag
  }
  // Method to show the edit window dialog
  showDialogue(){
    const dialogRef = this.dialog.open(EditWindowComponent, {
      height: '275px',
      width: '450px',
      disableClose: true// Disable closing the dialog by clicking outside of it
    });
  
    dialogRef.afterClosed().subscribe(async result => {
      if (result === true){
        this.notVerifedForPrivateDetails = false;// Set notVerifedForPrivateDetails flag to false if the result is true
        this.privateUser = await this.authService.fetchAccountDetails()// Fetch the private user account details
      }
    });
  }
}