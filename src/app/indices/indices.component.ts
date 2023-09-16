import { DarkThemeService } from 'src/app/shared/dark-theme/dark-theme.service';
import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
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
  selectedvariableDesc: string = 'Ο σύνθετος δείκτης βαδισιμότητας αξιολογεί ένα πολυπαραγοντικό ζήτημα, όπως η ελκυστικότητα του αστικού χώρου για το περπάτημα και τους πεζούς. Τα σκορ του σύνθετου δείκτη προκύπτουν από τον σταθμισμένο μέσο όρο των πέντε συνθετικών υπό-δεικτών του. Η σημαντικότητα κάθε μεταβλητής του υποδείγματος υπολογίστηκε από έρευνα 50 ειδικών επιστημόνων χωρικού, πολεοδομικού και συγκοινωνιακού σχεδιασμού και τα αποτελέσματα της φαίνονται στο διάγραμμα της εικόνας στις λεπτομέρειες της παρούσας εφαρμογής. Διευκρινίζεται, ότι τιμές του σύνθετου δείκτη βαδισιμότητας που οπτικοποιούνται στον χάρτη και είναι κοντά στο 1 αντιστοιχούν σε περιοχές που εμφανίζουν υψηλή συγκέντρωση υποδομών και συνθηκών υποστήριξης των πεζών (π.χ. άνεση, λειτουργικότητα, κατάλληλη οδική υποδομή και αστικός εξοπλισμός, μικρές και σύντομες μετακινήσεις, υποδομή υποστήριξης στάσεων), ενώ οι περιοχές με τιμές κοντά στο μηδέν αποτελούν προβληματικά σημεία με σημαντικές ελλείψεις σε βασικές υποδομές και άλλους αστικούς παράγοντες που ενθαρρύνουν και στηρίζουν το περπάτημα στην πόλη.'
  colorRamp = chroma.scale('spectral').colors(5);

  isDarkTheme: boolean = false;
  // private webWorker: Worker

  variables: any = [
    { id: 1, name: 'WALKABILIT', label: "Σύνθετος δείκτης βαδισιμότητας", level: 1, parent_index: null, max: 1, desc: 'Ο σύνθετος δείκτης βαδισιμότητας αξιολογεί ένα πολυπαραγοντικό ζήτημα, όπως η ελκυστικότητα του αστικού χώρου για το περπάτημα και τους πεζούς. Τα σκορ του σύνθετου δείκτη προκύπτουν από τον σταθμισμένο μέσο όρο των πέντε συνθετικών υπό-δεικτών του. Η σημαντικότητα κάθε μεταβλητής του υποδείγματος υπολογίστηκε από έρευνα 50 ειδικών επιστημόνων χωρικού, πολεοδομικού και συγκοινωνιακού σχεδιασμού και τα αποτελέσματα της φαίνονται στο διάγραμμα της εικόνας στις λεπτομέρειες της παρούσας εφαρμογής. Διευκρινίζεται, ότι τιμές του σύνθετου δείκτη βαδισιμότητας που οπτικοποιούνται στον χάρτη και είναι κοντά στο 1 αντιστοιχούν σε περιοχές που εμφανίζουν υψηλή συγκέντρωση υποδομών και συνθηκών υποστήριξης των πεζών (π.χ. άνεση, λειτουργικότητα, κατάλληλη οδική υποδομή και αστικός εξοπλισμός, μικρές και σύντομες μετακινήσεις, υποδομή υποστήριξης στάσεων), ενώ οι περιοχές με τιμές κοντά στο μηδέν αποτελούν προβληματικά σημεία με σημαντικές ελλείψεις σε βασικές υποδομές και άλλους αστικούς παράγοντες που ενθαρρύνουν και στηρίζουν το περπάτημα στην πόλη.' },
    { id: 2, name: 'PILLAR_01_', label: "1: Συνθετικός υπό-δείκτης αξιολόγησης επιπέδων άνεσης του οδικού περιβάλλοντος μετακίνησης πεζή", level: 2, parent_index: 1, max: 1, desc: 'Τα σκορ του πρώτου συνθετικού υπό-δείκτη υπολογίζονται με βάση τον σταθμισμένο μέσο όρο επτά σχετικών απλών δεικτών. Τιμές κοντά στο 1 εμφανίζονται σε περιοχές που συγκεντρώνουν περισσότερα χαρακτηριστικά άνεσης για το περπάτημα (π.χ. πεζοδρόμια χωρίς εμπόδια, ήπια κυκλοφορία, δεντροφύτευση, μικρότεροι δρόμοι, ήσυχοι δρόμοι, ανάγλυφο χωρίς έντονες ανηφόρες, κτήρια με κατα μήκος στοές για προστασία από καιρικά φαινόμενα κ.λπ.), ενώ τιμές κοντά στο 0 παρουσιάζονται σε σημεία με λιγότερους παράγοντες άνεσης για το περπάτημα' },
    { id: 3, name: 'PILLAR_02_', label: "2: Συνθετικός υπό-δείκτης αξιολόγησης περιοχών με αισθητικά & λειτουργικά ενδιαφέρουσες διαδρομές", level: 2, parent_index: 1, max: 1, desc: 'Τα σκορ του δεύτερου συνθετικού υπό-δείκτη υπολογίζονται με βάση τον σταθμισμένο μέσο όρο εννιά σχετικών απλών δεικτών. Τιμές κοντά στο 1 εμφανίζονται σε περιοχές της πόλης που συγκεντρώνουν περισσότερα λειτουργικά και αισθητικά χαρακτηριστικά για να περπατήσεις (π.χ. πεζόδρομοι, τραπεζάκια στο δημόσιο χώρο, καλή κατάσταση κτηρίων, υψηλότερα κτήρια, εμπορικές δραστηριότητες, φύτευση, προκήπια, τουριστικές ατραξιόν κ.λπ.), ενώ αντίθετα τιμές κοντά στο 0 παρουσιάζονται σε προβληματικά σημεία με μειωμένη παρουσία κρίσιμων αισθητικών και λειτουργικών χαρακτηριστικών των διαδρομών για περπάτημα.' },
    { id: 4, name: 'PILLAR_03_', label: "3: Συνθετικός υπό-δείκτης αξιολόγησης οδικής υποδομής & αστικού εξοπλισμού υποστήριξης των πεζών", level: 2, parent_index: 1, max: 1, desc: 'Τα σκορ του τρίτου συνθετικού υπό-δείκτη υπολογίζονται με βάση τον σταθμισμένο μέσο όρο εννιά σχετικών απλών δεικτών. Τιμές κοντά στο 1 εμφανίζονται σε περιοχές της πόλης που συγκεντρώνουν περισσότερες υποδομές και αστικό εξοπλισμό που υποστηρίζουν το περπάτημα (π.χ. φαρδιά πεζοδρόμια, καλή κατάσταση πεζοδρομίων, ράμπες, φωτισμός, διαβάσεις, προστατευτικά κολωνάκια, καθιστικά, πληροφοριακές πινακίδες κ.λπ.), ενώ αντίθετα τιμές κοντά στο 0 παρουσιάζονται σε προβληματικά σημεία με μειωμένη παρουσία αυτών των στοιχείων.' },
    { id: 44, name: 'PILLAR_04_', label: "4: Συνθετικός υπό-δείκτης αξιολόγησης πολεοδομικών & συγκοινωνιακών παραγόντων για τη δημιουργία μικρού μήκους & σύντομων διαδρομών", level: 2, parent_index: 1, max: 1, desc: 'Τα σκορ του τέταρτου συνθετικού υπό-δείκτη υπολογίζονται με βάση τον σταθμισμένο μέσο όρο πέντε σχετικών απλών δεικτών. Τιμές κοντά στο 1 εμφανίζονται σε περιοχές της πόλης που συγκεντρώνουν κατάλληλους πολεοδομικούς και συγκοινωνιακούς παράγοντες για μικρού μήκους και συντομότερες διαδρομές περπατήματος (π.χ. εγγύτητα σε χρήσεις γης, εγγύτητα σε σταθμούς μετρό και άλλων ΜΜΜ, εγγύτητα πληθυσμού, μικρότερα σε μήκος ΟΤ κ.λπ.), ενώ αντίθετα τιμές κοντά στο 0 παρουσιάζονται σε προβληματικά σημεία με μειωμένη παρουσία αυτών των στοιχείων.' },
    { id: 5, name: 'PILLAR_05_', label: "5: Συνθετικός υπό-δείκτης αξιολόγησης περιοχών για την ύπαρξη περιοχών με ελκυστικό εξοπλισμό και συνθήκες στις στάσεις των λεωφορείων", level: 2, parent_index: 1, max: 1, desc: 'Τα σκορ του πέμπτου συνθετικού υπό-δείκτη υπολογίζονται με βάση τον σταθμισμένο μέσο όρο επτά σχετικών απλών δεικτών. Τιμές κοντά στο 1 εμφανίζονται σε περιοχές της πόλης που συγκεντρώνουν περισσότερες στάσεις λεωφορείων με καλύτερη υποδομή και συνθήκες (π.χ. περισσότερα δρομολόγια, τηλεματική, στέγαστρο, κάθισμα, καθαριότητα, εξοχή πεζοδρομίου, ορατότητα  κ.λπ.), ενώ αντίθετα τιμές κοντά στο 0 παρουσιάζονται σε προβληματικά σημεία με μειωμένη παρουσία αυτών των στοιχείων.' },
    { id: 6, name: 'AISTH_DROM', label: "2.8: Ύπαρξη δρόμων χωρίς ισόγεια με οχλούσες δραστηριότητες (π.χ. εγκαταλελειμμένα κτήρια, βουλκανιζατέρ, βενζινάδικα, χέρσα οικόπεδα κ.λπ.)", level: 3, parent_index: 3, max: 0.0973, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που έχουν ισόγεια χωρίς οχλούσες δραστηριότητες. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.0973. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 7, name: 'AISTH_ESTI', label: "2.6: Ύπαρξη καταστημάτων εστίασης με τραπεζοκαθίσματα στον δημόσιο χώρο", level: 3, parent_index: 3, max: 0.0982, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ με βάση τον αριθμό των καταστημάτων εστίασης με τραπεζοκαθίσματα στον δημόσιο χώρο. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.0973. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 8, name: 'AISTH_KATA', label: "2.2: Ύπαρξη κτηρίων σε καλή κατάσταση", level: 3, parent_index: 3, max: 0.1221, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που έχει κτήρια σε καλή κατάσταση (απουσία έστω και ενός κτηρίου με σοβαρές φθορές κ.λπ.). Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1221. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 9, name: 'AISTH_KTHR', label: "2.9: Ύπαρξη κτηρίων με μεγάλο ύψος (>=18.4μ. διάμεση τιμή)", level: 3, parent_index: 3, max: 0.0969, desc: 'Ο δείκτης αξιολογεί το μέσο ύψος των κτηρίων με βάση δορυφορικές εικόνες (2012) και τηλεπισκόπηση (10 μ. χωρική ακρίβεια). Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.0969. Πηγή δεδομένων: Urban Atlas - Building Height 2012, https://land.copernicus.eu/local/urban-atlas/building-height-2012' },
    { id: 10, name: 'AISTH_KURI', label: "2.5 Κυριαρχία ισογείων με εμπορικές δραστηριότητες (≥60% του μήκους κάθε πλευράς ΟΤ)", level: 3, parent_index: 3, max: 0.0990, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που υπάρχει κυριαρχία χρήσεων γης ισογείων με δραστηριότητες λιανικού εμπορίου και εξυπηρέτησης καθημερινών αναγκών. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.0990. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 11, name: 'AISTH_PEZO', label: "2.3: Ύπαρξη πεζοδρομίων με φυτεμένα παρτέρια (≥50% του μήκους κάθε πλευράς ΟΤ)", level: 3, parent_index: 3, max: 0.1212, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που υπάρχει τουλάχιστον στο μισό μήκος των πλευρών φυτεμένο παρτέρι. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1212. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 12, name: 'AISTH_PE_1', label: "2.1: Ύπαρξη διαδρομών με πεζοδρόμους", level: 3, parent_index: 3, max: 0.1612, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των δρόμων του Δήμου που είναι πεζοδρομημένες περιοχές. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1612. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 13, name: 'AISTH_PRAS', label: "2.4: Ύπαρξη κτηρίων με πρασιά/προκήπιο (≥50% του μήκους κάθε πλευράς ΟΤ)", level: 3, parent_index: 3, max: 0.1221, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που υπάρχει τουλάχιστον στο μισό μήκος της πρασιά/προκήπιο. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1221. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 14, name: 'AISTH_TOUR', label: "2.7: Συγκέντρωση τουριστικών ατραξιόν (π.χ. Μουσεία, Αρχαιολογικοί/Πολιτιστικοί χώροι κ.α. - δεδομένα από openstreetmap)", level: 3, parent_index: 3, max: 0.0977, desc: 'Ο δείκτης αξιολογεί την πυκνότητα σημείων τουριστικών ατραξιόν με βάση το openstreetmap.org. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.0977. Πηγή δεδομένων: Openstreetmap.org (2023)' },
    { id: 16, name: 'ANE_THORIV', label: "1.5: Ύπαρξη δρόμων με χαμηλά επίπεδα θορύβου", level: 3, parent_index: 1, max: 0.1120, desc: 'Ο δείκτης αξιολογεί την πυκνότητα δρόμων με χαμηλά επίπεδα θορύβου (<70db). Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1120. Πηγή δεδομένων: Χάρτες Θορύβου Αθήνας, ΥΠΕΝ' },
    { id: 17, name: 'ANE_STOES_', label: "1.7: Ύπαρξη κτηρίων με κατά μήκος στοές (προστασία από καιρικά φαινόμενα) (≥25% του μήκους κάθε πλευράς ΟΤ)", level: 3, parent_index: 2, max: 0.1000, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που υπάρχει τουλάχιστον στο 1/4 του μήκους της στοά. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1000. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 18, name: 'ANE_PEZODR', label: "1.1: Ύπαρξη διαδρομών με πεζοδρόμια χωρίς εμπόδια", level: 3, parent_index: 2, max: 0.2205, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που είναι εφικτή η άνετη κίνηση τουλάχιστον ενός αναπηρικού αμαξιδίου. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.2205. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 19, name: 'ANE_KLISH_', label: "1.6: Ύπαρξη διαδρομών χωρίς μεγάλες ανηφόρες (κλίση εδάφους)", level: 3, parent_index: 2, max: 0.1000, desc: 'Ο δείκτης υπολογίζει την κλίση του εδάφους με βάση ψηφιακό υψομετρικό μοντέλο εδάφους (Οι τιμές του δείκτη είναι αντεστραμένες). Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1000. Πηγή δεδομένων: European Digital Elevation Model (EU-DEM), http://land.copernicus.eu/pan-european/satellite-derived-products/eu-dem/eu-dem-v1-0-and-derived-products/eu-dem-v1.0/view' },
    { id: 20, name: 'ANE_DROMOI', label: "1.4: Ύπαρξη δρόμων με μικρό πλάτος οδοστρώματος", level: 3, parent_index: 2, max: 0.1360, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των δρόμων με πλάτος μικρότερο των 6μ. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1360. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 21, name: 'ANE_DROM_1', label: "1.3: Ύπαρξη διαδρομών με δενδροστοιχίες (σκιά)", level: 3, parent_index: 2, max: 0.1590, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ σταθμισμένη με την πυκνότητα των δενδρστοιχιών που καταγράφονται. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1590. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 22, name: 'ANE_DROM_2', label: "1.2: Ύπαρξη δρόμων ήπιας κυκλοφορίας", level: 3, parent_index: 2, max: 0.1680, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των δρόμων που αποτελούν περιοχές ήπιας κυκλοφορίας (σήμανση, διαφορετικά δάπεδα κ.λπ.). Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1680. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 23, name: 'EKSOP_BUS_', label: "5.5: Συγκέντρωση στάσεων που υπάρχει εξοχή του πεζοδρομίου", level: 3, parent_index: 5, max: 0.1320, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των στάσεων των λεωφορείων που υπάρχει εξοχή του πεζοδρομίου. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1320. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 24, name: 'EKSOP_BUS1', label: "5.4: Συγκέντρωση στάσεων με καλό επίπεδο καθαριότητας", level: 3, parent_index: 5, max: 0.1330, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των στάσεων των λεωφορείων που αξιολογήθηκαν με καλό επίπεδο καθαριότητας. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1330. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 25, name: 'EKSOP_BU_1', label: "5.6: Συγκέντρωση στάσεων με κάθισμα που βρίσκεται σε καλή κατάσταση", level: 3, parent_index: 5, max: 0.1130, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των στάσεων των λεωφορείων που υπάρχει κάθισμα σε καλή κατάσταση. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1130. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 26, name: 'EKSOP_BU_2', label: "5.7: Συγκέντρωση στάσεων με καλή ορατότητα των διερχόμενων λεωφορείων και οχημάτων", level: 3, parent_index: 5, max: 0.1070, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των στάσεων των λεωφορείων που υπάρχει καλή ορατότητα από τους καθήμενους στη στάση των διερχόμενων λεωφορείων και οχημάτων. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1070. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 27, name: 'EKSOP_BU_3', label: "5.3: Συγκέντρωση στάσεων με τοποθετημένο στέγαστρο σε καλή κατάσταση", level: 3, parent_index: 5, max: 0.1400, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των στάσεων των λεωφορείων που υπάρχει τοποθετημένο στέγαστρο σε καλή κατάσταση χωρίς φθορές. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1400. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 28, name: 'EKSOP_BU_4', label: "5.2: Συγκέντρωση στάσεων με τοποθετημένο ηλ.πίνακα τηλεματικής", level: 3, parent_index: 5, max: 0.1680, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των στάσεων των λεωφορείων που υπάρχει τοποθετημένος ηλ.πίνακας τηλεματικής. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1680. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 29, name: 'EKSOP_Tran', label: "5.1: Συγκέντρωση στάσεων με υψηλότερη συχνότητα διερχόμενων δρομολογίων", level: 3, parent_index: 5, max: 0.2060, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των στάσεων των λεωφορείων σταθμισμένη με το μέσο όρο των ημερήσιων δρομολογίων ανά ώρα. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.2060. Πηγή δεδομένων: GTFS OASA - https://archive.data.gov.gr/dataset/oasa-gtfs' },
    { id: 30, name: 'ODI_DIAVAS', label: "3.5: Συγκέντρωση διαβάσεων πεζών με λευκή διαγράμμιση (zebra)", level: 3, parent_index: 4, max: 0.1188, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των διαβάσεων πεζών που υπάρχει εμφανής λευκή διαγράμμιση (zebra). Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1188. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 31, name: 'ODI_KOLONA', label: "3.7: Ύπαρξη πεζοδρομίων με προστατευτικά κολωνάκια ή κιγκλιδώματα (≥50% του μήκους κάθε πλευράς ΟΤ)", level: 3, parent_index: 4, max: 0.0767, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πεζοδρομίων κάθε πλευράς ΟΤ που υπάρχουν τουλάχιστον στο μισό του μήκους τοποθετημένα προστατευτικά κολωνάκια ή κιγκλιδώματα. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.0767. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 32, name: 'ODI_ODEFSI', label: "3.6: Ύπαρξη πεζοδρομίων με τοποθετημένη όδευση τυφλών", level: 3, parent_index: 4, max: 0.0891, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πεζοδρομίων κάθε πλευράς ΟΤ που υπάρχει κατα μήκος τους τοποθετημένη όδευση τυφλών. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.0891. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 33, name: 'ODI_ODOFOT', label: "3.4: Συγκέντρωση στύλων οδοφωτισμού", level: 3, parent_index: 4, max: 0.1215, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των σημείων που υπάρχουν τοποθετημένοι στύλοι οδοφωτισμού. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1215. Πηγή δεδομένων: Αυτοματοποιημένη αναγνώριση σημείων από αλγόριθμους αξιολόγησης πανοραμικών εικόνων της υπηρεσίας mapillary.org' },
    { id: 34, name: 'ODI_PAGKAK', label: "3.8: Συγκέντρωση αστικών καθιστικών (παγκάκια)", level: 3, parent_index: 4, max: 0.0740, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των σημείων που υπάρχουν παγκάκια. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.0740. Πηγή δεδομένων: Τμήμα Γεωχωρικών Δεδομένων Δήμου Αθηναίων (καταγραφές 2017 & 2019)' },
    { id: 35, name: 'ODI_PEZODR', label: "3.2: Συγκέντρωση πεζοδρομίων σε καλή κατάσταση", level: 3, parent_index: 4, max: 0.1713, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που υπάρχει πεζοδρόμιο σε καλή κατάσταση χωρίς φθορές και κατασκευαστικές αστοχίες. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1713. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 36, name: 'ODI_PEZO_1', label: "3.1: Συγκέντρωση πεζοδρομίων με μεγάλο (> 2μ) και σταθερό πλάτος", level: 3, parent_index: 4, max: 0.1759, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που υπάρχει φαρδύ πεζοδρόμιο μέσου πλάτους άνω των 2μ. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1759. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 37, name: 'ODI_PLHROF', label: "3.9: Συγκέντρωση πεζοδρομίων με πληροφοριακές (καφέ) πινακίδες", level: 3, parent_index: 4, max: 0.0503, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που υπάρχουν πληροφοιακές (καφέ) πινακίδες για σημεία πολιτιστικού και αρχαιαολογικού ενδιαφέροντος. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.0503. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 38, name: 'ODI_RAMPES', label: "3.3: Συγκέντρωση ραμπών ΑμΕΑ που βρίσκονται σε καλή κατάσταση στις άκρες των διαβάσεων πεζών", level: 3, parent_index: 4, max: 0.1224, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των σημείων που υπάρχουν κατασκευασμένες ράμπες ΑμΕΑ που είναι καλή και λειτουργική κατάσταση χωρίς φθορές. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1224. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 39, name: 'POL_METRO_', label: "4.2: Πυκνότητα σταθμών ΜΕΤΡΟ", level: 3, parent_index: 44, max: 0.2131, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των σταθμών ΜΕΤΡΟ. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.2131. Πηγή δεδομένων: Γεωπύλη Δήμου Αθηναίων - http://gis.cityofathens.gr' },
    { id: 40, name: 'POL_MIXEDU', label: "4.1: Συγκέντρωση περιοχών με μεικτές χρήσεις γης ", level: 3, parent_index: 44, max: 0.2535, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των πλευρών κάθε ΟΤ που κυριαρχούν μη οικιστικές δραστηριότητες. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.2535. Πηγή δεδομένων: Στοιχεία Μονάδας Βιώσιμης Κινητικότητας ΕΜΠ (2022) στο πλαίσιο της καταγραφής πανοραμικών εικόνων δρόμων Δήμου Αθηναίων για το ερευνητικό έργο Walkable Athens' },
    { id: 41, name: 'POL_POP201', label: "4.4: Πυκνότητα πληθυσμού ανά ΟΤ (ΕΛΣΤΑΤ 2011)", level: 3, parent_index: 44, max: 0.1713, desc: 'Ο δείκτης αξιολογεί την πυκνότητα πληθυσμού ανά ΟΤ. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1713. Πηγή δεδομένων: Στοιχεία Απογραφής Πληθυσμού ΕΛΣΤΑΤ, 2011' },
    { id: 42, name: 'POL_PT_STO', label: "4.3: Πυκνότητα στάσεων λεωφορείων/τρόλεϊ/τράμ", level: 3, parent_index: 44, max: 0.2103, desc: 'Ο δείκτης αξιολογεί την πυκνότητα στάσεων λεωφορείων/τρόλεϊ/τράμΟ. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.2103. Πηγή δεδομένων: GTFS OASA - https://archive.data.gov.gr/dataset/oasa-gtfs' },
    { id: 43, name: 'POL_PYKNOT', label: "4.5: Πυκνότητα διασταυρώσεων οδικού δικτύου", level: 3, parent_index: 44, max: 0.1518, desc: 'Ο δείκτης αξιολογεί την πυκνότητα των διασταυρώσεων με περισσότερους από 3 κλάδους. Η μέγιστη τιμή του κανονικοποιημένου & σταθμισμένου δείκτη είναι 0.1518. Πηγή δεδομένων: Boeing, G. (2021). Street Network Models and Indicators for Every Urban Area in the World. Geographical Analysis, gean.12281. https://doi.org/10.1111/gean.12281' },
  ];

  @ViewChild('drawer') public drawer: MatDrawer;


  // legendColors: string[] = [];
  breakPoints: number[] = [];

  controlsHeight: string = '198px';
  controlsHeightB: string = '198px';
  clickedFeatureId: string = '';

  previousSelectedFeatures: any[] = [];

  showDesc: boolean = false;

  constructor(private darkThemeService: DarkThemeService, private dialog: MatDialog) {

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
                element.value = Math.round(feature.get(element.name) * 1000) / 1000;
                // let bp = element.max/5;
                if (element.value < element.max * 0.2) {
                  element.color = this.colorRamp[0];
                }
                else if (element.value < element.max * 0.4) {
                  element.color = this.colorRamp[1];
                }
                else if (element.value < element.max * 0.6) {
                  element.color = this.colorRamp[2];
                }
                else if (element.value < element.max * 0.8) {
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
        this.selectedvariableDesc = elementV.desc;
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

  toggleDesc() {
    this.dialog.open(DescIndicesDialog, {
      data: this.selectedvariableDesc
    });
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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


@Component({
  selector: "desc-dialog",
  templateUrl: "desc-dialog.html",
  styleUrls: ["desc-dialog.scss"]
})

export class DescIndicesDialog {
  lang = 'gr';
  constructor(
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<MoreInfoIndicesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.translateService.lang$.subscribe(value => {
      this.lang = value.toString();
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}