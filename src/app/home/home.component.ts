import { DarkThemeService } from './../shared/dark-theme/dark-theme.service';
import { TranslateService } from './../shared/translate/translate.service';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imageURL = "assets/images/front_"

  imgSrc = '';

  lang = 'gr';

  innerWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  isDarkTheme: boolean = false;

  constructor(private translateService: TranslateService, private darkThemeService: DarkThemeService) {
    this.translateService.lang$.subscribe(value => {
      this.lang = value.toString();
    });
    this.lang = this.translateService.getLang();

    this.darkThemeService.isDarkTheme$.subscribe(status => {
      this.isDarkTheme = status;
    });

  }

  ngOnInit(): void {

    let num = 1;
    this.imgSrc = this.imageURL + num + '.jpg';
    let secs = 9;

    setInterval(() => {

      this.imgSrc = this.imageURL + num + '.jpg';
      num = (num === 8) ? 1 : ++num;
    }, secs * 1000);

  }

  getBgStyle() {
    return {
      backgroundImage: `url(${this.imgSrc})`,
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    }
  }

  scrollDown() {
    window.scrollBy(0, window.innerHeight);
  }





}
