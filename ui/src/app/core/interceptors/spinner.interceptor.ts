import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AppStore} from '../../app/app-store';


@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private store: AppStore) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.params.get('showProgress') && req.params.get('showProgress').toString() === 'true') {
      this.store.showProgressBar();
    }
    const nextReq = req.clone({params: req.params.delete('showProgress')});

    return next
      .handle(nextReq).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.store.hideProgressBar();
          }
        })
      )
  }
}
