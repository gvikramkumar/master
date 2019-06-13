import 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';
import { LeadTime } from '@app/feature/right-panel/models/lead-time';
import { Observable, throwError } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RightPanelService {

  launchDateUrl: string;
  averageWeekUrl: string;
  getOfferDatesUrl: string;
  updateOfferPhaseUrl: string;
  updateOfferPhaseUrlInDBUrl: string;

  constructor(
    private httpClient: HttpClient,
    private environmentService: EnvironmentService) {

    this.getOfferDatesUrl = this.environmentService.REST_API_RETRIEVE_OFFER_DATES;
    this.launchDateUrl = this.environmentService.REST_API_LEAD_TIME_LAUNCH_DATE;
    this.averageWeekUrl = this.environmentService.REST_API_LEAD_TIME_AVERAGE_WEEKS;
    this.updateOfferPhaseUrl = this.environmentService.REST_API_UPDATE_OFFER_TARGET_DATE;
    this.updateOfferPhaseUrlInDBUrl = this.environmentService.REST_API_UPDATE_OFFER;


  }

  // -------------------------------------------------------------------------------------

  displayOfferDates(caseId: string) {

    return this.httpClient.get(this.getOfferDatesUrl + caseId, {
      observe: 'body',
      responseType: 'json'
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  displayLaunchDate(offerId: string) {

    return this.httpClient.get(this.launchDateUrl + offerId, {
      observe: 'body',
      responseType: 'json'
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );

  }

  displayAverageWeeks(be: string, mm: string) {
    const url = `${this.averageWeekUrl}${be}/${mm}`;
    return this.httpClient.get(url).pipe(
      retry(3),
      catchError(this.handleError)
    );

  }

  // -------------------------------------------------------------------------------------

  // Handle Error Messages
  private handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // tslint:disable-next-line: no-console
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // tslint:disable-next-line: no-console
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  // -------------------------------------------------------------------------------------

  updatePhaseTargetDate(payLoad: any): Observable<any> {
    return this.httpClient.post(this.updateOfferPhaseUrl, payLoad, { withCredentials: true });
  }

  updatePhaseTargetDateInDB(payLoad: any): Observable<any> {
    return this.httpClient.post(this.updateOfferPhaseUrlInDBUrl, payLoad, { withCredentials: true });
  }

}
