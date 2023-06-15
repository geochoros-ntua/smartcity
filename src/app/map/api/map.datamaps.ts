// keep some config data in here

import { IndexFilter, StatsIndices } from "./map.api";
import { StatLayers, StatTypes } from "./map.enums";

export const FEATURE_GROUPS: Map<string, string> = new Map<string, string>([
  ["object--banner", "Banner"], 
  ["object--bench", "Bench"], 
  ["object--bike-rack", "Bike rack"], 
  ["object--catch-basin", "Catch basin"], 
  ["object--cctv-camera", "CCTV camera"], 
  ["construction--flat--crosswalk-plain", "Crosswalk - plain"], 
  ["construction--flat--driveway", "DriveWay"], 
  ["object--fire-hydrant", "Fire hydrant"], 
  ["object--junction-box", "Junction box"], 
  ["marking--discrete--arrow--left", "Lane marking (left)"], 
  ["marking--discrete--arrow--right", "Lane marking (right)"], 
  ["marking--discrete--arrow--split-left-or-straight", "Lane marking (straight - left)"], 
  ["marking--discrete--arrow--split-right-or-straight", "Lane marking (straight - right)"], 
  ["marking--discrete--arrow--straight", "Lane marking (straight)"], 
  ["marking--discrete--crosswalk-zebra", "Lane marking - crosswalk"], 
  ["marking--discrete--give-way-row", "Lane marking - give way(row)"], 
  ["marking--discrete--give-way-single", "Lane marking - give way(single)"], 
  ["marking--discrete--other-marking", "Lane marking - other"], 
  ["marking--discrete--stop-line", "Lane marking - stop line"], 
  ["marking--discrete--symbol--bicycle", "Lane marking - symbol bicycle"], 
  ["marking--discrete--text", "Lane marking - text"], 
  ["object--mailbox", "Mailbox"], 
  ["object--manhole", "Manhole"], 
  ["object--parking-meter", "Parking meter"], 
  ["object--phone-booth", "Phone booth"], 
  ["object--support--pole", "Pole"], 
  ["object--sign--advertisement", "Signage - advertisement"], 
  ["object--sign--information", "Signage - information"], 
  ["object--sign--store", "Signage - store"], 
  ["object--street-light", "Street - light"], 
  ["construction--barrier--temporary", "Temporary barrier"], 
  ["object--traffic-cone", "Traffic cone"], 
  ["object--traffic-light--cyclists", "Traffic light - cyclists"], 
  ["object--traffic-light--other", "Traffic light - other"], 
  ["object--traffic-light--general-horizontal", "Traffic light - horizontal"], 
  ["object--traffic-light--general-single", "Traffic light - single"], 
  ["object--traffic-light--general-upright", "Traffic light - upright"], 
  ["object--support--traffic-sign-frame", "Traffic sign - frame"], 
  ["object--trash-can", "Trash can"], 
  ["object--support--utility-pole", "Utility pole"], 
  ["object--water-valve", "Water valve"]
]);


export const DEFAULT_FILTER: IndexFilter = {
  sindex: null,
  values: [],
  classes: []
}

export const DHM_KOINOTHTES: string[] = ['1η ΔΚ', '2η ΔΚ', '3η ΔΚ', '4η ΔΚ', '5η ΔΚ', '6η ΔΚ', '7η ΔΚ'];

