import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MapMessagesService {

  constructor(private matSnackBar: MatSnackBar) { }

  showMapMessage(message: string, action: string,
    hPosition?: any, vPosition? : any,
    className?: any ) {
    this.matSnackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: hPosition ? hPosition : 'center',
      verticalPosition: vPosition ? vPosition : 'top',
      panelClass: className
    });
  }

  // callMapMsgService() {
  //   this.mapMsgService.showMapMessage(
  //     'Common code to implement using service',
  //     'Okey', 'center', 'top', 'snack-style');
  // }
}