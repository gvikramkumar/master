import {environment} from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class OfferDetailViewService {

    constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) {}

    offerDetailView(offerId):any {
        return this.httpClient.get(this.environmentService.REST_API_RETRIEVE_OFFER_DETAILS_URL + offerId);
      }

    // Service call for Offer Dimensions
    offerDimensions(offerId):any {
        return this.httpClient.get(this.environmentService.REST_API_RETRIEVE_OFFER_DIMENSIONS_INFO_URL + offerId);
    }

    mmDataRetrive(offerId):any {
        return this.httpClient.get(this.environmentService.REST_API_RETRIEVE_OFFER_DETAILS_URL + offerId);
      }
}
