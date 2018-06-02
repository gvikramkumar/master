import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProgressService} from '../services/progress.service';
import {tap} from 'rxjs/operators';


@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private progressService: ProgressService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.params.get('hideSpinner') !== 'true') {
      this.progressService.showProgressBar();
    }
    const nextReq = req.clone({params: req.params.delete('hideSpinner')});

    return next
      .handle(nextReq).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.progressService.hideProgressBar();
          }
        })
      )
  }
}
