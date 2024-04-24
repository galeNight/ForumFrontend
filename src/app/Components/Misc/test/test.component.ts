import { Component, inject } from '@angular/core';
import { ProfileService } from '../../../Services/profile.service';
import { CommonModule } from '@angular/common';
import { userProfile } from '../../../Models/userProfile';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule,MatButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  
  profile?: userProfile;// Variable to hold the user profile
  profileService = inject(ProfileService)// Injected ProfileService for fetching user profile
  switchEdit: boolean = true// Variable to switch between edit mode and display mode

  ngOnInit(): void {
    // Assign the fetched profile to the 'profile' variable
    this.profileService.getPersonalProfile().subscribe(
      response => {
        this.profile = response;// Assign the fetched profile to the 'profile' variable
      },
      error => {
        console.error('Failed to load profile:', error);// Log error if profile loading fails
        // Handle error (optional)
      }
    );
  }
}