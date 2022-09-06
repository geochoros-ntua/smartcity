import { ElementRef, Injectable } from '@angular/core';
import { Feature } from 'ol';
import { combineLatest, Observable } from 'rxjs';
import { MapLayersService } from './map.layers.service';
import Geometry from 'ol/geom/Geometry';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SensorsGraphComponent } from '../Controls/sensors-graph/sensors-graph.component';


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
    
    
    constructor(private http: HttpClient, private mapLayersService: MapLayersService, public dialog: MatDialog){
        this.dateFrom.setDate(this.dateTo.getDate() - 7);
    }

    private getLiveReport(id:number): Observable<any>{
        return this.http.get('https://smartcity.fearofcrime.com/php/loadLiveReport.php?report_id='+id);
    } 
    
    private getHistoryReport(sensid: string | number): Observable<any>{
        return this.http.get('https://smartcity.fearofcrime.com/php/loadHistoryReport.php?sensid=' + sensid +  
        '&from='+ this.formatDate(this.dateFrom) +'&to=' + this.formatDate(this.dateTo) + '&type=day');
    } 


    public initSensors(): void{
        this.mapLayersService.SensorsLayer.getSource().once('change', () => {
             this.loadReportForFeats(this.mapLayersService.SensorsLayer.getSource().getFeatures());
          });
          this.startReportAutoLoad();
          
    }

    public startReportAutoLoad(): void{
        // reload live reports every 10 secs
        this.loadInterMethod = setInterval(() => {
            this.loadReportForFeats(this.mapLayersService.SensorsLayer.getSource().getFeatures())
          }, 10000);
    }

    public stopReportAutoLoad(): void{
        clearInterval(this.loadInterMethod);
    }


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
            maxWidth: '80vw',
            maxHeight: '80vh',
            height: '80%',
            width: '80%',
            data: res
        });
    });
    }

    
    public formatDate(date: Date): string{
        return date.getFullYear() + '-' + ((date.getMonth() + 1)) + '-' + date.getDate()
    }
}