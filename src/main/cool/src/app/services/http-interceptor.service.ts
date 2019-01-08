import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from "@angular/common/http";
import { Observable } from "rxjs";
import { EnvironmentService } from "../../environments/environment.service";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private environmentService: EnvironmentService) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.environmentService.USER_ID && this.environmentService.PASSWORD && req.url.startsWith('/pdafapp')) {
      const authReq = req.clone({ headers: req.headers.set('Authorization', `Basic ${btoa(this.environmentService.USER_ID + ":" + this.environmentService.PASSWORD)}`) });
      return next.handle(authReq)
    }
    else {
      return next.handle(req);
    }
  }
}
