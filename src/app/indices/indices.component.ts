import { DarkThemeService } from 'src/app/shared/dark-theme/dark-theme.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import OlView from "ol/View";
import OlMap from "ol/Map";
import { Attribution } from 'ol/control';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/WebGLTile.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorImageLayer from 'ol/layer/VectorImage';
import * as chroma from 'chroma-js';
import { Style, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';
import { MatDrawer } from '@angular/material/sidenav';




@Component({
  selector: 'app-indices',
  templateUrl: './indices.component.html',
  styleUrls: ['./indices.component.scss']
})
export class IndicesComponent implements OnInit {

  isLoading: boolean = false;


  innerWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 855) {
      this.mapViewPaddig = [16, 16, 16, 16];
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

  initialExtent: number[] = [2636520.1557000000029802, 4572119.5005000000819564, 2648420.1557000000029802, 4584144.5005000000819564];

  mapViewPaddig: number[] = [16, 16, 16, 16];

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


  layerOpacity: number = 80;

  indexSource = new VectorSource({
    url: "assets/geodata/indices_3857.geojson",
    format: new GeoJSON()
  });

  indexLayer = new VectorImageLayer({
    className: "indices",
    source: this.indexSource,
    opacity: this.layerOpacity / 100,
    zIndex: 3,
    style: (f: any) => {



      let color = 'gray';

      if (f.get(this.selectedVariableName) < this.breakPoints[1]) {
        color = this.colorRamp[0];
      }
      else if (f.get(this.selectedVariableName) < this.breakPoints[2]) {
        color = this.colorRamp[1];
      }
      else if (f.get(this.selectedVariableName) < this.breakPoints[3]) {
        color = this.colorRamp[2];
      }
      else if (f.get(this.selectedVariableName) < this.breakPoints[4]) {
        color = this.colorRamp[3];
      }
      else if (f.get(this.selectedVariableName) <= this.breakPoints[5]) {
        color = this.colorRamp[4];
      }

      return new Style({
        fill: new Fill({
          color: color
        })
      });
    }
  });


  selectedVariable: any = 1;
  selectedVariableName: string = 'WALKABILIT';

  colorRamp = chroma.scale('spectral').colors(5);

  isDarkTheme: boolean = false;
  // private webWorker: Worker

  variables: any = [
    { id: 1, name: 'WALKABILIT', label: "Σύνθετος δείκτης βαδισιμότητας", level: 1, parent_index: null, max: 1 },
    { id: 2, name: 'PILLAR_01_', label: "1: Συνθετικός υπό-δείκτης αξιολόγησης επιπέδων άνεσης του οδικού περιβάλλοντος μετακίνησης πεζή", level: 2, parent_index: 1, max: 1 },
    { id: 3, name: 'PILLAR_02_', label: "2: Συνθετικός υπό-δείκτης αξιολόγησης περιοχών με αισθητικά & λειτουργικά ενδιαφέρουσες διαδρομές", level: 2, parent_index: 1, max: 1 },
    { id: 4, name: 'PILLAR_03_', label: "3: Συνθετικός υπό-δείκτης αξιολόγησης οδικής υποδομής & αστικού εξοπλισμού υποστήριξης των πεζών", level: 2, parent_index: 1, max: 1 },
    { id: 44, name: 'PILLAR_04_', label: "4: Συνθετικός υπό-δείκτης αξιολόγησης πολεοδομικών & συγκοινωνιακών παραγόντων για τη δημιουργία μικρού μήκους & σύντομων διαδρομών", level: 2, parent_index: 1, max: 1 },
    { id: 5, name: 'PILLAR_05_', label: "5: Συνθετικός υπό-δείκτης αξιολόγησης περιοχών για την ύπαρξη περιοχών με ελκυστικό εξοπλισμό και συνθήκες στις στάσεις των λεωφορείων", level: 2, parent_index: 1, max: 1 },
    { id: 6, name: 'AISTH_DROM', label: "2.8: Ύπαρξη δρόμων χωρίς ισόγεια με οχλούσες δραστηριότητες (π.χ. εγκαταλελειμμένα κτήρια, βουλκανιζατέρ, βενζινάδικα, χέρσα οικόπεδα κ.λπ.)", level: 3, parent_index: 2, max: 0.0973 },
    { id: 7, name: 'AISTH_ESTI', label: "2.6: Ύπαρξη καταστημάτων εστίασης με τραπεζοκαθίσματα στον δημόσιο χώρο", level: 3, parent_index: 3, max: 0.0982 },
    { id: 8, name: 'AISTH_KATA', label: "2.2: Ύπαρξη κτηρίων σε καλή κατάσταση", level: 3, parent_index: 3, max: 0.1221 },
    { id: 9, name: 'AISTH_KTHR', label: "2.9: Ύπαρξη κτηρίων με μεγάλο ύψος (>=18.4μ. διάμεση τιμή)", level: 3, parent_index: 3, max: 0.0969 },
    { id: 10, name: 'AISTH_KURI', label: "2.5 Κυριαρχία ισογείων με εμπορικές δραστηριότητες (≥60% του μήκους κάθε πλευράς ΟΤ)", level: 3, parent_index: 3, max: 0.0990 },
    { id: 11, name: 'AISTH_PEZO', label: "2.3: Ύπαρξη πεζοδρομίων με φυτεμένα παρτέρια (≥50% του μήκους κάθε πλευράς ΟΤ)", level: 3, parent_index: 3, max: 0.1212 },
    { id: 12, name: 'AISTH_PE_1', label: "2.1: Ύπαρξη διαδρομών με πεζοδρόμους", level: 3, parent_index: 3, max: 0.1612 },
    { id: 13, name: 'AISTH_PRAS', label: "2.4: Ύπαρξη κτηρίων με πρασιά/προκήπιο (≥50% του μήκους κάθε πλευράς ΟΤ)", level: 3, parent_index: 3, max: 0.1221 },
    { id: 14, name: 'AISTH_TOUR', label: "2.7: Συγκέντρωση τουριστικών ατραξιόν (π.χ. Μουσεία, Αρχαιολογικοί/Πολιτιστικοί χώροι κ.α. - δεδομένα από openstreetmap)", level: 3, parent_index: 3, max: 0.0977 },
    { id: 16, name: 'ANE_THORIV', label: "1.5: Ύπαρξη δρόμων με χαμηλά επίπεδα θορύβου (δεδομένα χαρτών θορύβου ΥΠΕΝ)", level: 3, parent_index: 1, max: 0.1120 },
    { id: 17, name: 'ANE_STOES_', label: "1.7: Ύπαρξη κτηρίων με κατά μήκος στοές (προστασία από καιρικά φαινόμενα) (≥25% του μήκους κάθε πλευράς ΟΤ)", level: 3, parent_index: 2, max: 0.1000 },
    { id: 18, name: 'ANE_PEZODR', label: "1.1: Ύπαρξη διαδρομών με πεζοδρόμια χωρίς εμπόδια", level: 3, parent_index: 2, max: 0.2205 },
    { id: 19, name: 'ANE_KLISH_', label: "1.6: Ύπαρξη διαδρομών χωρίς μεγάλες ανηφόρες (κλίση εδάφους)", level: 3, parent_index: 2, max: 0.1000 },
    { id: 20, name: 'ANE_DROMOI', label: "1.4: Ύπαρξη δρόμων με μικρό πλάτος οδοστρώματος", level: 3, parent_index: 2, max: 0.1360 },
    { id: 21, name: 'ANE_DROM_1', label: "1.3: Ύπαρξη διαδρομών με δενδροστοιχίες (σκιά)", level: 3, parent_index: 2, max: 0.1590 },
    { id: 22, name: 'ANE_DROM_2', label: "1.2: Ύπαρξη δρόμων ήπιας κυκλοφορίας", level: 3, parent_index: 2, max: 0.1680 },
    { id: 23, name: 'EKSOP_BUS_', label: "5.5: Συγκέντρωση στάσεων που υπάρχει εξοχή του πεζοδρομίου", level: 3, parent_index: 5, max: 0.1320 },
    { id: 24, name: 'EKSOP_BUS1', label: "5.4: Συγκέντρωση στάσεων με καλό επίπεδο καθαριότητας", level: 3, parent_index: 5, max: 0.1330 },
    { id: 25, name: 'EKSOP_BU_1', label: "5.6: Συγκέντρωση στάσεων με κάθισμα που βρίσκεται σε καλή κατάσταση", level: 3, parent_index: 5, max: 0.1130 },
    { id: 26, name: 'EKSOP_BU_2', label: "5.7: Συγκέντρωση στάσεων με καλή ορατότητα των διερχόμενων λεωφορείων και οχημάτων", level: 3, parent_index: 5, max: 0.1070 },
    { id: 27, name: 'EKSOP_BU_3', label: "5.3: Συγκέντρωση στάσεων με τοποθετημένο στέγαστρο σε καλή κατάσταση", level: 3, parent_index: 5, max: 0.1400 },
    { id: 28, name: 'EKSOP_BU_4', label: "5.2: Συγκέντρωση στάσεων με τοποθετημένο ηλ.πίνακα τηλεματικής", level: 3, parent_index: 5, max: 0.1680 },
    { id: 29, name: 'EKSOP_Tran', label: "5.1: Συγκέντρωση στάσεων με υψηλότερη συχνότητα διερχόμενων δρομολογίων", level: 3, parent_index: 5, max: 0.2060 },
    { id: 30, name: 'ODI_DIAVAS', label: "3.5: Συγκέντρωση διαβάσεων πεζών με λευκή διαγράμμιση (zebra)", level: 3, parent_index: 4, max: 0.1188 },
    { id: 31, name: 'ODI_KOLONA', label: "3.7: Ύπαρξη πεζοδρομίων με προστατευτικά κολωνάκια ή κιγκλιδώματα (≥50% του μήκους κάθε πλευράς ΟΤ)", level: 3, parent_index: 4, max: 0.0767 },
    { id: 32, name: 'ODI_ODEFSI', label: "3.6: Ύπαρξη πεζοδρομίων με τοποθετημένη όδευση τυφλών", level: 3, parent_index: 4, max: 0.0891 },
    { id: 33, name: 'ODI_ODOFOT', label: "3.4: Συγκέντρωση στύλων οδοφωτισμού", level: 3, parent_index: 4, max: 0.1215 },
    { id: 34, name: 'ODI_PAGKAK', label: "3.8: Συγκέντρωση αστικών καθιστικών (παγκάκια)", level: 3, parent_index: 4, max: 0.0740 },
    { id: 35, name: 'ODI_PEZODR', label: "3.2: Συγκέντρωση πεζοδρομίων σε καλή κατάσταση", level: 3, parent_index: 4, max: 0.1713 },
    { id: 36, name: 'ODI_PEZO_1', label: "3.1: Συγκέντρωση πεζοδρομίων με μεγάλο (> 2μ) και σταθερό πλάτος", level: 3, parent_index: 4, max: 0.1759 },
    { id: 37, name: 'ODI_PLHROF', label: "3.9: Συγκέντρωση πεζοδρομίων με πληροφοριακές (καφέ) πινακίδες", level: 3, parent_index: 4, max: 0.0503 },
    { id: 38, name: 'ODI_RAMPES', label: "3.3: Συγκέντρωση ραμπών ΑμΕΑ που βρίσκονται σε καλή κατάσταση στις άκρες των διαβάσεων πεζών", level: 3, parent_index: 4, max: 0.1224 },
    { id: 39, name: 'POL_METRO_', label: "4.2: Πυκνότητα σταθμών ΜΕΤΡΟ", level: 3, parent_index: 44, max: 0.2131 },
    { id: 40, name: 'POL_MIXEDU', label: "4.1: Συγκέντρωση περιοχών με μεικτές χρήσεις γης ", level: 3, parent_index: 44, max: 0.2535 },
    { id: 41, name: 'POL_POP201', label: "4.4: Πυκνότητα πληθυσμού ανά ΟΤ (ΕΛΣΤΑΤ 2011)", level: 3, parent_index: 44, max: 0.1713 },
    { id: 42, name: 'POL_PT_STO', label: "4.3: Πυκνότητα στάσεων λεωφορείων/τρόλεϊ/τράμ", level: 3, parent_index: 44, max: 0.2103 },
    { id: 43, name: 'POL_PYKNOT', label: "4.5: Πυκνότητα διασταυρώσεων οδικού δικτύου", level: 3, parent_index: 44, max: 0.1518 },
  ];

  @ViewChild('drawer') public drawer: MatDrawer;


  // legendColors: string[] = [];
  breakPoints: number[] = [];

  controlsHeight: string = '198px';
  controlsHeightB: string = '198px';
  clickedFeatureId: string = '';

  previousSelectedFeatures: any[] = [];

  constructor(private darkThemeService: DarkThemeService, private dialog:MatDialog) {

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
        this.controlsHeightB = `${64 + 70 + cr.height}px`;
      }

    })

    if (this.controls) {
      if (this.controls.nativeElement) {
        ro.observe(this.controls.nativeElement);
      }
    }

    this.view = new OlView({
      center: [0, 0],
      zoom: 2,
    });


    this.map = new OlMap({
      target: 'indices-map',
      controls: [],
      view: this.view
    });

    this.map.addControl(new Attribution());

    if (this.darkThemeService.darkTheme === true) {
      this.map.addLayer(this.cartoDark);
    }
    else {
      this.map.addLayer(this.cartoLight);
    }


    this.map.addLayer(this.indexLayer);



    this.indexSource.once('featuresloadend', (response: any) => {
      this.breakPoints[0] = Math.min(...this.indexSource.getFeatures().map(f => f.get(this.selectedVariableName)));
      this.breakPoints[5] = Math.max(...this.indexSource.getFeatures().map(f => f.get(this.selectedVariableName)));

      this.breakPoints[4] = (this.breakPoints[5] - this.breakPoints[0]) * 0.8;
      this.breakPoints[3] = (this.breakPoints[5] - this.breakPoints[0]) * 0.6;
      this.breakPoints[2] = (this.breakPoints[5] - this.breakPoints[0]) * 0.4;
      this.breakPoints[1] = (this.breakPoints[5] - this.breakPoints[0]) * 0.2;

      this.initialExtent = this.indexSource.getExtent();
      this.map.getView().fit(this.initialExtent, {
        size: this.map.getSize(),
        padding: this.mapViewPaddig,
        duration: 3000,
        maxZoom: 18
      });

    });


    this.map.on('click', (e: any) => {
      for (let index = 0; index < this.previousSelectedFeatures.length; index++) {
        const element = this.previousSelectedFeatures[index];
        element.setStyle(null);
      }
      this.previousSelectedFeatures = [];
      this.map.forEachFeatureAtPixel(e.pixel, (feature: any, layer: any) => {

        if (layer !== null) {

          if (layer.className_ === 'indices') {
            if (feature) {

              this.previousSelectedFeatures.push(feature);
              for (let index = 0; index < this.variables.length; index++) {
                const element = this.variables[index];
                element.value = Math.round(feature.get(element.name) * 100) / 100;
                // let bp = element.max/5;
                if (element.value < element.max* 0.2) {
                  element.color = this.colorRamp[0];
                }
                else if (element.value < element.max* 0.4) {
                  element.color = this.colorRamp[1];
                }
                else if (element.value < element.max* 0.6) {
                  element.color = this.colorRamp[2];
                }
                else if (element.value < element.max* 0.8) {
                  element.color = this.colorRamp[3];
                }
                else if (element.value <= 1) {
                  element.color = this.colorRamp[4];
                }
              }

              this.drawer.open();

              feature.setStyle(
             new Style({
                fill: new Fill({
                  color: 'rgba(87, 178, 41,0.5)'
                }),
                stroke: new Stroke({
                  color: 'rgba(87, 178, 41,1)',
                  width: 3
                })
              })
              )
            } 
          }
        }

      },
        {
          hitTolerance: 0.0001,
        })
    })


  }

  ngOnInit(): void {





  }


  selectVariable(variable: any) {
    for (let indexV = 0; indexV < this.variables.length; indexV++) {
      const elementV = this.variables[indexV];
      if (elementV.id === this.selectedVariable) {
        this.selectedVariableName = elementV.name;
      }
    }

    this.breakPoints[0] = Math.min(...this.indexSource.getFeatures().map(f => f.get(this.selectedVariableName)));
    this.breakPoints[5] = Math.max(...this.indexSource.getFeatures().map(f => f.get(this.selectedVariableName)));
    this.breakPoints[4] = (this.breakPoints[5] - this.breakPoints[0]) * 0.8;
    this.breakPoints[3] = (this.breakPoints[5] - this.breakPoints[0]) * 0.6;
    this.breakPoints[2] = (this.breakPoints[5] - this.breakPoints[0]) * 0.4;
    this.breakPoints[1] = (this.breakPoints[5] - this.breakPoints[0]) * 0.2;

    this.indexSource.refresh();

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
    this.indexLayer.setOpacity(e / 100);
  }

  moreInfo() {
    this.dialog.open(MoreInfoIndicesDialog);
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '../shared/translate/translate.service';

@Pipe({
    name: 'indicesFilter',
    pure: false
})
export class indicesFilterPipe implements PipeTransform {
    transform(indices: any[], filter: any): any {
        if (!indices || !filter) {
            return indices;
        }
        return indices.filter(item => (item.level === filter.level) && (item.parent_index === filter.parent_index));
    }
}


@Component({
selector: "more-dialog",
templateUrl: "more-dialog.html",
styleUrls: ["more-dialog.scss"]
})

export class MoreInfoIndicesDialog {

lang = 'gr';
constructor(
  private translateService: TranslateService,
  public dialogRef: MatDialogRef<MoreInfoIndicesDialog>
) {

  this.translateService.lang$.subscribe(value => {
    this.lang = value.toString();
  });

}

onNoClick(): void {
  this.dialogRef.close();
}


}