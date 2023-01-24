import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import packageJson from '../../../../package.json'
import { catchError, of, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TranslateService {
  data: any = {};
  lang: string = 'en';

  private language = new Subject<string>();
  lang$ = this.language.asObservable();

  constructor(private http: HttpClient) { }

  use(lang: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const langPath = `assets/i18n/${lang || "en"}.json?${packageJson.version}`;
      this.http.get<any>(langPath).pipe(
        catchError( err => {
          this.data = {}
          resolve(this.data)
          return of(`Error while setting language: ${err}`)
        })
      ).subscribe( translation => {
          this.data = Object.assign({}, translation || {});
          resolve(this.data);
          this.setLang(lang);
        }
      )
    });
  }

  setLang(lang: string) {
    this.lang = lang;
    this.language.next(lang);
  }

  getLang() {
    return this.lang;
  }

}
