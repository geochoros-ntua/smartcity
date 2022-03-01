import { Component } from '@angular/core';
import { MapLayersService } from '../../Services/map.layers.service';

@Component({
  selector: 'app-opacity-slider',
  templateUrl: './opacity-slider.component.html',
  styleUrls: ['./opacity-slider.component.scss']
})
export class OpacitySliderComponent {

  public vectorOpacity!: number | null;

  constructor(private mapLayersService: MapLayersService) {
      this.vectorOpacity = 70;
   }
  

  public setLyrOpacity = (value: number):void => {
    this.vectorOpacity = value;
    this.mapLayersService.setVectorLayersOpacity(value? value/100: 1);
    
  }

}
