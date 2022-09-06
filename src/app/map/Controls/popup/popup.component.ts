import { Component, OnInit } from '@angular/core';
import Overlay from 'ol/Overlay';
import { DarkThemeService } from 'src/app/shared/dark-theme/dark-theme.service';
import { FeatureClickedWithPos } from '../../api/map.api';
import { MapService } from '../../Services/map.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  public featureClicked!: FeatureClickedWithPos | null;

  private overlayPopup!: Overlay;
  public displayedColumns!: string[]; 

  constructor(private mapService: MapService, public darkThemeService: DarkThemeService) { }

  ngOnInit(): void {

    this.displayedColumns = ['name', 'value'];
    this.overlayPopup = new Overlay({
      id: 'popupoverlay',
      element: document.getElementById('popup')!,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      }
    });
    this.mapService.smartCityMap.addOverlay(this.overlayPopup);

    this.mapService.featureClickedWithPos$.subscribe((obj) => {
      if(obj){
        this.featureClicked = obj;
        this.mapService.smartCityMap.getOverlayById('popupoverlay').setPosition(obj.coord);
      }
  });
  }

  public closeIt(): void{
    this.overlayPopup.setPosition(undefined);
  }

  public parseNumberKey(val: string): string {
    return parseFloat(val).toFixed(2);
  }

  public getKeys(obj: any): string[]{
    return Object.keys(obj);
  }

  public getValidKeys(keys:string[]):string[]{
    let validKeys = keys.filter( el => ['OBJECTID','area','geometry','Shape_Area','length'].indexOf( el ) < 0);
    return validKeys;
    //const fromIndex = validKeys.findIndex( el => el === this.mapService.selectedIndex);
    //return this.swapElements(validKeys, fromIndex, 0);
  }

  private swapElements(arr: any[], fromIndex: number, toIndex: number): any[] {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
}

}
