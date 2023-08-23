import { MapMode } from "./api/map.enums";

export default class MapUtils {

    public static backEndBaseUrl = 'php/';

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

}