import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class MenuBarService {

  constructor(
    private httpClient: HttpClient,
    private environmentService: EnvironmentService
    ) { }

    getRubboTaxMenu(caseId):any {
      return this.httpClient.get(this.environmentService.REST_API_TURBO_TAX_MENU + caseId + '/true');
    }

    holdOffer(data):any {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept' : 'application/json'
        }),
        withCredentials: true,
      };

      return this.httpClient.post(this.environmentService.REST_API_HOLD_OFFER, data, httpOptions);
    }

    cancelOffer(data):any {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept' : 'application/json'
        }),
        withCredentials: true,
      };

      return this.httpClient.post(this.environmentService.REST_API_CANCEL_OFFER, data, httpOptions );
    }

    sendNotification(data:object) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept' : 'application/json'
        }),
        withCredentials: true,
      };

      return this.httpClient.post(this.environmentService.REST_API_EMAIL_NORIFICATION, data, httpOptions );
    }

}
