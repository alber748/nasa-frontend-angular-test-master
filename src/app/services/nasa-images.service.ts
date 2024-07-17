import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NasaApiResponse } from '../models/nasa-api-response';

@Injectable({
  providedIn: 'root'
})
export class NasaImagesService {

  private assetsUrl = 'https://images-assets.nasa.gov';
  private apiUrl = 'https://images-api.nasa.gov';

  constructor(private http: HttpClient) { }

  getRecent(): Observable<NasaApiResponse> {
    return this.http.get<NasaApiResponse>(`${this.assetsUrl}/recent.json`);
  }

  getPopular(): Observable<NasaApiResponse> {
    return this.http.get<NasaApiResponse>(`${this.assetsUrl}/popular.json`);
  }

  search(query: string, mediaTypes: string[] = []): Observable<NasaApiResponse> {
    let url = `${this.apiUrl}/search?q=${query}`;
    if (mediaTypes.length > 0) {
      url += `&media_type=${mediaTypes.join(',')}`;
    }
    return this.http.get<NasaApiResponse>(url);
  }

  getNasaDetail(id: string, type: string): Observable<any> {
    return this.http.get<any>(`${this.assetsUrl}/${type}/${id}/metadata.json`);
  }

  getNasaAudioDetail(id: string, type: string): Observable<any> {
    return this.http.get<any>(`${this.assetsUrl}/${type}/${id}/collection.json`);
  }
}
