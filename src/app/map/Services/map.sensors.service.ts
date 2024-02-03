import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import { combineLatest, finalize, Observable } from 'rxjs';
import { MapLayersService } from './map.layers.service';
import Geometry from 'ol/geom/Geometry';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SensorsGraphComponent } from '../Controls/sensors-tab-layout/sensors-graph/sensors-graph.component';
import { GraphReport } from '../api/map.api';
import { ChartType } from 'chart.js';
import MapUtils from '../map.helper';
import { TranslatePipe } from 'src/app/shared/translate/translate.pipe';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { SensorsTabLayoutComponent } from '../Controls/sensors-tab-layout/sensors-tab-layout.component';

/**
 * Author: p.tsagkis
 * Date: 9/2022
 */

@Injectable({
  providedIn: 'root',
})
export class SensorsService {
  private loadInterMethod: any;
  public translatePipe: TranslatePipe;

  private dialogRef: any;

  public dateFrom: Date = new Date();
  public dateTo: Date = new Date();
  public selMeasureId: number;
  public selGraphType: ChartType = 'bar';
  public selReportType: string = 'day';
  public currentViewLiveReport: any = [];
  public graphLoaded: boolean;
  public sensorReportLoaded: boolean;

  constructor(
    private http: HttpClient,
    private mapLayersService: MapLayersService,
    private translateService: TranslateService,
    public dialog: MatDialog
  ) {
    //start up using last week data (minus 7  days)
    this.dateFrom.setDate(this.dateTo.getDate() - 7);
    this.translatePipe = new TranslatePipe(this.translateService);
  }

  private getLiveReport(id: number): Observable<any> {
    return this.http.get(
      MapUtils.backEndBaseUrl + 'loadLiveReport.php?report_id=' + id
    );
  }

  public getHistoryReport(
    measureid: string | number
  ): Observable<GraphReport[]> {
    return this.http.get<GraphReport[]>(
      MapUtils.backEndBaseUrl +
        'loadHistoryReport.php?measureid=' +
        measureid +
        '&from=' +
        MapUtils.formatDate(this.dateFrom) +
        '&to=' +
        MapUtils.formatDate(this.dateTo) +
        '&reportType=' +
        this.selReportType
    );
  }

  public initSensors(): void {
    this.mapLayersService.SensorsLayer.getSource().once('change', () => {
      this.loadLiveReportForFeats(
        this.mapLayersService.SensorsLayer.getSource().getFeatures()
      );
    });
    this.startReportAutoLoad();
  }

  public startReportAutoLoad(): void {
    // reload live reports every 10 secs
    this.loadInterMethod = setInterval(() => {
      this.loadLiveReportForFeats(
        this.mapLayersService.SensorsLayer.getSource().getFeatures()
      );
    }, 10000);
  }

  public stopReportAutoLoad(): void {
    clearInterval(this.loadInterMethod);
  }

  private loadLiveReportForFeats(feats: Feature<Geometry>[]): void {
    feats.forEach((feat) => {
      this.getLiveReport(feat.get('live_report_id')).subscribe((report) => {
        if (this.selMeasureId === feat.getId()) {
          this.currentViewLiveReport = report.map((rp: any) => {
            return { ...rp, when: new Date() };
          });
        }
        // update feats labels with the sum of inside for all gates
        feat.set(
          'value',
          report
            .map((rp: any) => rp.inside)
            .reduce((a: any, b: any) => a + b)
            .toString()
        );
      });
    });
  }

  public showReportGraph(
    measureId: number,
    liveReportId: number,
    imageid: string
  ) {
    if (this.sensorReportLoaded === false) return;
    this.sensorReportLoaded = false;
    this.mapLayersService.dataLoaded = false;
    this.selMeasureId = measureId;

    const historyReport$ = this.getHistoryReport(measureId);
    const liveReport$ = this.getLiveReport(liveReportId);
    combineLatest([liveReport$, historyReport$])
      .pipe(
        finalize(() => {
          this.sensorReportLoaded = true;
          this.mapLayersService.dataLoaded = true;
        })
      )
      .subscribe(([liveResp, histResp]) => {
        this.dialogRef?.close();
        this.currentViewLiveReport = liveResp.map((rp: any) => {
          return { ...rp, when: new Date() };
        });
        this.dialogRef = this.dialog.open(SensorsTabLayoutComponent, {
          maxWidth: '80vw',
          maxHeight: '80vh',
          height: '80%',
          width: '80%',
          data: { data: histResp, imageid },
        });
      });
  }
}
