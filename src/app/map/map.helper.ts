import { MapMode } from "./api/map.enums";

export default class MapUtils {

    public static backEndBaseUrl = 'https://walkable.cityofathens.gr/php/';
    

    /**
     * pass the enum and the value 
     * get back the mached enum
     * @param myEnum 
     * @param enumValue 
     * @returns MapMode
     */
    public static getEnumByEnumValue(myEnum: any, enumValue: string): MapMode {
        let keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
        return keys.length > 0 ? myEnum[keys[0]] : '';
    }

    public static formatDate(date: Date): string{
        return date.getFullYear() + '-' + ((date.getMonth() + 1)) + '-' + date.getDate()
    }

    public static formatDateTime(date: Date, locale: string): string{
        const month = date.getMonth()+1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().length>1 ?  date.getMinutes() : "0" + date.getMinutes();
        const seconds = date.getSeconds().toString().length>1 ?  date.getSeconds() : "0" + date.getSeconds();
        const dayName = this.getDayName(date , locale);
        return dayName + ' ' + day + '/' + month + ' - ' + hours + ':' + minutes + ':' + seconds
    }

    public static getDayName(dateStr:any, locale:any): string {
        var date = new Date(dateStr);
        return date.toLocaleDateString(locale, { weekday: 'long' });        
    }

    public static exportToCsv(filename: string, rows: object[]) {
        const nav = (window.navigator as any);
        if (!rows || !rows.length) {
          return;
        }
        const separator = ',';
        const keys = Object.keys(rows[0]);
        const csvContent =
          keys.join(separator) +
          '\n' +
          rows.map((row: any) => {
            return keys.map(k => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell = cell instanceof Date
                ? cell.toLocaleString()
                : cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            }).join(separator);
          }).join('\n');

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });

        if (nav.msSaveBlob) { // IE 10+
            nav.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement('a');
          if (link.download !== undefined) {
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      }
}