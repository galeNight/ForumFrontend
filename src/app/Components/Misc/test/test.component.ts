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
  
  profile?: userProfile;
  profileService = inject(ProfileService)
  switchEdit: boolean = true

  ngOnInit(): void {
    this.profileService.getPersonalProfile().subscribe(
      response => {
        this.profile = response;
      },
      error => {
        console.error('Failed to load profile:', error);
        // Handle error
      }
    );
  }
}