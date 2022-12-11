import { Component, OnInit } from "@angular/core";
import { TranslateService } from "./translate.service";


@Component({
  selector: "app-translate",
  templateUrl: "./translate.component.html",
  styleUrls: ["./translate.component.scss"]
})
export class TranslateComponent implements OnInit {

  constructor(public translateService: TranslateService) { }

  ngOnInit() {
    if (localStorage.getItem('language')) {
      this.translateService.lang = localStorage.getItem('language');
      this.translateService.setLang(this.translateService.lang);
    }
    this.translateService.use(this.translateService.lang);
  }

  changeLang(lang: string) {
    this.translateService.use(lang);
    this.translateService.lang = lang;
    localStorage.setItem('language', lang);
  }


}
