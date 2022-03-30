import { Component, OnInit } from "@angular/core";
import { TranslateService } from "./translate.service";



@Component({
  selector: "app-translate",
  templateUrl: "./translate.component.html",
  styleUrls: ["./translate.component.scss"]
})
export class TranslateComponent implements OnInit {
  selected: string = "en";


  constructor(private translateService: TranslateService) { }

  ngOnInit() {

    if (localStorage.getItem('language')) {
      this.selected = localStorage.getItem('language');
    }
    this.translateService.use(this.selected);
  }




  changeLang(lang: string) {
    this.translateService.use(lang);
    this.selected = lang;
    localStorage.setItem('language', lang);
  }


}
