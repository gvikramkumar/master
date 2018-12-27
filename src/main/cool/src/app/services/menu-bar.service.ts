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
      return this.httpClient.get(this.environmentService.REST_API_TURBO_TAX_MENU + caseId + "/false");
    }

    holdOffer(offerId):any {
      debugger;
      return this.httpClient.post(this.environmentService.REST_API_HOLD_OFFER + offerId, {});
    }

    cancelOffer(offerId):any {
      debugger;
      return this.httpClient.post(this.environmentService.REST_API_CANCEL_OFFER + offerId, {});
    }

}
