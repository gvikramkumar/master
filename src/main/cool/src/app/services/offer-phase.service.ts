import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';


@Injectable()
export class OfferPhaseService {


    constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) {
    }

    getOfferPhaseDetails(caseId: string, status: boolean): Observable<any> {
        const url = this.environmentService.REST_API_RETRIEVE_MILESTONES_URL + '/' + caseId + '/' + status;
        return this.httpClient.get(url, { withCredentials: true });
    }

    createSolutioningActions(data) {
        const url = this.environmentService.REST_API_POST_ACTION_URL;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            withCredentials: true,
        };
        return this.httpClient.post(url, data, httpOptions);
    }

    getOfferPhase(caseId): any {
        return this.httpClient.get(this.environmentService.REST_API_RETRIEVE_MILESTONES_URL + '/' + caseId + '/false');
      }

}
