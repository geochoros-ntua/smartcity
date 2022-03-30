import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "./translate.service";

@Pipe({
  name: "translate",
  pure: false
})
export class TranslatePipe implements PipeTransform {
  templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;

  value: string = "";
  lastKey: string;
  lastParams: any[];

  constructor(private translate: TranslateService) {}

  transform(value: string, args?: any): any {
    if (value.includes(".")) {
      let keys = value.split(".");
      return this.translate.data[keys[0]][keys[1]];
    } else {
      return this.translate.data[value] || value;
    }
  }
}
