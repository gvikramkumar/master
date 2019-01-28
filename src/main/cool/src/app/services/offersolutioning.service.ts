import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class OffersolutioningService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  postForOfferSolutioning(data){
    const url = this.environmentService.REST_API_OFFER_SOLUTIONING_POST_URL;
    return this.httpClient.post(url, data);
}
}
