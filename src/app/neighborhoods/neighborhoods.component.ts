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
import { DescIndicesDialog } from '../indices/indices.component';

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
    className: "neighborhoods",
    source: this.neighborhoodsSource,
    opacity: this.layerOpacity / 100,
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

  variables: any[] = [
    { id: 1, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Μέσος όρος από Παρτέρια (%)', desc: 'Μέσος όρος ποσοστού μήκους πλευρών ανά ΟΤ γειτονιάς με παρτέρια' },
    { id: 2, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Μέσος όρος ύπαρξης στοών (%)', desc: 'Μέσος όρος ποσοστού μήκους πλευρών ανά ΟΤ με (κατά μήκος των κτηρίων) στοές' },
    { id: 3, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Μέσος όρος από Δέντρα', desc: 'Μέσος όρος αριθμού δέντρων ανά πλευρά ΟΤ' },
    { id: 4, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Μέσος όρος από Κολωνάκια ή/και Κιγκλιδώματα (%)', desc: 'Μέσος όρος ποσοστού μήκους πλευρών ανά ΟΤ με κολωνάκια ή/και κιγκλιδώματα' },
    { id: 5, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Καταλήψεις από δενδροστοιχίες', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με δενδροστοιχία που εμποδίζει την άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 6, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Εξοχές κτηρίων', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με ξαφνικές εξοχές κτηρίων που εμποδίζουν την άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 7, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Περίπτερα', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με υφιστάμενα Περίπτερα που εμποδίζουν την άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 8, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Πάγκοι καταστημάτων', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με εξωτερικούς πάγκους καταστημάτων που εμποδίζουν την άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 9, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Καταλήψεις από επίπλωση δρόμου', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με δημόσια καθιστικά (π.χ. παγκάκια) που εμποδίζουν την άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 10, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Κατασκευαστικές ανωμαλίες πεζοδρομίου', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί των δαπέδων του πεζοδρομίου με σοβαρές φθορές (π.χ. λακκούβες) που εμποδίζουν την άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 11, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Στενώσεις από τραπεζοκαθίσματα και πετάσματα', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με στενώσεις εξαιτίας ύπαρξης τραπεζοκαθισμάτων και πετασμάτων που εμποδίζουν την άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 12, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Στύλοι σήμανσης, φωτισμού,  φαναριών, κολωνάκια, κιγκλιδώματα', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με τοποθετημένο αστικό εξοπλισμό που δημιουργεί στενώσεις και εμποδίζεται η άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 13, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια ΚΑΦΑΟ ΟΤΕ ΔΕΗ', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με τοποθετημένα στοιχεία υποδομής υπηρεσιών κοινής ωφέλειας (π.χ. ΚΑΦΑΟ) που δημιουργούν στενώσεις και εμπόδια στην άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 14, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Αντικείμενα ιδιωτών', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με τοποθετημένα στοιχεία ιδιωτών (π.χ. Καρέκλες, τραπεζάκια, γλάστρες, μεταλλικές κατασκευές κ.λπ.) που δημιουργούν στενώσεις και εμπόδια στην άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 15, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Στάσεις ΜΜΜ', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με τοποθετημένες στάσεις ΜΜΜ που δημιουργούν στενώσεις και εμπόδια στην άνετη κίνηση αναπηρικού αμαξιδίου' },
    { id: 16, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Εμπόδια Υψομετρικές διαφορές', desc: 'Ποσοστό πλευρών ΟΤ που εμφανίζεται το εμπόδιο - Περιγραφή τύπου εμποδίου: Αξιολόγηση ύπαρξης τουλάχιστον ενός σημείου επί του πεζοδρομίου με υψομετρικές διαφορές και χωρίς κατάλληλη ράμπα για την κίνηση αναπηρικού αμαξιδίου' },
    { id: 17, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κατάσταση πεζοδρομίου', desc: 'Αξιολόγηση μέσης κατάστασης πεζοδρομίου ανά πλευρά ΟΤ με βάση την ύπαρξη σοβαρών κακοτεχνιών και φθορών που αποτελούν κίνδυνο για τους πεζούς' },
    { id: 18, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Δεν υπάρχει πεζοδρόμιο', desc: 'Ποσοστό μήκους πλευρών ΟΤ γειτονιάς χωρίς κατασκευασμένο πεζοδρόμιο' },
    { id: 19, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Υπάρχει και έχει Σταθερό πλάτος', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με κατασκευασμένο πεζοδρόμιο και σταθερό πλάτος πεζοδρομίου' },
    { id: 20, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Υπάρχει και έχει μεταβαλλόμενο πλάτος', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με κατασκευασμένο πεζοδρόμιο και μεταβαλλόμενο πλάτος πεζοδρομίου' },
    { id: 21, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Πλάτος πεζοδρομίου έως 1μ.', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με μέσο πλάτος πεζοδρομίου έως 1μ.' },
    { id: 22, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Πλάτος πεζοδρομίου 1μ. έως 2μ.', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με μέσο πλάτος από 1μ. έως 2μ.' },
    { id: 23, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Πλάτος πεζοδρομίου πάνω από 2μ.', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με μέσο πλάτος πεζοδρομίου πάνω από 2μ.' },
    { id: 24, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κατάσταση πεζοδρομίου Κακή', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με κατασκευασμένο πεζοδρόμιο σε κακή κατάσταση (π.χ. ύπαρξη συστηματικών και πολλαπλών φθορών υψηλής επικινδυνότητας για τους πεζούς' },
    { id: 25, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κατάσταση πεζοδρομίου Μέτρια', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με κατασκευασμένο πεζοδρόμιο σε μέτρια κατάσταση (π.χ. ύπαρξη φθορών/κακοτεχνιών μέτριας επικινδυνότητας για τους πεζούς' },
    { id: 26, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κατάσταση πεζοδρομίου Καλή', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με κατασκευασμένο πεζοδρόμιο σε καλή κατάσταση (π.χ. πεζοδρόμια σε καλό επίπεδο συντήρησης και χωρίς σημαντικής επικινδυνότητας φθορές για τους πεζούς' },
    { id: 27, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Όδευση τυφλών Όχι', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με πεζοδρόμια χωρίς κατασκευασμένη όδευση τυφλών.' },
    { id: 28, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Όδευση τυφλών Σε όλο το μήκος', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με πεζοδρόμια που έχουν κατασκευασμένες οδεύσεις τυφλών σε όλο το μήκος τους.' },
    { id: 29, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Όδευση τυφλών Σε τμήμα της πλευράς', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με πεζοδρόμια που έχουν κατασκευασμένες οδεύσεις τυφλών σε ορισμένο τμήμα του μήκους τους.' },
    { id: 30, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κατάσταση κτηρίων Κακή', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με προσόψεις κτηρίων που βρίσκονται στην πλειοψηφία τους σε κακή κατάσταση (π.χ. σοβαρές φθορές/ζημιές και ελλιπής συντήρηση)' },
    { id: 31, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κατάσταση κτηρίων Μέτρια', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με προσόψεις κτηρίων που βρίσκονται στην πλειοψηφία τους σε μέτρια κατάσταση (π.χ. μικρός αριθμός κτηρίων με φθορές/ζημιές και ελλιπής συντήρηση χωρίς σοβαρή επικινδυνότητα για τους πεζούς) ' },
    { id: 32, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κατάσταση κτηρίων Καλή', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς με προσόψεις κτηρίων που βρίσκονται στην πλειοψηφία τους σε καλή κατάσταση (π.χ. κυριαρχία συντηρημένων ή νέων κτηρίων χωρίς σημαντικές φθορές) ' },
    { id: 33, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κατάσταση κτηρίων: Δεν υπάρχουν κτήρια στην πλευρά του ΟΤ', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς όπου δεν υπάρχουν κτήρια ' },
    { id: 34, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κυριαρχία εστίασης αναψυχής Όχι', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς που στα ισόγεια των κτηρίων τους δεν (<50%) κυριαρχούν χρήσεις γης με αντικείμενο την εστίαση ή/και την αναψυχή' },
    { id: 35, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κυριαρχία εστίασης αναψυχής Ναι', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς που στα ισόγεια των κτηρίων τους κυριαρχούν χρήσεις γης με αντικείμενο την εστίαση ή/και την αναψυχή' },
    { id: 36, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κυριαρχία κατοικίας Όχι', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς που στα ισόγεια των κτηρίων τους δεν (<50%) κυριαρχεί η κατοικία' },
    { id: 37, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κυριαρχία κατοικίας Ναι', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς που στα ισόγεια των κτηρίων τους κυριαρχεί η κατοικία' },
    { id: 38, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κυριαρχία εμπορικών χρήσεων Όχι', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς που λιγότερο από το 30% των ισογείων των κτηρίων τους υπάρχουν χρήσεις γης λιανικού εμπορίου ή/και εξυπηρέτησης καθημερινών αναγκών' },
    { id: 39, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κυριαρχία εμπορικών χρήσεων Ναι (30%-60% των πλευρών των ΟΤ)', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς που το 30%-60% των ισογείων των κτηρίων τους υπάρχουν χρήσεις γης λιανικού εμπορίου ή/και εξυπηρέτησης καθημερινών αναγκών' },
    { id: 40, general: 'Πλευρές Πεζοδρομίων/ΟΤ', name: 'Κυριαρχία εμπορικών χρήσεων Ναι (>60% των πλευρών των ΟΤ)', desc: 'Ποσοστό μήκους  πλευρών ΟΤ γειτονιάς που περισσότερο από το 60% των ισογείων των κτηρίων τους υπάρχουν χρήσεις γης λιανικού εμπορίου ή/και εξυπηρέτησης καθημερινών αναγκών' },
    { id: 41, general: 'Στάσεις Λεωφορείων', name: 'Υπάρχει Στέγαστρο? Όχι', desc: 'Ποσοστό στάσεων γειτονιάς που υπάρχει στέγαστρο' },
    { id: 42, general: 'Στάσεις Λεωφορείων', name: 'Υπάρχει Στέγαστρο? Ναι Κακή κατάσταση', desc: 'Ποσοστό στάσεων γειτονιάς που υπάρχει στέγαστρο σε κακή κατάσταση (π.χ. σπασίματα,  βανδαλισμοί κ.α.)' },
    { id: 43, general: 'Στάσεις Λεωφορείων', name: 'Υπάρχει Στέγαστρο? Ναι καλή κατάσταση', desc: 'Ποσοστό στάσεων γειτονιάς που υπάρχει στέγαστρο σε καλή κατάσταση' },
    { id: 44, general: 'Στάσεις Λεωφορείων', name: 'Υπάρχει Στέγαστρο? Στάσεη σε Στοά χωρίς στέγαστρο', desc: 'Ποσοστό στάσεων γειτονιάς που βρίσκονται εντός στοάς κτηρίων' },
    { id: 45, general: 'Στάσεις Λεωφορείων', name: 'Υπάρχει Κάθισμα? Όχι', desc: 'Ποσοστό στάσεων γειτονιάς που υπάρχει κάθισμα' },
    { id: 46, general: 'Στάσεις Λεωφορείων', name: 'Υπάρχει Κάθισμα? Ναι κακή κατάσταση', desc: 'Ποσοστό στάσεων γειτονιάς που υπάρχει κάθισμα σε κακή κατάσταση με σημαντικές φθορές (π.χ. σπασίματα,  βανδαλισμοί κ.α.)' },
    { id: 47, general: 'Στάσεις Λεωφορείων', name: 'Υπάρχει Κάθισμα? Ναι καλή κατάσταση', desc: 'Ποσοστό στάσεων γειτονιάς που υπάρχει κάθισμα σε καλή κατάσταση' },
    { id: 48, general: 'Στάσεις Λεωφορείων', name: 'Ορατότητα κακή', desc: 'Ποσοστό στάσεων γειτονιάς που δεν υπάρχει καλή ορατότητα των καθήμενων των ερχόμενων λεωφορείων' },
    { id: 49, general: 'Στάσεις Λεωφορείων', name: 'Ορατότητα καλή', desc: 'Ποσοστό στάσεων γειτονιάς που υπάρχει καλή ορατότητα των καθήμενων των ερχόμενων λεωφορείων' },
    { id: 50, general: 'Στάσεις Λεωφορείων', name: 'Εξοχή πεζοδρομίου Όχι', desc: 'Ποσοστό στάσεων γειτονιάς που δεν υπάρχει επέκταση πεζοδρομίου (με μόνιμο τρόπο ή με φορητή πλατφόρμα) μπροστά στη στάση' },
    { id: 51, general: 'Στάσεις Λεωφορείων', name: 'Εξοχή πεζοδρομίου Ναι', desc: 'Ποσοστό στάσεων γειτονιάς που υπάρχει επέκταση πεζοδρομίου (με μόνιμο τρόπο ή με φορητή πλατφόρμα) μπροστά στη στάση' },
    { id: 52, general: 'Στάσεις Λεωφορείων', name: 'Τηλεματική Όχι', desc: 'Ποσοστό στάσεων γειτονιάς που δεν υπάρχει τοποθετημένος πίνακας τηλεματικής για την πληροφόρηση των επιβατών στη στάση' },
    { id: 53, general: 'Στάσεις Λεωφορείων', name: 'Τηλεματική Ναι', desc: 'Ποσοστό στάσεων γειτονιάς που υπάρχει τοποθετημένος πίνακας τηλεματικής για την πληροφόρηση των επιβατών στη στάση' },
    { id: 54, general: 'Στάσεις Λεωφορείων', name: 'Καθαριότητα κακή', desc: 'Ποσοστό στάσεων γειτονιάς με κακές συνθήκες καθαριότητας (π.χ. ύπαρξη βανδαλισμών, σκουπιδιών,  ακαθαρσιών κ.α.)' },
    { id: 55, general: 'Στάσεις Λεωφορείων', name: 'Καθαριότητα μέτρια', desc: 'Ποσοστό στάσεων γειτονιάς με μέτριες συνθήκες καθαριότητας (π.χ. ύπαρξη βανδαλισμών, σκουπιδιών,  ακαθαρσιών κ.α.)' },
    { id: 56, general: 'Στάσεις Λεωφορείων', name: 'Καθαριότητα καλή', desc: 'Ποσοστό στάσεων γειτονιάς με καλές συνθήκες καθαριότητας' },
    { id: 57, general: 'Δρόμοι', name: 'Μέσος όρος από Μέσο Πλάτος Δρόμου (σε μ.)', desc: 'Μέση τιμή του πλάτους των δρόμων ανά γειτονιά' },
    { id: 58, general: 'Δρόμοι', name: 'Μονόδρομος ', desc: 'Ποσοστό δρόμων γειτονιάς που είναι μονόδρομοι' },
    { id: 59, general: 'Δρόμοι', name: 'Αμφίδρομος', desc: 'Ποσοστό δρόμων γειτονιάς που είναι αμφίδρομης κατεύθυνσης' },
    { id: 60, general: 'Δρόμοι', name: 'Πεζόδρομος', desc: 'Ποσοστό δρόμων γειτονιάς που είναι πεζόδρομοι (ύπαρξη σήμανσης ΚΟΚ)' },
    { id: 61, general: 'Δρόμοι', name: 'Σκάλες', desc: 'Ποσοστό δρόμων γειτονιάς που είναι σκάλες' },
    { id: 62, general: 'Δρόμοι', name: 'Διαμόρφωση δρόμου ήπιας κυκλοφορίας', desc: 'Ποσοστό δρόμων γειτονιάς που έχουν χαρακτηριστικά ήπιας κυκλοφορίας' },
    { id: 63, general: 'Δρόμοι', name: 'Χωματόδρομος', desc: 'Ποσοστό δρόμων γειτονιάς που είναι χωματόδρομοι' },
    { id: 64, general: 'Δρόμοι', name: 'Δρόμος με 1 λωρίδα κυκλοφορίας & στάθμευση δεξιά/αριστερά', desc: 'Ο δείκτης περιγράφει το ποσοστό των δρόμων της γειτονιάς ανάλογα με τον αριθμό λωρίδων κυκλοφορίας και την παρουσία στάθμευσης οχημάτων ανά πλευρά της οδού' },
    { id: 65, general: 'Δρόμοι', name: 'Δρόμος με 1 λωρίδα κυκλοφορίας & στάθμευση στη μια πλευρά μόνο', desc: 'Ο δείκτης περιγράφει το ποσοστό των δρόμων της γειτονιάς ανάλογα με τον αριθμό λωρίδων κυκλοφορίας και την παρουσία στάθμευσης οχημάτων ανά πλευρά της οδού' },
    { id: 66, general: 'Δρόμοι', name: 'Δρόμος με 1 λωρίδα κυκλοφορίας ΧΩΡΙΣ στάθμευση', desc: 'Ο δείκτης περιγράφει το ποσοστό των δρόμων της γειτονιάς ανάλογα με τον αριθμό λωρίδων κυκλοφορίας και την παρουσία στάθμευσης οχημάτων ανά πλευρά της οδού' },
    { id: 67, general: 'Δρόμοι', name: 'Δρόμος με 2 λωρίδες κυκλοφορίας & στάθμευση δεξιά/αριστερά', desc: 'Ο δείκτης περιγράφει το ποσοστό των δρόμων της γειτονιάς ανάλογα με τον αριθμό λωρίδων κυκλοφορίας και την παρουσία στάθμευσης οχημάτων ανά πλευρά της οδού' },
    { id: 68, general: 'Δρόμοι', name: 'Δρόμος με 2 λωρίδες κυκλοφορίας & στάθμευση στη μια πλευρά μόνο', desc: 'Ο δείκτης περιγράφει το ποσοστό των δρόμων της γειτονιάς ανάλογα με τον αριθμό λωρίδων κυκλοφορίας και την παρουσία στάθμευσης οχημάτων ανά πλευρά της οδού' },
    { id: 69, general: 'Δρόμοι', name: 'Δρόμος με 2 λωρίδες κυκλοφορίας ΧΩΡΙΣ στάθμευση', desc: 'Ο δείκτης περιγράφει το ποσοστό των δρόμων της γειτονιάς ανάλογα με τον αριθμό λωρίδων κυκλοφορίας και την παρουσία στάθμευσης οχημάτων ανά πλευρά της οδού' },
    { id: 70, general: 'Δρόμοι', name: 'Δρόμος με >3 λωρίδες κυκλοφορίας & στάθμευση δεξιά/αριστερά', desc: 'Ο δείκτης περιγράφει το ποσοστό των δρόμων της γειτονιάς ανάλογα με τον αριθμό λωρίδων κυκλοφορίας και την παρουσία στάθμευσης οχημάτων ανά πλευρά της οδού' },
    { id: 71, general: 'Δρόμοι', name: 'Δρόμος με >3 λωρίδες κυκλοφορίας & στάθμευση στη μια πλευρά μόνο', desc: 'Ο δείκτης περιγράφει το ποσοστό των δρόμων της γειτονιάς ανάλογα με τον αριθμό λωρίδων κυκλοφορίας και την παρουσία στάθμευσης οχημάτων ανά πλευρά της οδού' },
    { id: 72, general: 'Δρόμοι', name: 'Δρόμος με >3 λωρίδες κυκλοφορίας ΧΩΡΙΣ στάθμευση', desc: 'Ο δείκτης περιγράφει το ποσοστό των δρόμων της γειτονιάς ανάλογα με τον αριθμό λωρίδων κυκλοφορίας και την παρουσία στάθμευσης οχημάτων ανά πλευρά της οδού' },
    { id: 73, general: 'Ράμπες', name: 'Κατάσταση Ράμπας Κακή', desc: 'Ο δείκτης περιγράφει τον αριθμό των υφιστάμενων κατασκευασμένων ραμπών στη γειτονιά που βρίσκονται σε κακή κατάσταση (π.χ. ύπαρξη φθορών και κακοτεχνιών)' },
    { id: 74, general: 'Ράμπες', name: 'Κατάσταση Ράμπας Καλή', desc: 'Ο δείκτης περιγράφει τον αριθμό των υφιστάμενων κατασκευασμένων ραμπών στη γειτονιά που βρίσκονται σε καλή κατάσταση (π.χ. απουσία σοβαρών φθορών και κακοτεχνιών)' },
    { id: 75, general: 'Ράμπες', name: 'Ελιγμός Αμαξιδίου Ναι', desc: 'Ο δείκτης περιγράφει τον αριθμό των υφιστάμενων κατασκευασμένων ραμπών στη γειτονιά που είναι εφικτός ο ελιγμός αναπηρικού αμαξιδίου εκτός κεκλιμένου επιπέδου.' },
    { id: 76, general: 'Διαβάσεις', name: 'Λευκή διαγράμμιση Όχι', desc: 'Ο δείκτης περιγράφει το ποσοστό των διαβάσεων πεζών (επίσημων και ανεπίσημων) της γειτονιάς που δεν υπάρχει λευκή διαγράμμιση (zebra)' },
    { id: 77, general: 'Διαβάσεις', name: 'Λευκή διαγράμμιση Ναι εμφανής', desc: 'Ο δείκτης περιγράφει το ποσοστό των διαβάσεων πεζών (επίσημων και ανεπίσημων) της γειτονιάς που υπάρχει λευκή διαγράμμιση (zebra)' },
    { id: 78, general: 'Διαβάσεις', name: 'Λευκή διαγράμμιση Ναι φθορές', desc: 'Ο δείκτης περιγράφει το ποσοστό των διαβάσεων πεζών (επίσημων και ανεπίσημων) της γειτονιάς που υπάρχει λευκή διαγράμμιση (zebra) αλλά υπάρχουν σημαντικές φθορές' },
    { id: 79, general: 'Διαβάσεις', name: 'Ράμπες ΑμεΑ Όχι σε καμία άκρη', desc: 'Ο δείκτης περιγράφει το ποσοστό των διαβάσεων πεζών (επίσημων και ανεπίσημων) της γειτονιάς που δεν υπάρχουν κατασκευασμένες ράμπες στις δύο άκρες' },
    { id: 80, general: 'Διαβάσεις', name: 'Ράμπες ΑμεΑ Ναι στη μία άκρη', desc: 'Ο δείκτης περιγράφει το ποσοστό των διαβάσεων πεζών (επίσημων και ανεπίσημων) της γειτονιάς που υπάρχει κατασκευασμένη ράμπα στη μία άκρη της διάβασης' },
    { id: 81, general: 'Διαβάσεις', name: 'Ράμπες ΑμεΑ Ναι στις δύο άκρες', desc: 'Ο δείκτης περιγράφει το ποσοστό των διαβάσεων πεζών (επίσημων και ανεπίσημων) της γειτονιάς που υπάρχουν κατασκευασμένες ράμπες και στις δύο άκρες της διάβασης' },
  ];

  selectedVariableDesc: string = '';

  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;

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

    // this.map.addLayer(this.mapLayersService.MplNaviLayer)

    this.map.on('click', (e: any) => {
      
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
                      if (this.selectedVariableB.name === 'Μέσος όρος από Στοά (%)' || this.selectedVariableB.name === 'Μέσος όρος από Παρτέρια (%)' || this.selectedVariableB.name === 'Μέσος όρος από Κολωνάκια ή/και Κιγκλιδώματα (%)') {
                        popupValue = (element[this.selectedVariableB.name]) + '%';
                      }
                      else if (this.selectedVariableB.name === 'Μέσος όρος από Δέντρα (Αριθμός)' || this.selectedVariableB.name === 'Μέσος όρος από Μέσο Πλάτος Δρόμου (σε μ.)') {
                        popupValue = (element[this.selectedVariableB.name]);
                      }
                      else {
                        popupValue = (element[this.selectedVariableB.name] * 100) + '%';
                      }

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

    // this.registerMapEvents(this);

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

    if (this.selectedVariableB) {
      for (let index = 0; index < this.variables.length; index++) {
        const element = this.variables[index];
        if (element.name === this.selectedVariableB.name) {
          this.selectedVariableDesc = element.desc;
        }
      }
    }


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

  toggleDesc() {
    this.dialog.open(DescIndicesDialog, {
      data: this.selectedVariableDesc
    });
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
    this.neighborhoodsLayer.setOpacity(e / 100);
  }

  goToMap() {

  }

  moreInfo() {
    this.dialog.open(MoreInfoDialog);
  }

  public onMapRightClick(event: any){
   
    this.contextmenuX = event.clientX
    this.contextmenuY = event.clientY - 300;
    this.contextmenu = true;
}

public disableContextMenu(){
  this.contextmenu = false;
}

private registerMapEvents(this_: NeighborhoodsComponent): void {

  // right click on map event
  this.map.getViewport().addEventListener('contextmenu',  (evt: any) => {
    evt.preventDefault();
    this.contextmenuX = evt.clientX
    this.contextmenuY = evt.clientY
    this.contextmenu = true;
  });

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