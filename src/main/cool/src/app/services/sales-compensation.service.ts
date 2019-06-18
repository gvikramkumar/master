import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '@env/environment.service';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesCompensationService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { 
    
  }

  getTncMapping(offerId: string): Observable<any> {
    console.log('got offer id', offerId);
    const url = this.environmentService.REST_API_RETRIEVE_TERM_CONTENT_MAPPING_URL + '?offerId=' + offerId;
    return this.httpClient.get(url, { withCredentials: true });
  }
}
