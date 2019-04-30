import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemCreationService {

  constructor(private _http: HttpClient, private environmentService: EnvironmentService) { }

  getItemDetails(offerId, offerType): Observable<any> {
    const url = `${this.environmentService.REST_API_GET_ITEM_DETAILS}/${offerId}/${offerType}`;
    return this._http.get(url, { withCredentials: true });
  }

  getOfferDropdownValues(offerId): Observable<any>{
    const url = `${this.environmentService.REST_API_GET_OFFER_DROPDOWN}/${offerId}`;
    return this._http.get(url, { withCredentials: true });
  }
}
