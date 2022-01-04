import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MapLayersService } from './Services/map.layers.service';
import { MapService } from './Services/map.service';
import { MapLayoutService } from './Services/map.layout.service';
import { SmartCityMapConfig } from './api/map.interfaces';
import { MapBrowserEvent } from 'ol';

const enum Status {
  OFF = 0,
  RESIZE = 1
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})



export class MapComponent implements OnInit {

  private mapConfig!: SmartCityMapConfig;


  // the current view (map/streetview)
  currentView: number = 1;

  // mouse x position
  mouse: { x: number }

  // status of mousedown or up
  status: Status = Status.OFF;

  // width of the drawers
  width: number = 0;
  otherWidth: number = window.innerWidth;


  // get the drawer elements for resizing
  @ViewChild("drawer", { read: ElementRef }) drawer: ElementRef;
  @ViewChild("drawerB", { read: ElementRef }) drawerB: ElementRef;



  // get mouse x position
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse = { x: event.clientX };

    if (this.status === Status.RESIZE) this.resize();

  }


  // resize the drawers

  private resize() {

    // check if out of bounds
    if (this.width < window.innerWidth * 80 / 100 && this.width > window.innerWidth * 20 / 100) {

      this.width = window.innerWidth - this.mouse.x

      this.drawer.nativeElement.style.setProperty('width', this.width + 'px')
      // this.cookieService.set('textWidth', String(this.width));
      this.otherWidth = window.innerWidth - this.width - 2;
      this.drawerB.nativeElement.style.setProperty('width', this.otherWidth + 'px')
    }


    // set the bounds

    if (this.width >= window.innerWidth * 80 / 100) {
      this.width = window.innerWidth * 79.99 / 100
      this.drawer.nativeElement.style.setProperty('width', this.width + 'px')
      this.otherWidth = window.innerWidth - this.width - 2;
      this.drawerB.nativeElement.style.setProperty('width', this.otherWidth + 'px')
    }

    if (this.width <= window.innerWidth * 20 / 100) {
      this.width = window.innerWidth * 21.01 / 100
      this.drawer.nativeElement.style.setProperty('width', this.width + 'px')
      this.otherWidth = window.innerWidth - this.width - 2;
      this.drawerB.nativeElement.style.setProperty('width', this.otherWidth + 'px')
    }

  }

  // set the status of the mouse press event

  setStatus(event: MouseEvent, status: number) {
    // this.loadDrawer();
    event.stopPropagation();

    // resize and rerender map
    if (status === 0) {
      this.renderMap();
    }

    this.status = status;
  }


  renderMap() {

    setTimeout(() => {
      this.mapService.map.updateSize();
    }, 400);
  }



  constructor(
    private mapService: MapService,
    private mapLayersService: MapLayersService, private mapLayoutService: MapLayoutService) {


      // listen for view change and set the width
    this.mapLayoutService.currentView$.subscribe(status => {

      if (status !== this.currentView) {
        switch (status) {
          case 0:
            this.currentView = 0;

            // if (this.cookieService.get('textWidth')) {
            //   this.width = +this.cookieService.get('textWidth');
            //   // console.log(this.cookieService.get('textWidth'))
            // }
            // else {
            //   this.width = window.innerWidth/2;
            //   // console.log(this.cookieService.get('textWidth'))
            // }
            this.width = window.innerWidth / 2;
            this.otherWidth = window.innerWidth - this.width - 2;
            this.drawer.nativeElement.style.setProperty('width', this.width + 'px')

            this.drawerB.nativeElement.style.setProperty('width', this.otherWidth + 'px')
            this.renderMap();


            break;

          case 1:
            this.currentView = 1;
            this.width = 0;
            this.otherWidth = window.innerWidth;
            this.drawer.nativeElement.style.setProperty('width', this.width + 'px')

            this.drawerB.nativeElement.style.setProperty('width', this.otherWidth + 'px')
            this.renderMap();


            break;

          case 2:
            this.currentView = 2;
            this.width = window.innerWidth;
            this.drawer.nativeElement.style.setProperty('width', this.width + 'px')

            this.drawerB.nativeElement.style.setProperty('width', this.otherWidth + 'px')
            this.renderMap();


            break;

          default:
            break;
        }
      }
    });


  }

  ngOnInit(): void {
    this.mapLayersService.initLayers();
    this.mapConfig = {
      mapDivId: 'map_div',
      mapillaryDivId: 'mapillaryDiv',
      zoomLevel: 15,
      center: [23.7114, 37.9827],
      layers: [
        this.mapLayersService.cartoDarkLayer,
        this.mapLayersService.GosmLayer,
        this.mapLayersService.OsmLayer,
        this.mapLayersService.MlSequencesLayer,
        this.mapLayersService.MlImagesLayer,
        this.mapLayersService.MlPointsLayer,
        this.mapLayersService.SelectionLayer
      ]
    };
    this.mapService.initMap(this.mapConfig);
    this.registerMapEvents(this);
  }



  private registerMapEvents(thisP: MapComponent): void {

    // once first map render
    this.mapService.smartCityMap.once('rendercomplete', () => {
      thisP.mapService.smartCityMap.updateSize();
    });

    // click on map event
    this.mapService.smartCityMap.on('click', (event: MapBrowserEvent<UIEvent>) => {
      this.mapService.onMapClicked(event);
    });

    // pointer on feature hover
    this.mapService.smartCityMap.on('pointermove', (event: MapBrowserEvent<UIEvent>) => {
      const pixel = thisP.mapService.smartCityMap.getEventPixel(event.originalEvent);
      const hit = thisP.mapService.smartCityMap.hasFeatureAtPixel(pixel);
      thisP.mapService.smartCityMap.getViewport().style.cursor = hit ? 'pointer' : '';
    });
  }
}
