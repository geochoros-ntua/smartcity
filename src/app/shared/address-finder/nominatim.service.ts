import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface INominatimResponse {
  lat?: string;
  lon?: string;
  displayName: string;
}
export const BASE_NOMINATIM_URL: string = 'nominatim.openstreetmap.org';
export const DEFAULT_VIEW_BOX: string =
  'viewbox=23.656654,37.919014,23.848228,38.046469';

@Injectable({
  providedIn: 'root',
})
export class NominatimService {
  constructor(private http: HttpClient) {}

  addressLookup(req?: string): Observable<INominatimResponse[]> {
    let url = `https://${BASE_NOMINATIM_URL}/search?format=json&q=${req}&countrycodes=gr&bounded=1&${DEFAULT_VIEW_BOX}`;
    return this.http.get(url).pipe(
      map((data: any) =>
        data.map((item: any) => {
          return {
            lat: item.lat,
            lon: item.lon,
            displayName: item.display_name,
          };
        })
      )
    );
  }

  reverse(lat: number, lon: number): Observable<INominatimResponse> {
    let url = `https://${BASE_NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lon}`;
    return this.http.get(url).pipe(
      map((data: any) => {
        return {
          displayName: data.display_name,
        };
      })
    );
  }
}
