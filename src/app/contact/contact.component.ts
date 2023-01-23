import { TranslateService } from './../shared/translate/translate.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  lang: string = 'gr';

  constructor(private translateService: TranslateService) {
    this.translateService.lang$.subscribe(value => {
      this.lang = value.toString();
    });
    this.lang = this.translateService.getLang();
  }

  ngOnInit(): void {
  }

}
