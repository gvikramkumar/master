import {Injectable} from '@angular/core';
import 'rxjs/add/operator/do';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ProgressService} from '../services/progress.service';


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
      .handle(nextReq)
      .do(event => {
        if (event instanceof HttpResponse) {
          this.progressService.hideProgressBar();
        }
      });
  }
}
