import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyTourService {

  private tourStep = new Subject<number>();
  tourStep$ = this.tourStep.asObservable();

  announceTourStep(tourStep: number) {
    this.tourStep.next(tourStep);
  }

  private startGuide = new Subject<boolean>();
  startGuide$ = this.startGuide.asObservable();

  announceStartGuide(startGuide: boolean) {
    this.startGuide.next(startGuide);
  }

  private closeGuide = new Subject<boolean>();
  closeGuide$ = this.closeGuide.asObservable();

  announceCloseGuide(closeGuide: boolean) {
    this.closeGuide.next(closeGuide);
  }
  

  constructor() { }


  homeGuide: any[] = [
    {
      anchorId: '1',
      content: 'Χρησιμοποιήστε το εργαλείο για να δείτε έναν σύντομο διαδραστικό οδηγό για τη χρήση της κάθε θεματικής της εφαρμογής.',
      title: 'Βοήθεια',
      enableBackdrop: true
    },
    {
      anchorId: '2',
      content: 'Χρησιμοποιήστε το μενού για να περιηγηθείτε στις διάφορες θεματικές της εφαρμογής.',
      title: 'Μενού',
      enableBackdrop: true
    },
    {
      anchorId: '3',
      content: 'Αλλάξτε τη γλώσσα της εφαρμογής.',
      title: 'Γλώσσα',
      enableBackdrop: true
    },
    {
      anchorId: '4',
      content: 'Αλλάξτε την αντίθεση του φόντου σε ανοιχτό/σκοτεινό.',
      title: 'Εναλλαγή φόντου',
      enableBackdrop: true
    },
  ];

  responsesGuide: any[] = [
    {
      anchorId: '5',
      content: 'Επιλέξτε ανάμεσα στα ερωτηματολόγια των κατοίκων ή των μαθητών.',
      title: 'Επιλογή ερωτηματολογίων',
      enableBackdrop: true
    },
    {
      anchorId: '6',
      content: 'Επιλέξτε μια ερώτηση του ερωτηματολογίου για να δείτε τα αποτελέσματα.',
      title: 'Μεταβλητή',
      enableBackdrop: true
    },
    {
      anchorId: '7',
      content: 'Επιλέξτε μια ερώτηση του ερωτηματολογίου για να φιλτράρετε τα αποτελέσματα βάσει των απαντήσεων στη συγκεκριμένη ερώτηση.',
      title: 'Φίλτρο',
      enableBackdrop: true
    },
    {
      anchorId: '8',
      content: 'Αλλάξτε το είδος του γραφήματος των αποτελεσμάτων.',
      title: 'Είδος γραφήματος',
      enableBackdrop: true
    },
    {
      anchorId: '9',
      content: 'Επαναφέρετε τις επιλογές στην αρχική τους κατάσταση.',
      title: 'Καθαρισμός',
      enableBackdrop: true
    },
    {
      anchorId: '10',
      content: 'Κατεβάστε τα δεδομένα των ερωτηματολογίων σε μορφή CSV.',
      title: 'Κατέβασμα',
      enableBackdrop: true
    },
    {
      anchorId: '11',
      content: 'Γράφημα των αποτελεσμάτων.',
      title: 'Γράφημα',
      enableBackdrop: true
    },
    {
      anchorId: '12',
      content: 'Πίνακας των αποτελεσμάτων.',
      title: 'Πίνακας',
      enableBackdrop: true
    },
  ];

  neighborhoodsGuide: any[] = [
    {
      anchorId: '13',
      content: 'Επιλέξτε Δημοτική Κοινότητα για να περιορίσετε τα αποτελέσματα.',
      title: 'Επιλογή ΔΚ',
      enableBackdrop: true
    },
    {
      anchorId: '14',
      content: 'Επιλέξτε αρχικά μία από τις γενικές κατηγορίες δείκτες και στη συνέχεια τον δείκτη για προβολή.',
      title: 'Επιλογή δείκτη',
      enableBackdrop: true
    },
    {
      anchorId: '15',
      content: 'Αντιστρέψτε την κατάταξη των γειτονιών.',
      title: 'Αντίστροφη σειρά',
      enableBackdrop: true
    },
    {
      anchorId: '16',
      content: 'Εμφάνιση/ απόκρυψη των ονομάτων των γειτονιών στον χάρτη.',
      title: 'Labels',
      enableBackdrop: true
    },
    {
      anchorId: '17',
      content: 'Επαναφέρετε τις επιλογές στην αρχική τους κατάσταση.',
      title: 'Καθαρισμός',
      enableBackdrop: true
    },
    {
      anchorId: '18',
      content: 'Κατεβάστε τα δεδομένα των ερωτηματολογίων σε μορφή CSV.',
      title: 'Κατέβασμα',
      enableBackdrop: true
    },
    {
      anchorId: '19',
      content: 'Λίστα με την κατάταξη των γειτονιών βάσει του επιλεγμένου δείκτη.',
      title: 'Λίστα',
      enableBackdrop: true
    },
    {
      anchorId: '20',
      content: 'Χάρτης των γειτονιών με χρωματική διαβάθμιση βάσει του επιλεγμένου δείκτη.',
      title: 'Χάρτης',
      enableBackdrop: true
    },
    {
      anchorId: '21',
      content: 'Μεταβολή της διαφάνειας του χαρτογραφικού επιπέδου των γειτονιών.',
      title: 'Διαφάνεια επιπέδου',
      enableBackdrop: true
    },
    {
      anchorId: '22',
      content: 'Στοιχεία ελέγχου περιήγησης στον χάρτη.',
      title: 'Περιήγηση στον χάρτη',
      enableBackdrop: true
    },
  ];

  indicesGuide: any[] = [
    {
      anchorId: '23',
      content: 'Επιλέξτε έναν δείκτη για προβολή στον χάρτη.',
      title: 'Επιλογή σύνθετου δείκτη',
      enableBackdrop: true
    },
    {
      anchorId: '24',
      content: 'Κατεβάστε τα δεδομένα των ερωτηματολογίων σε μορφή GEOJSON.',
      title: 'Κατέβασμα',
      enableBackdrop: true
    },
    {
      anchorId: '25',
      content: 'Πληροφορίες για τον επιλεγμένο δείκτη.',
      title: 'Πληροφορίες',
      enableBackdrop: true
    },
    {
      anchorId: '26',
      content: 'Χάρτης με χρωματική διαβάθμιση βάσει του επιλεγμένου σύνθετου δείκτη. Κάντε κλίκ πάνω στο χαρτογραφικό επίπεδο για να δείτε αναλυτικά στοιχεία των σύνθετων δεικτών για τη συγκεκριμένη τοποθεσία.',
      title: 'Χάρτης',
      enableBackdrop: true
    },
    {
      anchorId: '27',
      content: 'Μεταβολή της διαφάνειας του χαρτογραφικού επιπέδου του σύνθετου δείκτη.',
      title: 'Διαφάνεια επιπέδου',
      enableBackdrop: true
    },
    {
      anchorId: '28',
      content: 'Στοιχεία ελέγχου περιήγησης στον χάρτη.',
      title: 'Περιήγηση στον χάρτη',
      enableBackdrop: true
    },
    {
      anchorId: '29',
      content: 'Υπόμνημα για τον επιλεγμένο σύνθετο δείκτη.',
      title: 'Υπόμνημα',
      enableBackdrop: true
    },
  ];

  mapGuide: any[] = [
    {
      anchorId: '30',
      content: 'Χρησιμοποιήστε το ποντίκι σας για να περιηγηθείτε στον χάρτη των γεωχωρικών δεδομένων. Κάντε κλίκ σε στοιχεία του χάρτη για περισσότερες πληροφορίες.',
      title: 'Χάρτης',
      enableBackdrop: true
    },
    {
      anchorId: '31',
      content: 'Χρησιμοποιήστε το εργαλείο για να μεγενθύνετε ή να μικρύνετε τον χάρτη. Η λειτουργία μπορεί να γίνει και με την ροδέλα του ποντικιού.',
      title: 'Μεγένθυση/ σμίκρυνση',
      enableBackdrop: true
    },
    {
      anchorId: '32',
      content: 'Δημιουργήστε έναν σύνδεσμο του χάρτη για κοινοποίηση.',
      title: 'Κοινοποίηση',
      enableBackdrop: true
    },
    {
      anchorId: '33',
      content: 'Χρησιμοποιήστε αυτό το στοιχείο ελέγχου για να μεταβείτε στις διάφορες θεματικές δεδομένων.',
      title: 'Θεματική δεδομένων',
      enableBackdrop: true
    },
    {
      anchorId: '34',
      content: 'Αλλάξτε το χαρτογραφικό υπόβαθρο.',
      title: 'Υπόβαθρο',
      enableBackdrop: true
    },
    {
      anchorId: '35',
      content: 'Χρησιμοποιήστε αυτό το στοιχείο ελέγχου στις θεματικές που είναι διαθέσιμο για να μεταβείτε σε περισσότερα εργαλεία και επιλογές για τα δεδομένα.',
      title: 'Φίλτρα και άλλα εργαλεία των δεδομένων',
      enableBackdrop: true
    },
  ];

}
