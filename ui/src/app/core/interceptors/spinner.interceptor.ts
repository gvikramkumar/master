import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Store} from '../../store/store';


@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private store: Store) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.params.get('showSpinner') === 'true') {
      this.store.showSpinner = true;
    }
    const nextReq = req.clone({params: req.params.delete('showSpinner')});

    return next
      .handle(nextReq).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.store.showSpinner = false;
          }
        })
      )
  }
}
