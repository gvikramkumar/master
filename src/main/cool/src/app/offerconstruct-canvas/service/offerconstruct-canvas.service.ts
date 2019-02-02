import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../../environments/environment.service';

@Injectable({
  providedIn: 'root'
})
export class OfferconstructCanvasService {

  constructor(private http: HttpClient,
    private environmentService: EnvironmentService) {}

  getMMInfo(offerId: string): Observable<any> {
    return this.http.get(this.environmentService.REST_API_MM_OFFER_BUILDER_GET_URL + offerId);
  }

  getOfferConstructItems(mmInfo: any): Observable<any> {
    return this.http.post(this.environmentService.REST_API_SET_OFFERCONSTRUCT_POST_URL,mmInfo, { withCredentials: true });
  }

  searchEgenie(keyword: String): Observable<any> {
    // return this.http.get(this.setOfferConstructURL);
    return null;
  }
}
