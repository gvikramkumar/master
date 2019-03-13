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
import { ConfigurationService } from '../services/configuration.service'

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private environmentService: EnvironmentService, private configurationService: ConfigurationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ((req.url.startsWith(this.environmentService.basepdafapi) || req.url.startsWith(this.environmentService.baseldapapi)) && this.configurationService.startupData.token) {
      const authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${this.configurationService.startupData.token}`) });
      return next.handle(authReq)
    }
    else {
      return next.handle(req);
    }
  }
}
