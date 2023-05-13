// keep some config data in here

import { StatsIndeces } from "./map.api";
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


export const STATS_INDECES: StatsIndeces[] = [
  // audit lines 
  {
    code: 'A_111', label: 'Σούπερ μάρκετ / Μίνι μάρκετ', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:5
  },{
    code: 'A_1112', label: 'Εκπαίδευση', layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:4
  },{
    code: 'A_118', label: 'Εστίαση με τραπεζοκαθίσματα στο δημόσιο χώρο',layer: StatLayers.audit_lines, type: StatTypes.number, min:0, max:16
  },{
    code: 'A_14', label: 'Κατάσταση κτηρίων',layer: StatLayers.audit_lines, type: StatTypes.class, classes:[
      {value:1, label:'Δεν υπάρχουν κτήρια'},
      {value:2, label:'Κακή'},
      {value:3, label:'Μέτρια'},
      {value:4, label:'Καλή'}
    ]
  },{
    code: 'A_17', label: 'Κυριαρχία κατοικίας',layer: StatLayers.audit_lines, type: StatTypes.class, classes:[
      {value:1, label:'Όχι'},
      {value:2, label:'Ναι (>50% των εισόδων των κτηρίων της πλευράς του ΟΤ)'}
    ]
  },{
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
    }

]

