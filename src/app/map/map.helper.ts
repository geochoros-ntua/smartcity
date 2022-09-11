import { MapMode } from "./api/map.enums";

export default class MapUtils {

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
}