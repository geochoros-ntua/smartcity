import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  team = [
    {
      name: "Αθανάσιος Βλαστός",
      title: "Δρ. ",
      description: "Ομότιμος Καθηγητής Ε.Μ.Π.",
      email: "vlastos@survey.ntua.gr",
      img: "assets/images/Picture1.png",
      rid: "-"
    },
    {
      name: "Αλέξανδρος Μπαρτζώκας-Τσιόμπρας",
      title: "Δρ. ",
      description: "Πολεοδόμος-Χωροτάκτης Α.Π.Θ.",
      email: "abartzok@mail.ntua.gr",
      img: "assets/images/alex.jpg",
      rid: "https://orcid.org/0000-0002-1013-8076"
    },
    {
      name: "Παναγιώτης Μανέτος",
      title: "Δρ. ",
      description: "Ε.ΔΙ.Π Π.Θ, Αγρονόμος-Τοπογράφος Μηχανικός Ε.Μ.Π.",
      email: "topoma@gmail.com",
      img: "assets/images/Picture1.png",
      rid: "https://orcid.org/0000-0001-5016-8977"
    },
    {
      name: "Γεώργιος Παναγιωτόπουλος",
      title: "Δρ. ",
      description: "GIS Developer - Γεωπόνος Γ.Π.Α,",
      email: "g.panag@metal.ntua.gr",
      img: "assets/images/coach.jpg",
      rid: "https://orcid.org/0000-0002-9100-2081"
    },
    {
      name: "Παύλος Τσάγκης",
      title: "",
      description: "Υπ. Διδάκτορας Ε.Μ.Π., GIS Developer - Δασοπόνος Π.Θ.",
      email: "tsagkis@mail.ntua.gr",
      img: "assets/images/Picture1.png",
      rid: "https://orcid.org/0000-0003-4650-6720"
    },
    {
      name: "Χρήστος Καρολεμέας",
      title: "",
      description: "Υπ. Διδάκτορας Ε.Μ.Π., Αγρονόμος-Τοπογράφος Μηχανικός Ε.Μ.Π.",
      email: "",
      img: "assets/images/Picture1.png",
      rid: "https://orcid.org/0000-0002-7193-1879"
    },
    {
      name: "Ιωάννης Παρασκευόπουλος",
      title: "",
      description: "Υπ. Διδάκτορας Ε.Μ.Π., Αγρονόμος-Τοπογράφος Μηχανικός Ε.Μ.Π.",
      email: "parask.yannis@gmail.com",
      img: "assets/images/Picture1.png",
      rid: "-"
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
