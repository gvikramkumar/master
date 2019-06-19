import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '@env/environment.service';
import { ModellingDesign } from '@app/feature/pirate-ship/modules/modelling-design/model/modelling-design';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModellingDesignService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  retrieveModelingActivities(offerId: string): Observable<ModellingDesign> {
    const url = this.environmentService.REST_API_RETRIEVE_MODELING_ACTIVITIES_URL + '/' + offerId;
    return this.httpClient.get<ModellingDesign>(url).pipe(retry(1));
  }

  updateModelingDesignStatus(offerId: string, selectedAto: string) {
    const url = this.environmentService.REST_API_UPDATE_MODELING_DESIGN_STATUS_URL + '/' + offerId + '/' + selectedAto;
    return this.httpClient.put(url, null);
  }

}
