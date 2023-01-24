import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  teamR: any[] = []
  teamD: any[] = [];
  dataCollection: any[] = [];

  breakpoint: any;



  constructor() { }

  ngOnInit(): void {
  }

  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= 960) ? 2 : 4;
  }

}
