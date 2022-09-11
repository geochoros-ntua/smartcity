import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import { combineLatest, Observable } from 'rxjs';
import { MapLayersService } from './map.layers.service';
import Geometry from 'ol/geom/Geometry';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SensorsGraphComponent } from '../Controls/sensors-graph/sensors-graph.component';
import { GraphReport } from '../api/map.api';
import { ChartType } from 'chart.js';
import MapUtils from '../map.helper';


/**
 * Author: p.tsagkis
 * Date: 9/2022
 */

@Injectable({
  providedIn: 'root'
})

export class SensorsService {
    
    private loadInterMethod: any;

    private dialogRef: any;

    public dateFrom: Date = new Date();
    public dateTo: Date = new Date();
    public reportId: string | number;
    public selGraphType: ChartType = 'bar';
    public selReportType: string = 'day';
    
    
    constructor(
      private http: HttpClient, 
      private mapLayersService: MapLayersService, 
      public dialog: MatDialog){
        //start up using last week data (7  days)
        this.dateFrom.setDate(this.dateTo.getDate() - 7);
    }

    private getLiveReport(id:number): Observable<any>{
        return this.http.get('https://smartcity.fearofcrime.com/php/loadLiveReport.php?report_id='+id);
    } 
    
    public getHistoryReport(sensid: string | number): Observable<GraphReport[]>{
        return this.http.get<GraphReport[]>('https://smartcity.fearofcrime.com/php/loadHistoryReport.php?sensid=' + sensid +  
        '&from='+ MapUtils.formatDate(this.dateFrom) +'&to=' + MapUtils.formatDate(this.dateTo) + '&reportType='+this.selReportType);
    } 


    public initSensors(): void{
        this.mapLayersService.SensorsLayer.getSource().once('change', () => {
             this.loadLiveReportForFeats(this.mapLayersService.SensorsLayer.getSource().getFeatures());
          });
          this.startReportAutoLoad();
          
    }

    public startReportAutoLoad(): void{
        // reload live reports every 10 secs
        this.loadInterMethod = setInterval(() => {
            this.loadLiveReportForFeats(this.mapLayersService.SensorsLayer.getSource().getFeatures())
          }, 10000);
    }

    public stopReportAutoLoad(): void{
        clearInterval(this.loadInterMethod);
    }


    private loadLiveReportForFeats(feats: Feature<Geometry>[]): void{
        feats.forEach(feat => {
          const reports: Observable<any>[] = feat.get('live_report_id').split(',')
          .map((rId: number) =>  this.getLiveReport(rId));
         
          combineLatest(reports)
          .subscribe(data => {
            feat.set('value', (Math.abs(data[0][0].inside) + Math.abs(data[1][0].inside)).toString()); 
          });
        });
      }
    
      
      
    public showReportGraph(reportId: string | number){
      this.mapLayersService.dataLoaded = false;
      this.reportId = reportId;
      this.dialogRef?.close();
      
      this.getHistoryReport(reportId).subscribe(res => {
        this.mapLayersService.dataLoaded = true;
          this.dialogRef = this.dialog.open(SensorsGraphComponent, {
              maxWidth: '80vw',
              maxHeight: '80vh',
              height: '80%',
              width: '80%',
              data: res
          });
      });
    }


}