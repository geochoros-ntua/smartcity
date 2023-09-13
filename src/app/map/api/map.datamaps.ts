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

export const DHM_GEITONIES: string[] = [
  "Α  ΝΕΚΡΟΤΑΦΕΙΟ","ΑΒΕΡΩΦ Ι","ΑΒΕΡΩΦ ΙΙ","ΑΓΙΑ ΑΙΚΑΤΕΡΙΝΗ","ΑΓΙΑ ΒΑΡΒΑΡΑ","ΑΓΙΑ ΠΑΡΑΣΚΕΥΗ","ΑΓΙΑ ΤΡΙΑΔΑ","ΑΓΙΑΣ ΖΩΝΗ","ΑΓΙΟΣ ΑΘΑΝΑΣΙΟΣ",
  "ΑΓΙΟΣ ΑΝΤΩΝΗΣ","ΑΓΙΟΣ ΑΡΤΕΜΙΟΣ","ΑΓΙΟΣ ΓΕΩΡΓΙΟΣ","ΑΓΙΟΣ ΓΕΩΡΓΙΟΣ ΚΥΨΕΛΗΣ","ΑΓΙΟΣ ΕΛΕΥΘΕΡΙΟΣ Ι","ΑΓΙΟΣ ΕΛΕΥΘΕΡΙΟΣ ΙΙ","ΑΓΙΟΣ ΘΩΜΑΣ","ΑΓΙΟΣ ΙΩΑΝΝΗΣ",
  "ΑΓΙΟΣ ΚΩΝΣΤΑΝΤΙΝΟΣ","ΑΓΙΟΣ ΛΟΥΚΑΣ","ΑΓΙΟΣ ΝΙΚΟΛΑΟΣ","ΑΓΙΟΣ ΠΑΝΤΕΛΕΗΜΩΝ","ΑΓΙΟΣ ΠΑΥΛΟΣ","ΑΓΙΟΣ ΣΩΣΤΗΣ","ΑΓΙΟΥ ΜΕΛΕΤΙΟΥ I","ΑΓΙΟΥ ΜΕΛΕΤΙΟΥ II",
  "ΑΚΑΔΗΜΙΑ ΠΛΑΤΩΝΟΣ Ι","ΑΚΑΔΗΜΙΑ ΠΛΑΤΩΝΟΣ ΙΙ","ΑΛΕΠΟΤΡΥΠΑ","ΑΛΕΠΟΤΡΥΠΑ ΠΑΤΗΣΙΑ","ΑΛΣΟΣ ΓΟΥΔΗ  ΦΥΤΩΡΙΟ ΔΗΜΟΥ ΑΘΗΝΑΙΩΝ","ΑΛΥΣΙΔΑ","ΑΜΕΡΙΚΗΣ",
  "ΑΜΠΕΛΟΚΗΠΟΙ Ι","ΑΜΠΕΛΟΚΗΠΟΙ ΙΙ","ΑΝΩ ΑΜΠΕΛΟΚΗΠΟΙ","ΑΝΩ ΠΑΤΗΣΙΑ","ΑΡΙΣΤΟΤΕΛΟΥΣ","ΑΡΧΑΙΟΛΟΓΙΚΟΣ ΧΩΡΟΣ ΑΚΡΟΠΟΛΗΣ ΦΙΛΟΠΑΠΠΟΥ","ΑΤΤΙΚΟ ΑΛΣΟΣ",
  "ΒΑΡΝΑΒΑ","ΒΕΪΚΟΥ","ΒΡΑΤΡΑΧΟΝΗΣΙ","ΓΗΡΟΚΟΜΕΙΟ","ΓΚΑΖΟΧΩΡΙ I","ΓΚΑΖΟΧΩΡΙ II","ΓΚΡΑΒΑ","ΓΚΥΖΗ","ΓΟΥΒΑ Ι","ΓΟΥΒΑ ΙΙ","ΔΟΥΡΓΟΥΤΙ Ι","ΔΟΥΡΓΟΥΤΙ ΙΙ",
  "ΕΛΑΙΩΝΑΣ","ΕΛΛΗΝΟΡΩΣΣΩΝ Ι","ΕΛΛΗΝΟΡΩΣΩΝ ΙΙ","ΕΜΠΟΡΙΚΟ ΚΕΝΤΡΟ","ΕΞΑΡΧΕΙΑ","ΕΡΥΘΡΟΣ Ι","ΕΡΥΘΡΟΣ ΙΙ","ΖΑΠΠΕΙΟ ΣΤΑΔΙΟ","ΘΗΣΕΙΟ","ΘΥΜΑΡΑΚΙΑ",
  "ΙΛΙΣΙΑ ΠΑΡΚΟ","ΙΟΥΛΙΑΝΟΥ ΦΙΛΑΔΕΛΦΕΙΑΣ","ΙΠΠΟΚΡΑΤΕΙΟ","ΚΑΛΛΙΡΡΟΗΣ","ΚΑΜΠΑ I","ΚΑΜΠΑ II","ΚΑΤΩ ΕΡΥΘΡΟΣ","ΚΑΤΩ ΠΑΤΗΣΙΑ I","ΚΑΤΩ ΠΑΤΗΣΙΑ II",
  "ΚΕΡΑΜΕΙΚΟΣ","ΚΛΩΝΑΡΙΔΟΥ","ΚΟΙΛΗΣ","ΚΟΛΙΑΤΣΟΥ I","ΚΟΛΙΑΤΣΟΥ II","ΚΟΛΟΚΥΝΘΟΥ","ΚΟΛΩΝΑΚΙ","ΚΟΛΩΝΑΚΙ ΛΥΚΑΒΗΤΤΟΣ","ΚΟΛΩΝΟΣ","ΚΟΥΚΑΚΙ","ΚΟΥΚΛΑΚΙ",
  "ΚΟΥΝΤΟΥΡΙΩΤΙΚΑ","ΚΥΠΡΙΑΔΟΥ","ΚΥΠΡΙΩΝ","ΛΑΜΠΡΙΝΗ","ΛΟΦΟΣ ΕΛΙΚΩΝΟΣ","ΛΟΦΟΣ ΚΥΝΟΣΑΡΓΟΥΣ","ΛΟΦΟΣ ΛΑΜΠΡΑΚΗ","ΛΟΦΟΣ ΣΚΟΥΖΕ","ΛΟΦΟΣ ΣΤΡΕΦΗ","ΛΥΚΑΒΗΤΤΟΣ",
  "ΜΑΚΡΥΓΙΑΝΝΗ","ΜΕΤΑΞΟΥΡΓΕΙΟ","ΜΕΤΣ","ΜΟΝΑΣΤΗΡΑΚΙ ΠΛΑΚΑ","ΜΟΥΣΕΙΟ","ΜΠΑΚΝΑΝΑ","ΝΕΑ ΚΥΨΕΛΗ Ι","ΝΕΑ ΚΥΨΕΛΗ ΙΙ","ΝΕΑ ΦΙΛΟΘΕΗ","ΝΕΑΠΟΛΗ I","ΝΕΑΠΟΛΗ II",
  "ΝΕΟΣ ΚΟΣΜΟΣ","ΝΟΣΟΚ.ΠΑΙΔΩΝ","ΟΣΕ","ΠΑΓΚΡΑΤΙ Ι","ΠΑΓΚΡΑΤΙ ΙΙ","ΠΕΔΙΟ ΑΡΕΩΣ Ι","ΠΕΔΙΟ ΑΡΕΩΣ ΙΙ","ΠΕΔΙΟ ΑΡΕΩΣ ΣΧΟΛΗ ΕΥΕΛΠΙΔΩΝ","ΠΙΝΑΚΟΘΗΚΗ","ΠΛΑΣΤΗΡΑ",
  "ΠΛΑΤΕΙΑ ΑΤΤΙΚΗΣ Ι","ΠΛΑΤΕΙΑ ΑΤΤΙΚΗΣ ΙΙ","ΠΛΑΤΕΙΑ ΒΑΘΗΣ","ΠΛΑΤΕΙΑ ΒΙΚΤΩΡΙΑΣ","ΠΛΑΤΕΙΑ ΚΑΝΑΡΗ","ΠΛΑΤΕΙΑ ΠΑΠΑΔΙΑΜΑΝΤΗ","ΠΛΑΤΕΙΑ ΧΑΛΕΠΑ","ΠΟΛΥΓΩΝΟ Ι",
  "ΠΟΛΥΓΩΝΟ ΙΙ","ΠΟΛΥΓΩΝΟ ΙΙΙ","ΠΡΟΜΠΟΝΑ Ι","ΠΡΟΜΠΟΝΑ ΙΙ","ΠΡΟΦΗΤΗΣ ΔΑΝΙΗΛ","ΠΡΟΦΗΤΗΣ ΗΛΙΑΣ","ΠΡΟΦΗΤΗΣ ΗΛΙΑΣ ΡΙΖΟΥΠΟΛΗΣ","ΡΗΓΙΛΛΗΣ","ΡΙΖΟΥΠΟΛΗ",
  "ΣΕΠΟΛΙΑ","ΣΤΕΡΝΑ","ΣΥΝΤΑΓΜΑ","ΣΧΟΛΗ ΕΥΕΛΠΙΔΩΝ","ΤΟΥΡΚΟΒΟΥΝΙΑ","ΤΟΥΡΚΟΒΟΥΝΙΑ ΙΙ","ΤΡΕΙΣ ΓΕΦΥΡΕΣ","ΤΡΙΩΝ ΙΕΡΑΡΧΩΝ","ΦΙΛΟΠΑΠΠΟΥ","ΦΛΕΜΙΝΚ",
  "ΦΩΚΙΩΝΟΣ ΝΕΓΡΗ","ΧΑΜΟΣΤΕΡΝΑ","ΨΥΡΡΗ ΚΟΥΜΟΥΝΔΟΥΡΟΥ","ΩΔΕΙΟ"];

  export const STATS_INDECES: StatsIndices[] = [
    // audit lines 
    {code: 'A_111', label: 'Σούπερ μάρκετ / Μίνι μάρκετ', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:6, desc: 'Αριθμός ανά πλευρά ΟΤ'},
    {code: 'A_112', label: 'Περίπτερα', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:4, desc: 'Αριθμός ανά πλευρά ΟΤ'},
    {code: 'A_113', label: 'Φροντιστήρια / Ωδεία', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:4, desc: 'Αριθμός ανά πλευρά ΟΤ'},
    {code: 'A_114', label: 'Πολυώροφα Πολυκαταστήματα', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:6, desc: 'Αριθμός ανά πλευρά ΟΤ'},
    {code: 'A_115', label: 'Πολυώροφα κτήρια γραφείων', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:6, desc: 'Αριθμός ανά πλευρά ΟΤ'},
    {code: 'A_116', label: 'Εγκαταλελειμμένα κτήρια', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:6, desc: 'Αριθμός ανά πλευρά ΟΤ'},
    {code: 'A_119', label: 'Υπέργειοι/Υπόγειοι Σταθμοί αυτοκινήτων', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:3, desc: 'Αριθμός ανά πλευρά ΟΤ'},
    {code: 'A_1112', label: 'Εκπαίδευση', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:4, desc: 'Αριθμός ανά πλευρά ΟΤ'},
    {code: 'A_1113', label: 'Υγεία', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:3, desc: 'Αριθμός ανά πλευρά ΟΤ'},
    {code: 'A_1114', label: 'Βενζινάδικα', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:3, desc: 'Αριθμός ανά πλευρά ΟΤ'},
    {code: 'A_118', label: 'Εστίαση με τραπεζοκαθίσματα στο δημόσιο χώρο',layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:16, desc: 'Αριθμός καταστημάτων ανά πλευρά ΟΤ'},
    {code: 'A_213', label: 'Παρτέρια (%)', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:100, desc: '% μήκους πλευράς ΟΤ με παρτέρια'},
    {code: 'A_271', label: 'Πεζοδρόμιο',layer: StatLayers.audit_lines, type: StatTypes.class, desc: 'Αξιολόγηση ύπαρξης πεζοδρομίου και μεταβλητότητας του πλάτους του ανά πλευρά ΟΤ', classes:[
      {value:1, label:'Δεν υπάρχει πεζοδρόμιο'},
      {value:2, label:'Υπάρχει και έχει Σταθερό πλάτος'},
      {value:3, label:'Υπάρχει και έχει μεταβαλλόμενο πλάτος'}
    ]},{
      code: 'A_272', label: 'Πλάτος πεζοδρομίου', layer: StatLayers.audit_lines, type: StatTypes.class, desc: 'Αξιολόγηση μέσου πλάτους πεζοδρομίου ανά πλευρά ΟΤ με βάση την ικανότητα να περπατήσουν ταυτόχρονα σε αυτό περισσότερα από 1 άτομα', classes:[
        {value: 1, label: 'Έως περίπου 1 μ. – στενό (χωράει μέχρι 1 άτομο)'},
        {value: 2, label: 'Από 1 μ. έως περίπου 2 μ. – μέτριο (χωράει μέχρι 2 άτομα)'},
        {value: 3, label: '> 2 μ. – φαρδύ (υποστηρίζει περισσότερα από 3 άτομα'},
        {value: 4, label: 'Δεν υπάρχει πεζοδρόμιο'},
    ]},{
      code: 'A_273', label: 'Κατάσταση πεζοδρομίου', layer: StatLayers.audit_lines, type: StatTypes.class, desc: 'Αξιολόγηση μέσης κατάστασης πεζοδρομίου ανά πλευρά ΟΤ με βάση την ύπαρξη σοβαρών κακοτεχνιών και φθορών που αποτελούν κίνδυνο για τους πεζούς', classes:[
        {value:1, label:'Κακή'},
        {value:2, label:'Μέτρια'},
        {value:3, label:'Καλή'},
        {value:4, label:'Εκτελούνται έργα'},
        {value:5, label:'Δεν υπάρχει πεζοδρόμιο'},
    ]},{
      code: 'A_29', label: 'Όδευση τυφλών', layer: StatLayers.audit_lines, type: StatTypes.class,desc: 'Αξιολόγηση ύπαρξης ειδικών πλακιδίων υποστήριξης των ατόμων με μειωμένη όραση ανά πλευρά πεζοδρομίου ΟΤ', classes:[
        {value:1, label:'Όχι'},
        {value:2, label:'Σε όλο το μήκος'},
        {value:3, label:'Σε τμήμα της πλευράς'}
    ]},{
      code: 'A_14', label: 'Κατάσταση κτηρίων',layer: StatLayers.audit_lines, type: StatTypes.class,desc: 'Αξιολόγηση μέσης κατάστασης των κτηρίων κάθε πλευράς ΟΤ ξεχωριστά, με βάση την παρατήρηξη ύπαρξης συστηματικών φθορών σε αυτά αλλά και της συνολικής καθαριότητας τους (π.χ. ύπαρξη πολλαπλών γκράφιτι/ταγκς, μούχλας κ.α.)', classes:[
        {value:1, label:'Δεν υπάρχουν κτήρια', counter:0},
        {value:2, label:'Κακή', counter:0},
        {value:3, label:'Μέτρια', counter:0},
        {value:4, label:'Καλή', counter:0}
    ]},{
      code: 'A_17', label: 'Κυριαρχία κατοικίας',layer: StatLayers.audit_lines, type: StatTypes.class,desc: 'Απαρίθμηση χρήσεων γης των ισογείων των κτηρίων ανά πλευρά ΟΤ και εκτίμηση κυριαρχίας της κατοικίας', classes:[
        {value:1, label:'Όχι'},
        {value:2, label:'Ναι (>50% των εισόδων των κτηρίων της πλευράς του ΟΤ)'}
      ]},{
      code: 'A_219', label: 'Κυριαρχία εμπορικών χρήσεων', layer: StatLayers.audit_lines, type: StatTypes.class, desc: 'Απαρίθμηση χρήσεων γης των ισογείων των κτηρίων ανά πλευρά ΟΤ και εκτίμηση κυριαρχίας του λιανικού εμπορίου ή/και καταστημάτων εξυπηρέτησης καθημερινών αναγκών', classes:[
        {value:1, label:'Όχι'},
        {value:2, label:'Ναι'}
      ]
    },{
    // bus stops 
      code: 'E1', label: 'Υπάρχει Στέγαστρο', layer: StatLayers.bus_stops, type: StatTypes.class, desc: 'Αξιολόγηση της ύπαρξης στεγάστρου επί της στάσης λεωφορείου και των φθορών του (π.χ. σπασίματα, βανδαλισμοί κ.α.)', classes:[
        {value:1, label:'Όχι'},
        {value:2, label:'Ναι, κακή κατάσταση'},
        {value:3, label:'Ναι, καλή κατάσταση'},
        {value:4, label:'Στοά χωρίς στέγαστρο'}
      ]
    },{
      code: 'E2', label: 'Υπάρχει Κάθισμα', layer: StatLayers.bus_stops, type: StatTypes.class, desc: 'Αξιολόγηση της ύπαρξης καθίσματος επί της στάσης λεωφορείου και των φθορών του (π.χ. σπασίματα, βανδαλισμοί κ.α.)', classes:[
        {value:1, label:'Όχι'},
        {value:2, label:'Ναι, κακή κατάσταση (π.χ. είναι σπασμένο, έχει πρόχειρα γκράφιτι, είναι σκουριασμένο)'},
        {value:3, label:'Ναι, καλή κατάσταση'},
  
      ]
    },{
      code: 'E3', label: 'Ορατότητα', layer: StatLayers.bus_stops, type: StatTypes.class, desc: 'Αξιολόγηση της ορατότητας των καθήμενων στη στάση των ερχόμενων λεωφορείων',  classes:[
        {value:1, label:'Κακή'},
        {value:2, label:'Καλή'},
  
       ]
    },{
      code: 'E4', label: 'Εξοχή πεζοδρομίου', layer: StatLayers.bus_stops, type: StatTypes.class, desc: 'Αξιολόγηση ύπαρξης επέκτασης πεζοδρομίου (με μόνιμο τρόπο ή με φορητή πλατφόρμα) μπροστά στη στάση', classes:[
        {value:1, label:'Οχι'},
        {value:2, label:'Ναι'},
  
       ]
    },{
      code: 'E5', label: 'Τηλεματική', layer: StatLayers.bus_stops, type: StatTypes.class, desc: 'Αξιολόγηση ύπαρξης τοποθετημένου πίνακα τηλεματικής για την πληροφόρηση των επιβατών στη στάση', classes:[
        {value:1, label:'Οχι'},
        {value:2, label:'Ναι'},
  
       ]
    },{
      code: 'E6', label: 'Καθαριότητα', layer: StatLayers.bus_stops, type: StatTypes.class, desc: 'Αξιολόγηση μέσης κατάστασης συνθηκών καθαριότητας στάσης με βάση την ύπαρξη βανδαλισμών, σκουπιδιών, ακαθαρσιών κ.α.',  classes:[
        {value:1, label:'Κακή'},
        {value:2, label:'Μέτρια'},
        {value:3, label:'Καλή'},
  
       ]
    },
    {code: 'G_24', label: 'Μέσο πλάτος δρόμου (σε μ.) ',layer: StatLayers.street_lines, type: StatTypes.number, min:0, max:36, desc: 'Μέτρηση από κράσπεδο του ενός πεζοδρομίου στο κράσπεδο του απέναντι, δεν λαμβάνεται υπόψη η κεντρική νησίδα, αν υπάρχει', },
    {code: 'G_26', label: 'Μονόδορομος ',layer: StatLayers.street_lines, type: StatTypes.number, min:0, max:4, desc: ''},
    {
      code: 'G_27', label: 'Νησίδα', desc: '', layer: StatLayers.street_lines, type: StatTypes.class, classes:[
        {value:1, label:'Είναι πεζόδρομος/σκάλες'},
        {value:2, label:'Όχι'},
        {value:3, label:'Ναι, χωρίς πράσινο βατή'},
        {value:5, label:'Ναι, με πράσινο βατή'},
        {value:6, label:'Ναι, με πράσινο μη βατή'},
  
       ]
    },
    {
      code: 'G_28', label: 'Χαρακτήρας δρόμου', layer: StatLayers.street_lines, type: StatTypes.class, desc: '', classes:[
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





