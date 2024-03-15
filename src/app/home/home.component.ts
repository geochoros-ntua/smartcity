import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DarkThemeService } from './../shared/dark-theme/dark-theme.service';
import { TranslateService } from './../shared/translate/translate.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { EventDialogComponent } from '../shared/event-dialog/event-dialog.component';
import { AppMessagesService } from '../shared/messages.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  imageURL = 'assets/images/front_';

  imgSrc = '';

  lang = 'gr';

  innerWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  isDarkTheme: boolean = false;

  constructor(
    private translateService: TranslateService,
    private darkThemeService: DarkThemeService,
    private appMessagesService: AppMessagesService,
    public dialog: MatDialog
  ) {
    this.translateService.lang$.subscribe((value) => {
      this.lang = value.toString();
    });
    this.lang = this.translateService.getLang();

    this.darkThemeService.isDarkTheme$.subscribe((status) => {
      this.isDarkTheme = status;
    });
  }

  ngOnInit(): void {
    let num = 1;
    this.imgSrc = this.imageURL + num + '.jpg';
    let secs = 9;

    setInterval(() => {
      this.imgSrc = this.imageURL + num + '.jpg';
      num = num === 8 ? 1 : ++num;
    }, secs * 1000);

    this.showEventDialog();
  }

  showEventDialog() {
    if (
      !this.appMessagesService.eventDialogViewed &&
      new Date(2024, 2, 29).valueOf() > new Date().valueOf()
    ) {
      this.dialog
        .open(EventDialogComponent, { panelClass: 'events-dialog' })
        .afterClosed()
        .subscribe(() => {
          this.appMessagesService.eventDialogViewed = true;
        });
    }
  }

  getBgStyle() {
    return {
      backgroundImage: `url(${this.imgSrc})`,
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
    };
  }

  scrollDown() {
    window.scrollBy(0, window.innerHeight);
  }
}