export const STATS_INDECES: StatsIndices[] = [
  // audit lines 
  {code: 'A_111', label: 'Σούπερ μάρκετ / Μίνι μάρκετ', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:6},
  {code: 'A_112', label: 'Περίπτερα', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:4},
  {code: 'A_113', label: 'Φροντιστήρια / Ωδεία', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:4},
  {code: 'A_114', label: 'Πολυώροφα Πολυκαταστήματα', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:6},
  {code: 'A_115', label: 'Πολυώροφα κτήρια γραφείων', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:6},
  {code: 'A_116', label: 'Εγκαταλελειμμένα κτήρια', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:6},
  {code: 'A_119', label: 'Υπέργειοι/Υπόγειοι Σταθμοί αυτοκινήτων', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:3},
  {code: 'A_1112', label: 'Εκπαίδευση', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:4},
  {code: 'A_1113', label: 'Υγεία', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:3},
  {code: 'A_1114', label: 'Βενζινάδικα', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:3},
  {code: 'A_118', label: 'Εστίαση με τραπεζοκαθίσματα στο δημόσιο χώρο',layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:16},
  {code: 'A_213', label: 'Παρτέρια (%)', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:100},
  {code: 'A_271', label: 'Πεζοδρόμιο',layer: StatLayers.audit_lines, type: StatTypes.class, classes:[
    {value:1, label:'Δεν υπάρχει πεζοδρόμιο'},
    {value:2, label:'Υπάρχει και έχει Σταθερό πλάτος'},
    {value:3, label:'Υπάρχει και έχει μεταβαλλόμενο πλάτος'}
  ]},{
    code: 'A_272', label: 'Πλάτος πεζοδρομίου', layer: StatLayers.audit_lines, type: StatTypes.class, classes:[
      {value: 1, label: 'Έως περίπου 1 μ. – στενό (χωράει μέχρι 1 άτομο)'},
      {value: 2, label: 'Από 1 μ. έως περίπου 2 μ. – μέτριο (χωράει μέχρι 2 άτομα)'},
      {value: 3, label: '> 2 μ. – φαρδύ (υποστηρίζει περισσότερα από 3 άτομα'},
      {value: 4, label: 'Δεν υπάρχει πεζοδρόμιο'},
  ]},{
    code: 'A_273', label: 'Κατάσταση πεζοδρομίου', layer: StatLayers.audit_lines, type: StatTypes.class, classes:[
      {value:1, label:'Κακή'},
      {value:2, label:'Μέτρια'},
      {value:3, label:'Καλή'},
      {value:4, label:'Εκτελούνται έργα'},
      {value:5, label:'Δεν υπάρχει πεζοδρόμιο'},
  ]},{
    code: 'A_29', label: 'Όδευση τυφλών', layer: StatLayers.audit_lines, type: StatTypes.class, classes:[
      {value:1, label:'Όχι'},
      {value:2, label:'Σε όλο το μήκος'},
      {value:3, label:'Σε τμήμα της πλευράς'}
  ]},{
    code: 'A_14', label: 'Κατάσταση κτηρίων',layer: StatLayers.audit_lines, type: StatTypes.class, classes:[
      {value:1, label:'Δεν υπάρχουν κτήρια'},
      {value:2, label:'Κακή'},
      {value:3, label:'Μέτρια'},
      {value:4, label:'Καλή'}
  ]},{
    code: 'A_17', label: 'Κυριαρχία κατοικίας',layer: StatLayers.audit_lines, type: StatTypes.class, classes:[
      {value:1, label:'Όχι'},
      {value:2, label:'Ναι (>50% των εισόδων των κτηρίων της πλευράς του ΟΤ)'}
    ]},{
    code: 'A_219', label: 'Κυριαρχία εμπορικών χρήσεων', layer: StatLayers.audit_lines, type: StatTypes.class, classes:[
      {value:1, label:'Όχι'},
      {value:2, label:'Ναι'}
    ]
  },{
  // bus stops 
    code: 'E1', label: 'Υπάρχει Στέγαστρο', layer: StatLayers.bus_stops, type: StatTypes.class, classes:[
      {value:1, label:'Όχι'},
      {value:2, label:'Ναι, κακή κατάσταση'},
      {value:3, label:'Ναι, καλή κατάσταση'},
      {value:4, label:'Στοά χωρίς στέγαστρο'}
    ]
  },{
    code: 'E2', label: 'Υπάρχει Κάθισμα', layer: StatLayers.bus_stops, type: StatTypes.class, classes:[
      {value:1, label:'Όχι'},
      {value:2, label:'Ναι, κακή κατάσταση (π.χ. είναι σπασμένο, έχει πρόχειρα γκράφιτι, είναι σκουριασμένο)'},
      {value:3, label:'Ναι, καλή κατάσταση'},

    ]
  },{
    code: 'E3', label: 'Ορατότητα', layer: StatLayers.bus_stops, type: StatTypes.class, classes:[
      {value:1, label:'Κακή'},
      {value:2, label:'Καλή'},

     ]
  },{
    code: 'E4', label: 'Εξοχή πεζοδρομίου', layer: StatLayers.bus_stops, type: StatTypes.class, classes:[
      {value:1, label:'Οχι'},
      {value:2, label:'Ναι'},

     ]
  },{
    code: 'E5', label: 'Τηλεματική', layer: StatLayers.bus_stops, type: StatTypes.class, classes:[
      {value:1, label:'Οχι'},
      {value:2, label:'Ναι'},

     ]
  },{
    code: 'E6', label: 'Καθαριότητα', layer: StatLayers.bus_stops, type: StatTypes.class, classes:[
      {value:1, label:'Κακή'},
      {value:2, label:'Μέτρια'},
      {value:3, label:'Καλή'},

     ]
  },
  {code: 'G_24', label: 'Μέσο πλάτος δρόμου (σε μ.) ',layer: StatLayers.street_lines, type: StatTypes.number, min:0, max:36},
  {code: 'G_26', label: 'Μονόδορομος ',layer: StatLayers.street_lines, type: StatTypes.number, min:0, max:4},
  {
    code: 'G_27', label: 'Νησίδα', layer: StatLayers.street_lines, type: StatTypes.class, classes:[
      {value:1, label:'Είναι πεζόδρομος/σκάλες'},
      {value:2, label:'Όχι'},
      {value:3, label:'Ναι, χωρίς πράσινο βατή'},
      {value:5, label:'Ναι, με πράσινο βατή'},
      {value:6, label:'Ναι, με πράσινο μη βατή'},

     ]
  },
  {
    code: 'G_28', label: 'Χαρακτήρας δρόμου', layer: StatLayers.street_lines, type: StatTypes.class, classes:[
      {value:1, label:'Πεζόδρομος με σήμανση ΚΟΚ'},
      {value:2, label:'Σκάλες, χωρίς χειρολισθήρες'},
      {value:3, label:'Σκάλες, με χειρολισθήρες'},
      {value:4, label:'Διαμόρφωση δρόμου ήπιας κυκλοφορίας'},
      {value:7, label:'Χωματόδρομος'},
      {value:8, label:'Δρόμος με 1 λωρίδα κυκλοφορίας & στάθμευση δεξιά/αριστερά'},
      {value:9, label:'Δρόμος με 1 λωρίδα κυκλοφορίας & στάθμευση στη μια πλευρά μόνο'},
      {value:10, label:'Δρόμος με 1 λωρίδα κυκλοφορίας ΧΩΡΙΣ στάθμευση'},
      {value:11, label:'Δρόμος με 2 λωρίδες κυκλοφορίας & στάθμευση δεξιά/αριστερά'},
      {value:12, label:'Δρόμος με 2 λωρίδες κυκλοφορίας & στάθμευση στη μια πλευρά μόνο'},
      {value:13, label:'Δρόμος με 2 λωρίδες κυκλοφορίας ΧΩΡΙΣ στάθμευση'},
      {value:14, label:'Δρόμος με >3 λωρίδες κυκλοφορίας & στάθμευση δεξιά/αριστερά'},
      {value:15, label:'Δρόμος με >3 λωρίδες κυκλοφορίας & στάθμευση στη μια πλευρά μόνο'},
      {value:16, label:'Δρόμος με >3 λωρίδες κυκλοφορίας ΧΩΡΙΣ στάθμευση'},

     ]
  },
  
]

