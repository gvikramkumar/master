import 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';
import { LeadTime } from '../right-panel/lead-time';
import { throwError } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RightPanelService {

  launchDateUrl: string;
  averageWeekUrl: string;

  constructor(
    private httpClient: HttpClient,
    private environmentService: EnvironmentService) {

    this.launchDateUrl = this.environmentService.REST_API_LEAD_TIME_LAUNCH_DATE;
    this.averageWeekUrl = this.environmentService.REST_API_LEAD_TIME_AVERAGE_WEEKS;

  }

// -------------------------------------------------------------------------------------

  displayLaunchDate(offerId: string) {

    return this.httpClient.get<LeadTime>(this.launchDateUrl + offerId, {
      observe: 'body',
      responseType: 'json'
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );

  }

  displayAverageWeeks(be: string, mm: string ) {

    return this.httpClient.get(this.averageWeekUrl + be + '/' + mm, {
      observe: 'body',
      responseType: 'json'
    }).pipe(
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

}
