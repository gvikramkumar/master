import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class OfferPhaseService {

    offerPhaseDetailsUrl: string = this.environmentService.REST_API_OFFERPHASE_DETAILS_URL;

    constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) {
    }

    getOfferPhaseDetails(caseId): Observable<any> {
        const url = this.offerPhaseDetailsUrl + '/' + caseId + '/false';
        return this.httpClient.get(url, { withCredentials: true });
    }

    proceedToStakeHolders(data){
        let url = this.environmentService.REST_API_HOLD_OFFER;
        return this.httpClient.post(url,data);
    }

}
