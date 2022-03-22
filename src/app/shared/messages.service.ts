import { Injectable } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar';
import { MessageOptions } from './api';


@Injectable({
  providedIn: 'root'
})


export class AppMessagesService {

  constructor(private matSnackBar: MatSnackBar) { }

  showMapMessage(messageOptions: MessageOptions ): void {
    this.matSnackBar.open(messageOptions.message, messageOptions.action, {
      duration: messageOptions.duration ? messageOptions.duration : 5000,
      horizontalPosition: messageOptions.hPosition ? messageOptions.hPosition : 'center',
      verticalPosition: messageOptions.vPosition ? messageOptions.vPosition : 'top',
      panelClass: ['map-snackbar']
    });
  }

}