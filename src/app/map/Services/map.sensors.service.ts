<<<<<<< HEAD
import { Injectable } from '@angular/core';
=======
import { ElementRef, Injectable } from '@angular/core';
>>>>>>> 9d066a6 (imlement sensor graph)
import { Feature } from 'ol';
import { combineLatest, Observable } from 'rxjs';
import { MapLayersService } from './map.layers.service';
import Geometry from 'ol/geom/Geometry';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
<<<<<<< HEAD
import { SensorsGraphComponent } from '../Controls/sensors-tab-layout/sensors-graph/sensors-graph.component';
import { GraphReport } from '../api/map.api';
import { ChartType } from 'chart.js';
import MapUtils from '../map.helper';
import { TranslatePipe } from 'src/app/shared/translate/translate.pipe';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { SensorsTabLayoutComponent } from '../Controls/sensors-tab-layout/sensors-tab-layout.component';
=======
import { SensorsGraphComponent } from '../Controls/sensors-graph/sensors-graph.component';
>>>>>>> 9d066a6 (imlement sensor graph)


/**
 * Author: p.tsagkis
 * Date: 9/2022
 */

@Injectable({
  providedIn: 'root'
})

export class SensorsService {
    
    private loadInterMethod: any;
<<<<<<< HEAD
    public translatePipe: TranslatePipe;
=======
>>>>>>> 9d066a6 (imlement sensor graph)

    private dialogRef: any;

    public dateFrom: Date = new Date();
    public dateTo: Date = new Date();
<<<<<<< HEAD
    public selMeasureId: number;
    public selGraphType: ChartType = 'bar';
    public selReportType: string = 'day';
    public currentViewLiveReport: any = [];
    
    
    constructor(
      private http: HttpClient, 
      private mapLayersService: MapLayersService, 
      private translateService: TranslateService,
      public dialog: MatDialog){
        //start up using last week data (minus 7  days)
        this.dateFrom.setDate(this.dateTo.getDate() - 7);
        this.translatePipe = new TranslatePipe(this.translateService);
    }

    private getLiveReport(id:number): Observable<any>{
        return this.http.get(MapUtils.backEndBaseUrl + 'loadLiveReport.php?report_id='+id);
    } 
    
    public getHistoryReport(measureid: string | number): Observable<GraphReport[]>{
        return this.http.get<GraphReport[]>(MapUtils.backEndBaseUrl + 'loadHistoryReport.php?measureid=' + measureid +  
        '&from='+ MapUtils.formatDate(this.dateFrom) +'&to=' + MapUtils.formatDate(this.dateTo) + '&reportType='+this.selReportType);
=======
    public reportId: string | number;
    
    
    constructor(private http: HttpClient, private mapLayersService: MapLayersService, public dialog: MatDialog){
        this.dateFrom.setDate(this.dateTo.getDate() - 7);
    }

    private getLiveReport(id:number): Observable<any>{
        return this.http.get('https://smartcity.fearofcrime.com/php/loadLiveReport.php?report_id='+id);
    } 
    
    private getHistoryReport(sensid: string | number): Observable<any>{
        return this.http.get('https://smartcity.fearofcrime.com/php/loadHistoryReport.php?sensid=' + sensid +  
        '&from='+ this.formatDate(this.dateFrom) +'&to=' + this.formatDate(this.dateTo) + '&type=day');
>>>>>>> 9d066a6 (imlement sensor graph)
    } 


    public initSensors(): void{
        this.mapLayersService.SensorsLayer.getSource().once('change', () => {
<<<<<<< HEAD
          console.log('getFeatures', this.mapLayersService.SensorsLayer.getSource().getFeatures())
             this.loadLiveReportForFeats(this.mapLayersService.SensorsLayer.getSource().getFeatures());
=======
             this.loadReportForFeats(this.mapLayersService.SensorsLayer.getSource().getFeatures());
>>>>>>> 9d066a6 (imlement sensor graph)
          });
          this.startReportAutoLoad();
          
    }

    public startReportAutoLoad(): void{
        // reload live reports every 10 secs
        this.loadInterMethod = setInterval(() => {
<<<<<<< HEAD
            this.loadLiveReportForFeats(this.mapLayersService.SensorsLayer.getSource().getFeatures())
=======
            this.loadReportForFeats(this.mapLayersService.SensorsLayer.getSource().getFeatures())
>>>>>>> 9d066a6 (imlement sensor graph)
          }, 10000);
    }

    public stopReportAutoLoad(): void{
        clearInterval(this.loadInterMethod);
    }

<<<<<<< HEAD
    
    private loadLiveReportForFeats(feats: Feature<Geometry>[]): void{
        
        feats.forEach(feat => {
          this.getLiveReport(feat.get('live_report_id')).subscribe(report => {
            if (this.selMeasureId === feat.getId()){
              this.currentViewLiveReport = report.map((rp: any) => {
                return {...rp, when: new Date()}
              });
            }
            // update feats labels with the sum of inside for all gates
            feat.set('value', (report.map((rp: any) => rp.inside).reduce((a: any, b: any) => a + b)).toString()); 
          })
        });
    }
    
      
      
    public showReportGraph(measureId: number, liveReportId: number, imageid: string){
      this.mapLayersService.dataLoaded = false;
      this.selMeasureId = measureId;
      this.dialogRef?.close();

      const historyReport$ = this.getHistoryReport(measureId);
      const liveReport$ = this.getLiveReport(liveReportId);
      combineLatest([liveReport$, historyReport$]).subscribe(([liveResp, histResp]) =>{
        console.log(liveResp, histResp, this.selMeasureId)
        this.currentViewLiveReport = liveResp.map((rp: any) => {
          return {...rp, when: new Date()}
        }); 
        this.mapLayersService.dataLoaded = true;
        this.dialogRef = this.dialog.open(SensorsTabLayoutComponent, {
=======

    private loadReportForFeats(feats: Feature<Geometry>[]): void{
        feats.forEach(feat => {
          let reports: Observable<any>[] = [];
          const reportIds: number[] =  feat.get('live_report_id').split(',');
          reportIds.forEach(rId => {
            reports.push(this.getLiveReport(rId));
          })
          const mergedObservables = combineLatest(reports);
          mergedObservables.subscribe(data => {
            feat.set('value', (Math.abs(data[0][0].inside) + Math.abs(data[1][0].inside)).toString()); 
          });
        })
      }
    
      
      
    public showReportGraph(reportId: string | number){
    this.reportId = reportId;
    this.dialogRef?.close();
    this.getHistoryReport(reportId).subscribe(res => {
        this.dialogRef = this.dialog.open(SensorsGraphComponent, {
>>>>>>> 9d066a6 (imlement sensor graph)
            maxWidth: '80vw',
            maxHeight: '80vh',
            height: '80%',
            width: '80%',
<<<<<<< HEAD
            data: { data: histResp, imageid: imageid}
        });
      })

    }


=======
            data: res
        });
    });
    }

    
    public formatDate(date: Date): string{
        return date.getFullYear() + '-' + ((date.getMonth() + 1)) + '-' + date.getDate()
    }
>>>>>>> 9d066a6 (imlement sensor graph)
}