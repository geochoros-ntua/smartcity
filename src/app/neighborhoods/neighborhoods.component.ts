import { DarkThemeService } from 'src/app/shared/dark-theme/dark-theme.service';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { Component, ElementRef, HostListener, Inject, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import OlView from "ol/View";
import OlMap from "ol/Map";
import { Attribution } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style, Text } from 'ol/style';
import * as chroma from 'chroma-js';
import Overlay from 'ol/Overlay';
import { TranslateService } from '../shared/translate/translate.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-neighborhoods',
  templateUrl: './neighborhoods.component.html',
  styleUrls: ['./neighborhoods.component.scss'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotateY(0)' })),
      state('rotated', style({ transform: 'rotateY(360deg)' })),
      transition('rotated => default', animate('800ms ease-in-out')),
      transition('default => rotated', animate('800ms ease-in-out'))
    ]),
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          style({ transform: 'rotateY(0) translateX(0)', opacity: 1 }),
          stagger(10, [
            animate('.1s ease-in-out', style({ transform: 'rotateY(180deg) translateX(300px)', opacity: 0 }))
          ])
        ],
          { optional: true, limit: 5 }
        ),
        query('.city-card:enter', [
          style({ transform: 'rotateY(180deg) translateX(300px)', opacity: 0 }),
          stagger(100, [
            animate('.8s ease-in-out', style({ transform: 'rotateY(0) translateX(0)', opacity: 1 }))
          ])
        ],
          { optional: true, limit: 10 }
        )
      ])
    ]),
    trigger('RotateInB', [
      transition(':enter', [
        style({ transform: 'rotateY(360deg)' }),
        animate('.8s ease-in-out', style({ transform: 'rotateY(0)' })),
      ]),
    ]),
    trigger('rotatedStateList', [
      state('default', style({ transform: 'translateY(0)' })),
      state('rotated', style({ transform: 'translate(72px)' })),
      transition('rotated <=> default', animate('800ms ease-in-out')),
      transition('default <=> rotated', animate('800ms ease-in-out'))
    ]),
    trigger('listAnimationList', [
      transition('* <=> *', [ // each time the binding value changes
        query('.item-list:leave', [
          style({ transform: 'translateY(0) translateX(0)', opacity: 1 }),
          stagger(10, [
            animate('.1s ease-in-out', style({ transform: 'translateY(72px) translateX(300px)', opacity: 0 }))
          ])
        ],
          { optional: true, limit: 20 }
        ),
        query('.item-list:enter', [
          style({ transform: 'translateY(72px) translateX(300px)', opacity: 0 }),
          stagger(100, [
            animate('.8s ease-in-out', style({ transform: 'translateY(0) translateX(0)', opacity: 1 }))
          ])
        ],
          { optional: true, limit: 20 }
        )
      ])
    ]),
  ],
})
export class NeighborhoodsComponent implements OnInit {

  innerWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 855) {
      this.mapViewPaddig = [16, 16, 16, 500];
    }
    else {
      this.mapViewPaddig = [16, 16, 16, 16];
    }
  }

  @ViewChild('controls')
  controls: ElementRef | undefined;

  map: any;
  view: any;

  zoom: number = 7;
  maxZoom: number = 21;
  minZoom: number = 7;

  initialExtent: number[] = [];

  mapViewPaddig: number[] = [16, 16, 16, 500];

  cartoLight = new TileLayer({
    className: 'basemap',
    source: new OSM({
      'url': 'http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
    }),
    zIndex: 1
  });

  cartoDark = new TileLayer({
    className: 'basemap',
    source: new OSM({
      'url': 'http://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
    }),
    zIndex: 1
  });

  neighborhoodsSource = new VectorSource({
    url: "assets/geodata/neighborhoods_3857.geojson",
    format: new GeoJSON()
  });

  neighborhoodsSourceRaw = new VectorSource({
    format: new GeoJSON()
  });

  layerOpacity: number = 80;

  neighborhoodsLayer = new VectorLayer({
    className : "neighborhoods",
    source: this.neighborhoodsSource,
    opacity: this.layerOpacity/100,
    zIndex: 3
  });


  neighborhoods: any[] = [];
  neighborhoodsIds: string[] = [];
  neighborhoodsRaw: any[] = [];

  selectedVariableA: any;
  selectedVariableB: any;

  suffix = "";
  reverse: boolean = false;
  headersA: any[] = [];
  headersB: any[] = [];
  filterargs: any = { parent: null };

  suffleCards = 0;

  isDarkTheme: boolean = false;

  textStyle = {
    text: 'normal',
    align: '',
    baseline: 'middle',
    rotation: '0',
    font: 'Roboto Mono',
    weight: 'bold',
    placement: 'point',
    maxangle: '45',
    overflow: 'false',
    size: '10px',
    height: '1',
    offsetX: '0',
    offsetY: '0',
    color: 'black',
    outline: '#ffffff',
    outlineWidth: '3',
    // maxreso: document.getElementById('polygons-maxreso'),
  }

  hoverPrevious: any;

  labels: boolean = true;

  dks: string[] = [];

  selectedDk = 'Όλες';

  legendColors: string[] = [];

  controlsHeight: string = '198px';
  clickedFeatureId: string = '';

  constructor(private httpClient: HttpClient, public dialog: MatDialog, private darkThemeService: DarkThemeService) {

    this.darkThemeService.isDarkTheme$.subscribe(status => {
      this.isDarkTheme = status;
      if (this.map) {
        this.map.removeLayer(this.cartoDark);
        this.map.removeLayer(this.cartoLight);
        if (this.isDarkTheme) {
          this.map.addLayer(this.cartoDark);
        }
        else {
          this.map.addLayer(this.cartoLight);
        }
      }

    });


  }

  ngAfterViewInit(): void {
    var ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        this.controlsHeight = `${64 + 64 + cr.height}px`;
      }

    })

    if (this.controls) {
      if (this.controls.nativeElement) {
        ro.observe(this.controls.nativeElement);
      }
    }

  }

  ngOnInit(): void {

    if (this.innerWidth > 855) {
      this.mapViewPaddig = [16, 16, 16, 500];
    }
    else {
      this.mapViewPaddig = [16, 16, 16, 16];
    }

    this.filterargs = { parent: this.selectedVariableA };

    this.httpClient.get('assets/other/neighborhoods_data.csv', { responseType: 'text' }).subscribe(data => {
      const rows = data.split(/\r?\n/);

      const headersA = rows[0].split(';');
      const headersB = rows[1].split(';');
      let tempHeadersA = [];
      let tempDk = [];

      let previousValue = '';
      for (let index = 1; index < headersA.length; index++) {
        const element = headersA[index];
        const obj = {
          id: index - 1,
          name: element
        }
        if (obj.name !== 'code' && obj.name !== 'name' && obj.name !== 'dk' && obj.name !== '\r' && obj.name !== 'x' && obj.name !== 'y' && obj.name !== previousValue && obj.name !== null) {
          tempHeadersA.push(obj);
          previousValue = obj.name;
        }


      }
      this.headersA = [...new Set(tempHeadersA)];
      for (let indexB = 1; indexB < headersB.length; indexB++) {
        const elementB = headersB[indexB];
        const objB = {
          id: indexB - 1,
          name: elementB,
          parent: headersA[indexB]
        }
        if (objB.name !== 'code' && objB.name !== 'name' && objB.name !== 'dk' && objB.name !== '\r' && objB.name !== 'x' && objB.name !== 'y' && objB.name !== null) {
          this.headersB.push(objB)
        }
      }

      for (let index = 2; index < rows.length - 1; index++) {
        const element = rows[index];

        const response: any = {};
        const properties = element.split(';')

        for (let j in headersB) {
          response[headersB[j]] = properties[j];

        }
        this.neighborhoods.push(response);

        tempDk.push(properties[2]);
      }


      tempDk.sort();
      this.dks = [...new Set(tempDk)];
      this.neighborhoodsRaw = this.neighborhoods;
    });

    this.view = new OlView({
      center: [0, 0],
      zoom: 2,
    });


    this.map = new OlMap({
      target: 'neighborhoods-map',
      controls: [],
      view: this.view
    });

    this.map.addControl(new Attribution());

    let closer = document.getElementById('popup-closer')!;
    let content = document.getElementById('popup-content')!;
    let popup = new Overlay({
      element: document.getElementById('popup')!,
      offset: [0, 0],
      autoPan: true
    });

    this.map.addOverlay(popup);

    closer.onclick = () => {
      popup.setPosition(undefined);
      closer.blur();
      return false;
    };

    if (this.darkThemeService.darkTheme === true) {
      this.map.addLayer(this.cartoDark);
    }
    else {
      this.map.addLayer(this.cartoLight);
    }

    this.map.addLayer(this.neighborhoodsLayer);

    this.map.on('click', (e: any)=> {
      popup.setPosition(undefined);
      let coordinate = e.coordinate;


      this.map.forEachFeatureAtPixel(e.pixel, (feature: any, layer: any) => {

        if (layer !== null) {

          if (layer.className_ === 'neighborhoods') {
            if (feature) {
              this.clickedFeatureId = feature.get('geitonia_C');
              let popupTitle = '';
              let popupValue = '';

              for (let index = 0; index < this.neighborhoods.length; index++) {
                const element = this.neighborhoods[index];
                if (element.code == this.clickedFeatureId) {
                  popupTitle = element.name;
                  if (this.selectedVariableB) {

                    if (element[this.selectedVariableB.name]) {
                      popupValue = (element[this.selectedVariableB.name] * 100) + '%';
                    }
                    else {
                      popupValue = 'N/A'
                    }
                  }
                }
              }

              content.innerHTML =
                // '</a>' +
                '<p class="popup-title">' +
                popupTitle +
                '</p>' +
                '<p class="popup-value">' +
                popupValue +
                '</p>'
                ;
              popup.setPosition(coordinate);

            } else {

              popup.setPosition(undefined);
              closer.blur();

            }
          }
        }

      },
        {
          hitTolerance: 2,
        })
    })


    this.neighborhoodsSource.once('change', (response: any) => {
      this.initialStyle(this.labels);
      for (let index = 0; index < this.neighborhoodsSource.getFeatures().length; index++) {
        const element = this.neighborhoodsSource.getFeatures()[index];
        this.neighborhoodsSourceRaw.addFeature(element);
      }
      this.initialExtent = this.neighborhoodsSource.getExtent();
      this.map.getView().fit(this.neighborhoodsSource.getExtent(), {
        size: this.map.getSize(),
        padding: this.mapViewPaddig,
        duration: 3000,
        maxZoom: 18
      });

    })

    this.neighborhoodsSource.once('change', (response: any) => {
      this.initialStyle(this.labels);
      this.initialExtent = this.neighborhoodsSource.getExtent();
      this.map.getView().fit(this.neighborhoodsSource.getExtent(), {
        size: this.map.getSize(),
        padding: this.mapViewPaddig,
        duration: 3000,
        maxZoom: 18
      });

    })

  }

  clear() {
    this.selectedVariableA = null;
    this.selectedVariableB = null;
    this.reverse = false;

    this.sortCities(this.selectedVariableB, this.reverse, true, this.labels);
  }


  filterDk(filter: string) {

    if (filter === 'Όλες') {
      this.neighborhoods = this.neighborhoodsRaw;
    }
    else {
      this.neighborhoods = [];
      for (let index = 0; index < this.neighborhoodsRaw.length; index++) {
        const element = this.neighborhoodsRaw[index];

        if (element.dk === filter) {
          this.neighborhoods.push(element);
        }

      }
    }



    this.neighborhoodsSource.clear();

    let filterIds: number[] = [];

    for (let index = 0; index < this.neighborhoods.length; index++) {
      const element = this.neighborhoods[index];
      filterIds.push(parseInt(element.code));
    }
    let filtered = this.neighborhoodsSourceRaw.getFeatures().filter((f) => {
      return filterIds.includes(f.get('geitonia_C'));
    })

    for (let index = 0; index < filtered.length; index++) {
      const element = filtered[index];
      this.neighborhoodsSource.addFeature(element);
    }

    this.initialExtent = this.neighborhoodsSource.getExtent();

    if (this.selectedVariableB) {
      this.sortCities(this.selectedVariableB, this.reverse, true, this.labels);
    }

  }



  sortCities(variable: any, reverse: boolean, toggle: boolean, labels: boolean) {

    this.suffleCards = Math.floor(Math.random() * Math.floor(60));
    if (variable) {

      this.legendColors = [];
      let colorRamp = chroma.scale('spectral').colors(this.neighborhoods.length);

      this.legendColors.push(colorRamp[0]);
      this.legendColors.push(colorRamp[Math.floor(colorRamp.length / 4)]);
      this.legendColors.push(colorRamp[Math.floor(colorRamp.length / 2)]);
      this.legendColors.push(colorRamp[Math.floor((colorRamp.length * 3) / 4)]);
      this.legendColors.push(colorRamp[Math.floor(colorRamp.length - 1)]);
      // }
      if (!toggle) {
        variable = variable.value;
      }

      if (!reverse) {
        this.neighborhoods.sort((a: any, b: any) => {
          return b[variable.name] - a[variable.name];
        });
      }
      else {
        colorRamp.reverse();
        this.neighborhoods.sort((a: any, b: any) => {
          return a[variable.name] - b[variable.name];
        });
      }

      for (let index = 0; index < this.neighborhoods.length; index++) {
        this.neighborhoods[index].order_number = index + 1;
        if (!reverse) {
          this.neighborhoods[index].color = colorRamp[index]
        }
        else {
          this.neighborhoods[index].color = colorRamp[this.neighborhoods.length - index - 1]
        }
        if (!this.neighborhoods[index][variable.name]) {
          this.neighborhoods[index].color = 'rgba(255,255,255,0)';
        }
        this.neighborhoods[index].selected_variable = this.neighborhoods[index][variable.name];
      }

    }


    if (this.selectedVariableB) {

      for (let index = 0; index < this.neighborhoodsSource.getFeatures().length; index++) {
        const element = this.neighborhoodsSource.getFeatures()[index];

        for (let indexN = 0; indexN < this.neighborhoods.length; indexN++) {
          const elementN = this.neighborhoods[indexN];

          if (elementN.code == element.get('geitonia_C')) {

            let style;
            let text = elementN.order_number + '. ' + elementN.name;
            if (labels) {
              style = new Style({
                fill: new Fill({
                  color: elementN.color
                }),
                stroke: new Stroke({
                  color: elementN.color,
                  width: 1.5
                }),
                text: this.createTextStyle(text),
              })
            }
            else {
              style = new Style({
                fill: new Fill({
                  color: elementN.color
                }),
                stroke: new Stroke({
                  color: elementN.color,
                  width: 1.5
                })
              })
            }

            element.setStyle(style);
          }
        }
      }
    }
    else {
      this.initialStyle(this.labels);
    }



  }

  flipImage(city: any) {

    city.state === 'default' ? city.state = 'rotated' : city.state = 'default';

    setTimeout(() => {
      for (let index = 0; index < this.neighborhoods.length; index++) {
        const element = this.neighborhoods[index];

        if (element.name === city.name) {
          element.flipped_image = !element.flipped_image;
        }

      }
    }, 400);



  }

  navigateToMap(neighborhood: any, index: any) {
    // this.router.navigate(['/app-map'], { queryParams: { zoom: zoom, center: center, city: city, statIndex: index } });
  }


  initialStyle(labels: boolean) {

    let text = '';
    for (let index = 0; index < this.neighborhoodsSource.getFeatures().length; index++) {
      const element = this.neighborhoodsSource.getFeatures()[index];
      text = '';

      for (let indexN = 0; indexN < this.neighborhoods.length; indexN++) {
        const elementN = this.neighborhoods[indexN];

        if (elementN.code == element.get('geitonia_C')) {
          if (elementN.order_number) {
            text = elementN.order_number + '. ' + elementN.name
          }
          else {
            text = elementN.name;
          }
          let style;
          if (labels) {
            style = new Style({
              fill: new Fill({
                color: 'rgba(181, 216, 139,0.25)'
              }),
              stroke: new Stroke({
                color: 'rgba(181, 216, 139,1)',
                width: 1.5
              }),
              text: this.createTextStyle(text),
            })
          }
          else {
            style = new Style({
              fill: new Fill({
                color: 'rgba(181, 216, 139,0.25)'
              }),
              stroke: new Stroke({
                color: 'rgba(181, 216, 139,1)',
                width: 1.5
              })
            })
          }

          element.setStyle(style)
        }
      }



    }
  }

  hoverStyle(id: any, text: string, labels: boolean) {


    for (let index = 0; index < this.neighborhoodsSource.getFeatures().length; index++) {
      const element = this.neighborhoodsSource.getFeatures()[index];

      if (element.get('geitonia_C') == id) {

        this.hoverPrevious = element.getStyle();

        let style;

        if (labels) {
          style = new Style({
            fill: new Fill({
              color: 'rgba(87, 178, 41,0.5)'
            }),
            stroke: new Stroke({
              color: 'rgba(87, 178, 41,1)',
              width: 3
            }),
            text: this.createTextStyle(text),
          })
        }
        else {
          style = new Style({
            fill: new Fill({
              color: 'rgba(87, 178, 41,0.5)'
            }),
            stroke: new Stroke({
              color: 'rgba(87, 178, 41,1)',
              width: 3
            })
          })
        }


        element.setStyle(style)
      }


    }
  }

  hoverOutStyle(id: any) {


    for (let index = 0; index < this.neighborhoodsSource.getFeatures().length; index++) {
      const element = this.neighborhoodsSource.getFeatures()[index];

      if (element.get('geitonia_C') == id) {

        element.setStyle(this.hoverPrevious);
      }


    }
  }

  createTextStyle(text: string) {
    const align = this.textStyle.align;
    const baseline = this.textStyle.baseline;
    const size = this.textStyle.size;
    const height = this.textStyle.height;
    const offsetX = parseInt(this.textStyle.offsetX, 10);
    const offsetY = parseInt(this.textStyle.offsetY, 10);
    const weight = this.textStyle.weight;
    const placement = this.textStyle.placement ? this.textStyle.placement : undefined;
    const maxAngle = this.textStyle.maxangle ? parseFloat(this.textStyle.maxangle) : undefined;
    const overflow = this.textStyle.overflow ? this.textStyle.overflow == 'true' : undefined;
    const rotation = parseFloat(this.textStyle.rotation);
    const font = weight + ' ' + size + '/' + height + ' ' + this.textStyle.font;
    const fillColor = this.textStyle.color;
    const outlineColor = this.textStyle.outline;
    const outlineWidth = parseInt(this.textStyle.outlineWidth, 10);

    return new Text({
      textAlign: 'center',
      textBaseline: 'middle',
      font: font,
      text: text,
      fill: new Fill({ color: fillColor }),
      stroke: new Stroke({ color: outlineColor, width: outlineWidth }),
      offsetX: offsetX,
      offsetY: offsetY,
      placement: 'point',
      maxAngle: maxAngle,
      overflow: overflow,
      rotation: rotation,
    });
  }


  // hoverNeighborhood(id: number, text: string) {

  // }

  clickNeighborhood(id: number) {
    let extent: number[] = [];
    for (let index = 0; index < this.neighborhoodsSource.getFeatures().length; index++) {
      const element = this.neighborhoodsSource.getFeatures()[index];

      if (element.get('geitonia_C') == id) {
        extent = element.getGeometry().getExtent();
      }
    }

    if (extent.length > 0) {
      this.map.getView().fit(extent, {
        size: this.map.getSize(),
        padding: this.mapViewPaddig,
        duration: 3000,
        maxZoom: 18
      });
    }

  }

  zoomIn() {
    this.maxZoom = this.map.getView().getMaxZoom();
    this.zoom = this.map.getView().getZoom();
    if (this.zoom <= this.maxZoom) {
      this.zoom++;
      this.map.getView().animate({ zoom: this.zoom, duration: 1000 });
    }
  }

  zoomOut() {
    this.minZoom = this.map.getView().getMinZoom();
    this.zoom = this.map.getView().getZoom();
    if (this.zoom >= this.minZoom) {
      this.zoom--;
      this.map.getView().animate({ zoom: this.zoom, duration: 1000 });
    }
  }

  resetExtent() {
    this.map.getView().fit(this.initialExtent, {
      size: this.map.getSize(),
      padding: this.mapViewPaddig,
      duration: 3000,
      maxZoom: 18
    });
  }

  opacityChange(e: any) {
    this.neighborhoodsLayer.setOpacity(e/100);
  }

  goToMap() {

  }

  moreInfo() {
    this.dialog.open(MoreInfoDialog);
  }


}


@Pipe({
  name: 'myfilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item: any) => { return item.parent === filter.name; });
  }
}




@Component({
  selector: "more-dialog",
  templateUrl: "more-dialog.html",
  styleUrls: ["more-dialog.scss"]
})

export class MoreInfoDialog {

  lang = 'gr';
  constructor(
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<MoreInfoDialog>
  ) {

    this.translateService.lang$.subscribe(value => {
      this.lang = value.toString();
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}