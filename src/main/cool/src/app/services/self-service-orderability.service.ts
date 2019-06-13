import { Injectable } from '@angular/core';
import { SelfServiceOrderability } from '@app/feature/pirate-ship/modules/self-service-orderability/models/self-service-orderability';

import { EnvironmentService } from '@env/environment.service';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SelfServiceOrderabilityService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  retieveSsoDetails(offerId: string): Observable<SelfServiceOrderability> {
    const url = this.environmentService.REST_API_GET_SSO_DETAILS_URL + offerId;
    return this.httpClient.get<SelfServiceOrderability>(url).pipe(retry(1));
  }

}
