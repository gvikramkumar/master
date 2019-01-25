import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class StrategyReviewService {

constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

getStrategyReview(caseId): Observable<any> {
    const url = this.environmentService.REST_API_STRATEGY_REVIEW_GET_URL + caseId;
    return this.http.get(url,{ withCredentials: true });
  }

}
