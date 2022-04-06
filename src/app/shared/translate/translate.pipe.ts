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

/**
 * to manipulate dynamic values within the string 
 * pass an object like so:
 * {x:'hello', y:3}
 * use the patter 'I say {{x}} and I count to {{y}}' within the string 
 * to replace with object values 
 * 
 * To use it on template:
 *  <mat-label>  {{'MAP.TILE-SELECTOR' | translate: {x:3} }}</mat-label>
 * 
 * @param value 
 * @param args 
 * @returns 
 */
  public transform(value: string, args?: any): string {

    if (value.includes(".")) {
      let keys = value.split(".");
      let translateStr = this.translate.data[keys[0]][keys[1]];
      translateStr = this.replaceArgs(translateStr,args);
      return translateStr;
    } else {
      let translateStr = this.translate.data[value] || value;
      return this.replaceArgs(translateStr,args);
    }
  }

  private replaceArgs(value: string, args?:any): string {
    let translateStr = value;
    if (args){
      let match;
      while(match = this.templateMatcher.exec(translateStr)){
        translateStr = translateStr.replace(match[0],args[match[1]])
      }
    }
    return translateStr;
  }
}
