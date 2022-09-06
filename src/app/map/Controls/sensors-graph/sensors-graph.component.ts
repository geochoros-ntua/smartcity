import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Chart, registerables } from 'chart.js';
import { SensorsService } from '../../Services/map.sensors.service';


@Component({
  selector: 'app-sensors-graph',
  templateUrl: './sensors-graph.component.html',
  styleUrls: ['./sensors-graph.component.scss']
})
export class SensorsGraphComponent implements OnInit {
  @ViewChild('lineCanvas') lineCanvas: ElementRef | undefined;
  lineChart: any;
  public graphTitle: string = '';
  public dateRange: FormGroup;
  public nowDate: Date = new Date();
  

  

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private cdRef: ChangeDetectorRef, private sensorsService: SensorsService) { }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.dateRange = new FormGroup({
      start: new FormControl(new Date(this.sensorsService.dateFrom)),
      end: new FormControl(new Date(this.sensorsService.dateTo)),
    });
  }

  ngAfterViewInit(): void {

    const labels = this.data.map((item: any) => item.label);
    const values = this.data.map((item: any) => item.value);
    this.graphTitle = this.data[0].title;
    
    this.initChart(labels,values);
    this.cdRef.detectChanges();
  }

  initChart(labels: string[], values: string[]): void {
    this.lineChart = new Chart(this.lineCanvas?.nativeElement, {
      type: 'line',
      options: {
        responsive: true
      },
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Pedestrians passed (per day)',
          //  lineTension: 0.2, 
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: values,
            spanGaps: false
          },
        ],
      },
    });
  }

  public redrawGraph(toDate: any){
    
    if (toDate.value){
      this.sensorsService.dateFrom = this.dateRange.get('start').value;
      this.sensorsService.dateTo = this.dateRange.get('end').value;
      this.sensorsService.showReportGraph(this.sensorsService.reportId);

    }

  }
  

}
