
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chart, ChartType, registerables } from 'chart.js';
import { FeatureLike } from 'ol/Feature';
import { combineLatest, Observable } from 'rxjs';
import { MapLayersService } from 'src/app/map/Services/map.layers.service';
import { GraphReport } from '../../../api/map.api';
import { SensorsService } from '../../../Services/map.sensors.service';
import MapUtils from 'src/app/map/map.helper';


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
  public graphForm: FormGroup;
  public nowDate: Date = new Date();
  public graphTypes: {type: string,label:string}[] = [{type: 'bar', label: 'GRAPH.BAR'}, {type: 'line', label: 'GRAPH.LINE'}];
  public reportTypes: {type: string,label:string}[] = [{type: 'day', label: 'GRAPH.DAY'}, {type: 'hour', label: 'GRAPH.HOUR'}];

  
  constructor( private cdRef: ChangeDetectorRef, public sensorsService: SensorsService , public mapLayersService: MapLayersService) {

  }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.graphForm = new FormGroup({
      start: new FormControl(new Date(this.sensorsService.dateFrom)),
      end: new FormControl(new Date(this.sensorsService.dateTo)),
      graphCompareSelector: new FormControl()
    });
    
  }

  
  ngAfterViewInit(): void {
    const labels = this.data.map((item: GraphReport) => item.label);
    const values = this.data.map((item: GraphReport) => item.value);
    this.graphTitle = this.data[0].title;
    this.initChart(labels,values);
    this.cdRef.detectChanges();
  }


  public initChart(labels: string[], values: string[]): void {

    this.sensChart = new Chart(this.graphCanvas?.nativeElement, {
      type: this.sensorsService.selGraphType,
      options: {
        responsive: true
      },
      data: {
        labels: labels,
        datasets: [
          {
            label: this.translateLabel(),
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

  public getCompareSensors(): FeatureLike[] {
    return this.mapLayersService.SensorsLayer
    .getSource()
    .getFeatures()
    .filter( feat => feat.getId() !== this.sensorsService.selMeasureId);
    
  }

  public setComparingSensors(feats: FeatureLike[]): void {

    const sensorsLabels: string[] = [];
    const compareReports$: Observable<GraphReport[]>[] = [];
    this.sensorsService.graphLoaded = feats.length > 0 ? false : true;
    
    feats.forEach((vv: FeatureLike) => {
      compareReports$.push(this.sensorsService.getHistoryReport(vv.getId()));
      sensorsLabels.push(vv.get('label'))
    });

    this.sensChart.data.datasets.splice(1);
    this.sensChart.update();
    
    combineLatest(compareReports$).subscribe(result => {
      result.forEach( (cr,i) => {
        this.sensChart.data.datasets = [...this.sensChart.data.datasets, {...this.getStyleForGraph(i),
          label: sensorsLabels[i] + ' ' + this.translateLabel(),
          data: this.sensChart.data.labels
          .map((r:string) => (cr.map(rrr => rrr.label).includes(r)) ? cr.find(rrr => rrr.label === r).value : 0)
        }];
      });
      
      this.sensChart.update();
      this.sensorsService.graphLoaded = true;
    });

  }


  public redrawGraph(toDate: any): void {
    if (toDate.value){
      this.sensorsService.dateFrom = this.graphForm.get('start').value;
      this.sensorsService.dateTo = this.graphForm.get('end').value;
      this.sensorsService.graphLoaded = false;
      this.sensorsService.getHistoryReport(this.sensorsService.selMeasureId).subscribe((res: GraphReport[]) => {
        this.sensChart.data.labels = res.map((item: GraphReport) => item.label);
        this.sensChart.data.datasets[0].data = res.map((item: GraphReport) => item.value);
        this.handleCompareGrpahsAndUpdate();
        this.sensorsService.graphLoaded = true;
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
    this.sensChart.data.datasets[0].label = this.translateLabel();
    this.sensorsService.graphLoaded = false;
    this.sensorsService.getHistoryReport(this.sensorsService.selMeasureId).subscribe((res: GraphReport[]) => {
      this.sensChart.data.labels = res.map((item: GraphReport) => item.label);
      this.sensChart.data.datasets[0].data = res.map((item: GraphReport) => item.value);
      this.handleCompareGrpahsAndUpdate();
      this.sensorsService.graphLoaded = true;
    });
    
  }

  private handleCompareGrpahsAndUpdate(): void{
    if (this.graphForm.get('graphCompareSelector')?.value){
      this.setComparingSensors(this.graphForm.get('graphCompareSelector')?.value);
    } else {
      this.sensChart.update();
    }
  }

  private getStyleForGraph(index: number): any{
    const backgroundColors = ['rgba(255,0,0,0.6)', 'rgba(0,255,0,0.6)', 'rgba(255,255,0,0.6)', 'rgba(0,255,255,0.6)'];
    const borderColors = ['rgba(255,0,0,1)', 'rgba(0,255,0,1)', 'rgba(255,255,0,1)', 'rgba(0,255,0,1)'];
    return {
      backgroundColor: backgroundColors[index],
      borderColor: borderColors[index],
      borderWidth: 2,
      fill: true,
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointRadius: 1,
      pointHitRadius: 10,
    }
  }


  public isDisabled(feat: FeatureLike): boolean{
    return this.sensChart?.data.datasets.length > 5 && 
    !this.graphForm.get('graphCompareSelector')?.value?.map( (f: FeatureLike) => f.getId()).includes(feat.getId());
  }

  
  private translateLabel(): string{
    return this.sensorsService.translatePipe.transform('MAP.SENS-REPORT') +
    this.sensorsService.translatePipe.transform(this.reportTypes.find(rt => rt.type === this.sensorsService.selReportType).label) +')'
  }

  public downloadGraphOnCsv(){
    MapUtils.exportToCsv(this.graphTitle, this.data);
  }

  

}
