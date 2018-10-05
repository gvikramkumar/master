import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppStore} from '../../app/app-store';
import {Injectable} from '@angular/core';

@Injectable()
export class ModifyRequestInterceptor implements HttpInterceptor {
  constructor(private store: AppStore) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let params = req.params ? req.params : new HttpParams();
    const moduleId = this.store.module && this.store.module.moduleId;
    if (moduleId) {
      params = params.set('moduleId', moduleId.toString());
    }

    const modifiedReq = req.clone({
      withCredentials: true,
      params: params
    });
    return next.handle(modifiedReq);
  }
}
