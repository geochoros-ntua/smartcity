import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss'],
})
export class ObjectiveComponent {
  teamR: any[] = [];
  teamD: any[] = [];
  dataCollection: any[] = [];

  breakpoint: any;

  onResize(event: any) {
    this.breakpoint = event.target.innerWidth <= 960 ? 2 : 4;
  }
}
