import {Injectable} from '@angular/core';
import {throwError, Observable} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ErrorModalComponent} from '../../shared/dialogs/error-modal/error-modal.component';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {environment} from '../../../environments/environment';
import {AppStore} from '../../app/app-store';
import {DialogSize, DialogType} from '../models/ui-enums';
import {UiUtil} from '../services/ui-util';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  // if in this list, then no error modal
  whiteList = [
    // how to bypass errors for specific paths
    // todo: determine what pathing will look like for non-local use, for whitelisting errors
    // {status: 404, methods: ['GET', 'POST'], url: new RegExp(`^${environment.apiUrl}api/login`)},
  ];

  constructor(private store: AppStore, public dialog: MatDialog, private router: Router,
              private uiUtil: UiUtil) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(
        tap(event => {
          const a = event;
        }),
        catchError(resp => {
          this.store.showSpinner = false;

          const error = resp.error;
          let err;
          if (error && error.message) {
            err = resp.error;
          } else {
            err = {
              message: 'Unknown server error',
              data: error
            };
          }

          if (this.whiteListed(resp, req.method)) {
            return throwError(err);
          }

          /*
                  if (err.errorCode === errorCodes.server_prefix + errorCodes.user_not_authenticated) {
                    this.router.navigateByUrl('/login');
                  }
          */

          let data;
          if (err.data) {
            try {
              delete err.data.stack;
              data = JSON.stringify(err.data, null, 2);
            } catch (e) {
            }
          }
          this.uiUtil.genericDialog(err.message, data, 'Error', DialogType.ok, DialogSize.medium);
          return throwError(err);
        }));
  }

  /**
   * whiteListed
   * @desc - Some 404's are an error (unexpected), while others are handled in the code (expected). We'll whitelist
   * the expected ones so we won't get an error modal in that case. We could just pass a parameter to show no errors, but
   * that only applies to expected errors, and even then we may want to show 400 but nto 404
   * @param resp
   * @param method
   * @returns {boolean}
   */
  whiteListed(resp, method) {
    let found = false;
    this.whiteList
      .forEach(item => {
        if (resp.status === item.status && _.includes(item.methods, method) && item.url.test(resp.url)) {
          found = true;
        }
      });
    return found;
  }

}


