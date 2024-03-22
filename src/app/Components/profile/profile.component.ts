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
  imports: [CommonModule,MatButtonModule,MatExpansionModule,MatDialogModule,EditWindowComponent,MatFormFieldModule,MatInputModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profile?: userProfile;
  privateUser?:userAccount; 
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute); 
  router: Router = inject(Router)
  dialog: MatDialog = inject(MatDialog)

  authService: AuthService = inject(AuthService)

  isTokenValid: boolean = false;
  isPrivateProfile: boolean = false;
  EditBtn: boolean = false;
  notVerifedForPrivateDetails: boolean = true;
  

  ngOnInit(): void {
    const tokenValidity = this.authService.checkTokenValidity();
    if (tokenValidity === true){
      this.isTokenValid = true;
    }
    else{
      this.isTokenValid = false;
      console.log(tokenValidity)
    }
    this.loadProfile();
  }

  // For checking if you on a public link to your profile
  isUserOnPersonalProfile(): void {
    const userIdToValidate: number = +this.route.snapshot.params['id']; // Get the ID from route parameters and ensure it's a number with '+'
    if (!userIdToValidate) {
      console.error('User ID is not provided or invalid.');
      this.isPrivateProfile = false;
      return;
    }
    if (this.isTokenValid){
      this.authService.validateUserId(userIdToValidate).subscribe({
        next: (isValid) => {
          this.isPrivateProfile = isValid;
          console.log('User validation status:', isValid);
        },
        error: (error) => {
          this.isPrivateProfile = false;
          console.error('Error validating user:', error.message || 'An unknown error occurred while validating the user.');
        }
      }); 
    }
    else{
      this.isPrivateProfile = false;
    }
  
  }

  
  private loadProfile(): void {
    const id: number = +this.route.snapshot.params['id']; // Convert to number to ensure correct type
    // Check if there is an ID in the route parameters to determine if we're viewing another user's profile
    if (id) {
      this.isUserOnPersonalProfile();
      this.fetchProfile(id);
    } else {
      if (this.isTokenValid === true) {
        this.isPrivateProfile = true;
        this.fetchPersonalProfile();
      } else {
        // Token is invalid or not present; navigate back to a default or login page
        this.router.navigate(['login']);
      }
    }
  }

  private fetchPersonalProfile(): void {
    this.profileService.getPersonalProfile().subscribe(
      response => this.profile = response,
      error => console.error('Failed to load personal profile:', error)
    );
  }

  private fetchProfile(id: number): void {
    this.profileService.getProfile(id).subscribe(
      response => this.profile = response,
      error => console.error('Failed to load profile:', error)
    );
  }

  switchEditBtn(){
    this.EditBtn = !this.EditBtn;
  }


  showDialogue(){
    const dialogRef = this.dialog.open(EditWindowComponent, {
      height: '275px',
      width: '450px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(async result => {
      if (result === true){
        this.notVerifedForPrivateDetails = false;
        this.privateUser = await this.authService.fetchAccountDetails()
      }
    });
  }
}