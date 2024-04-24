import { Component, inject } from '@angular/core';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../Services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-window',
  standalone: true,
  imports: [MatDialogModule,FormsModule,MatInputModule,MatButton],
  templateUrl: './edit-window.component.html',
  styleUrl: './edit-window.component.css'
})
export class EditWindowComponent {
  dialogRef: MatDialogRef<EditWindowComponent> = inject(MatDialogRef<EditWindowComponent>)// Reference to the dialog
  password: string = '';// Variable to hold the password entered by the user
  authService: AuthService = inject(AuthService)// AuthService for authentication

  // Method to handle cancel action when the user closes the dialog
  CancelAction(){
    this.dialogRef.close(false);// Close the dialog with 'false' result
  }
  // Method to handle confirm action when the user submits the password
  async confirmAction() {
    try {
      // Check if the entered password is correct asynchronously
      const isPasswordTrue = await this.authService.isPasswordCorrect(this.password);
      console.log(isPasswordTrue);// Log the result of password verification
      this.dialogRef.close(isPasswordTrue);// Close the dialog with the result of password verification
    } catch (error) {
      console.error('Error checking password', error);// Log error if password verification fails
      this.dialogRef.close(false);// Close the dialog with 'false' result
    }
  }
}