import { Component, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { DarkThemeService } from 'src/app/shared/dark-theme/dark-theme.service';
import { FEATURE_GROUPS } from '../../api/map.datamaps';
import { VectorLayerNames, MapMode } from '../../api/map.enums';
import { MapLayersService } from '../../Services/map.layers.service';
import { MapService } from '../../Services/map.service';


@Component({
  selector: 'app-mapillary-data-modal',
  templateUrl: './mapillary-data-modal.component.html',
  styleUrls: ['./mapillary-data-modal.component.scss']
})


export class MapillaryDataModalComponent {
  
  @ViewChild('allSelected')
  private allSelected!: MatOption;


  constructor( 
    private mapService: MapService, 
    public mapLayersService: MapLayersService, 
    public darkThemeService: DarkThemeService) { }


  public get vectorLayerNames(): typeof VectorLayerNames {
    return VectorLayerNames; 
  }

  public getFeatureGroups(): string[] {
    return Array.from( FEATURE_GROUPS.keys() );
  }

  public getLabel(key: string ): string {
    return FEATURE_GROUPS.get(key);
  }

  public setActiveGroups(activeGroups: string[]): void {
    this.mapLayersService.selectedFeatureGroups$.next(activeGroups);
  }

  public toggleLayerVisibility(layer: VectorLayerNames): void {
    if (layer === VectorLayerNames.img){
      this.mapLayersService.checkedImg = !this.mapLayersService.checkedImg;
      this.mapLayersService.MlImagesLayer.setVisible(this.mapLayersService.checkedImg);
    } else if ( layer === VectorLayerNames.seq) {
      this.mapLayersService.checkedSeq = !this.mapLayersService.checkedSeq;
      this.mapLayersService.MlSequencesLayer.setVisible(this.mapLayersService.checkedSeq);
    }
  }

  public toggleFeatureGroups(): void {
    this.mapLayersService.selectedFeatureGroups$.next(
      this.allSelected.selected ? [...this.getFeatureGroups(), '0'] : []
    );
  }

  public refreshDetectionLayer(): void{
    this.mapLayersService.MlPointsLayer.getSource().refresh();
  }

  public showButton(): boolean{
    return this.mapService.mapMode === MapMode.street;
  }

}
