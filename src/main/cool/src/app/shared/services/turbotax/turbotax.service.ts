import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '@env/environment.service';

@Injectable()
export class TurbotaxService {

  constructor(private _http: HttpClient, private environmentService: EnvironmentService) { }

  getRubboTaxMenu(offerId): any {
    return this._http.get(this.environmentService.REST_API_RETRIEVE_MILESTONES_URL + '/' + offerId + '/false');
  }

}
