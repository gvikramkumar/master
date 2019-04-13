import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '@env/environment.service';

@Injectable({
  providedIn: 'root'
})
export class ModellingDesignService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  retrieveAtoList(offerId: string) {
    const url = this.environmentService.REST_API_RETRIEVE_ATO_LIST_URL + '?OfferID=' + offerId;
    return this.httpClient.get(url);
  }

}
