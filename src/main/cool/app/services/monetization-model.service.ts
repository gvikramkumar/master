import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';
import { User } from '../models/user';
import { MMAttributes } from '@app/models/mmattributes';


@Injectable()
export class MonetizationModelService {

  constructor(
    private httpClient: HttpClient,
    private environmentService: EnvironmentService
  ) { }


  // ---------------------------------------------------------------------------------------------------------------

  retrieveOfferDetails(offerId) {
    const url = this.environmentService.REST_API_RETRIEVE_OFFER_DETAILS_URL + offerId;
    return this.httpClient.get(url, { withCredentials: true });
  }


  updateOfferDetails(data) {
    const url = this.environmentService.REST_API_UPDATE_OFFER;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true
    };

    return this.httpClient.post(url, data, httpOptions);
  }

  // ---------------------------------------------------------------------------------------------------------------

  retrieveOfferDimensionInfo(data) {
    const url = this.environmentService.REST_API_RETRIEVE_OFFER_DIMENSIONS_INFO_URL;
    return this.httpClient.post(url, data);
  }

  retrieveOfferDimensionAttributes() {
    const url = this.environmentService.REST_API_RETRIEVE_MM_OFFER_DIMENSIONS_ATTRIBUTES_URL;
    return this.httpClient.get(url, { withCredentials: true });
  }

  validateOfferDimension(data): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true,
    };

    const url = this.environmentService.REST_API_VALIDATE_OFFER_DIMENSIONS_INFO_URL;
    return this.httpClient.post(url, data, httpOptions);
  }

  // ---------------------------------------------------------------------------------------------------------------

  retrieveDefaultStakeHolders(mmModel: string, businessEntity: string) {
    let url = this.environmentService.REST_API_RETRIEVE_DEFAULT_STAKEHOLDERS_URL;
    url += mmModel;
    url += '/' + businessEntity;
    return this.httpClient.get(url);
  }

  retrieveStakeHoldersRelatedToSelectedAttributes
    (businessEntity: string, mmAttributeList: MMAttributes[]) {
    let url = this.environmentService.REST_API_RETRIEVE_STAKEHOLDERS_REALTED_TO_SELECTED_ATTRIBUTES_URL + businessEntity;
    return this.httpClient.post<User[]>(url, mmAttributeList);
  }

  // ---------------------------------------------------------------------------------------------------------------


  downloadOfferDetailsPdf(offerId: string) {
    const url = this.environmentService.REST_API_DOWNLOAD_OFFER_DETAILS_PDF_URL + '/' + offerId;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get(url, { headers: headers, responseType: 'blob' });

  }

  // ---------------------------------------------------------------------------------------------------------------


}
