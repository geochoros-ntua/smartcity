import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

export interface MessageOptions {
    message: string;
    action: string;
    duration?: number;
    hPosition?: MatSnackBarHorizontalPosition;
    vPosition? : MatSnackBarVerticalPosition;
    styleClass? : string;
  }
  