import { Injectable } from '@angular/core';
import { SelfServiceOrderability } from '../pirate-ship/modules/self-service-orderability/models/self-service-orderability';

import { EnvironmentService } from '@env/environment.service';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SelfServiceOrderabilityService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  retrieveAtoList(offerId: string): Observable<SelfServiceOrderability> {
    const url = this.environmentService.REST_API_RETRIEVE_ATO_LIST_URL + '?offerId=' + offerId;
    return null;
    // this.httpClient.get<SelfServiceOrderability>(url).pipe(retry(1));
  }

}
