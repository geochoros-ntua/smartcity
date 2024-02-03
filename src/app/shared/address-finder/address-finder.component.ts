import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter, debounceTime, switchMap, tap } from 'rxjs';
import Map from 'ol/Map';
import * as olProj from 'ol/proj';
import { INominatimResponse, NominatimService } from './nominatim.service';
import { DarkThemeService } from '../dark-theme/dark-theme.service';
import { Coordinate } from 'ol/coordinate';
import { Overlay } from 'ol';

@Component({
  selector: 'app-address-finder',
  templateUrl: './address-finder.component.html',
  styleUrls: ['./address-finder.component.scss'],
})
export class AddressFinderComponent implements OnInit {
  geocodeControl = new FormControl('');
  options: INominatimResponse[] = [];
  loading: boolean = false;
  marker: Overlay;
  @Input() map: Map;
  @Input() position: number[];

  constructor(
    private nominatimService: NominatimService,
    public darkThemeService: DarkThemeService
  ) {}

  ngOnInit(): void {
    this.geocodeControl.valueChanges
      .pipe(
        filter((val) => val && typeof val === 'string'),
        debounceTime(1000),
        tap((_) => (this.loading = true)),
        switchMap((val) => this.nominatimService.addressLookup(val + ', Αθήνα'))
      )
      .subscribe((results) => {
        this.loading = false;
        this.options = results;
      });
  }

  ngOnDestroy() {
    this.map.removeOverlay(this.marker);
  }

  displayFn(value?: INominatimResponse) {
    return value ? value.displayName : undefined;
  }

  locate(data: INominatimResponse) {
    const coord: Coordinate = olProj.transform(
      [Number(data.lon), Number(data.lat)],
      'EPSG:4326',
      'EPSG:3857'
    );
    this.map.removeOverlay(this.marker);
    const curZoom = this.map.getView().getZoom();
    this.map.getView().animate({
      zoom: curZoom > 17 ? curZoom : 17,
      center: coord,
      duration: 1000,
    });
    const element = document.createElement('div');
    element.innerHTML = '<img src="assets/icons/geocode.png" />';
    this.marker = new Overlay({
      position: coord,
      positioning: 'center-center',
      element: element,
      stopEvent: false,
    });
    this.map.addOverlay(this.marker);
  }
}
