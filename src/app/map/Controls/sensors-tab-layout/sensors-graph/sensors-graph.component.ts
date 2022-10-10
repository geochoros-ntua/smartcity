import { ThrowStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Chart, ChartType, registerables } from 'chart.js';
import { GraphReport } from '../../../api/map.api';
import { SensorsService } from '../../../Services/map.sensors.service';


@Component({
  selector: 'app-sensors-graph',
  templateUrl: './sensors-graph.component.html',
  styleUrls: ['./sensors-graph.component.scss']
})


export class SensorsGraphComponent implements OnInit {
  @ViewChild('graphCanvas') 
  graphCanvas: ElementRef | undefined;

  @Input()
  public data: GraphReport[];

  public sensChart: any;
  public graphTitle: string = '';
  public dateRange: FormGroup;
  public nowDate: Date = new Date();
  public graphTypes: string[] = ['bar', 'line'];
  public reportTypes: string[] = ['day', 'hour'];

  constructor( private cdRef: ChangeDetectorRef, public sensorsService: SensorsService ) {

  }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.dateRange = new FormGroup({
      start: new FormControl(new Date(this.sensorsService.dateFrom)),
      end: new FormControl(new Date(this.sensorsService.dateTo)),
    });
  }

  ngAfterViewInit(): void {
    const labels = this.data.map((item: GraphReport) => item.label);
    const values = this.data.map((item: GraphReport) => item.value);
    this.graphTitle = this.data[0].title;
    this.initChart(labels,values);
    this.cdRef.detectChanges();
  }

  initChart(labels: string[], values: string[]): void {

    this.sensChart = new Chart(this.graphCanvas?.nativeElement, {
      type: this.sensorsService.selGraphType,
      options: {
        responsive: true
      },
      data: {
        labels: labels,
        datasets: [
          {
            label: this.sensorsService.translatePipe.transform('MAP.SENS-REPORT') + ' (per ' + this.sensorsService.selReportType +')',
            fill: true,
            borderWidth: 2,
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(34,139,34,1)',
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

  public redrawGraph(toDate: any): void {
    if (toDate.value){
      this.sensorsService.dateFrom = this.dateRange.get('start').value;
      this.sensorsService.dateTo = this.dateRange.get('end').value;
     
      this.sensorsService.getHistoryReport(this.sensorsService.selMeasureId).subscribe((res: GraphReport[]) => {
        this.sensChart.data.labels = res.map((item: GraphReport) => item.label);
        this.sensChart.data.datasets[0].data = res.map((item: GraphReport) => item.value);
        this.sensChart.update();
      });
    }
  }

  public setGraphType(type: ChartType): void{
    this.sensorsService.selGraphType = type;
    this.sensChart.config.type = type;
    this.sensChart.update();
    this.cdRef.detectChanges();
  }

  public setReportType(type: string): void{
    this.sensorsService.selReportType = type;
    this.sensChart.data.datasets[0].label = this.sensorsService.translatePipe.transform('MAP.SENS-REPORT') + ' (per ' + this.sensorsService.selReportType +')';
    this.sensorsService.getHistoryReport(this.sensorsService.selMeasureId).subscribe((res: GraphReport[]) => {
      this.sensChart.data.labels = res.map((item: GraphReport) => item.label);
      this.sensChart.data.datasets[0].data = res.map((item: GraphReport) => item.value);
      this.sensChart.update();
    });
  }

  
  

}
