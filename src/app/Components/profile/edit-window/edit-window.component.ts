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
  dialogRef: MatDialogRef<EditWindowComponent> = inject(MatDialogRef<EditWindowComponent>)
  password: string = '';
  authService: AuthService = inject(AuthService)

  CancelAction(){
    this.dialogRef.close(false);
  }

  async confirmAction() {
    try {
      const isPasswordTrue = await this.authService.isPasswordCorrect(this.password);
      console.log(isPasswordTrue);
      this.dialogRef.close(isPasswordTrue);
    } catch (error) {
      console.error('Error checking password', error);
      this.dialogRef.close(false);
    }
  }

}