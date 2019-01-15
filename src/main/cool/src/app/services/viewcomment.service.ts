import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class ViewcommentService {

  constructor(
    private _http: HttpClient,
    private environmentService: EnvironmentService) { }


  getViewComment(taskId): Observable<any> {
    return this._http.get(this.environmentService.REST_API_VIEW_COMMENT_GET_URL + '/' + taskId);
  }

  postViewComment(objComment, taskId) {
    return this._http.post(this.environmentService.REST_API_CREATE_COMMENT_URL + '/' + taskId, objComment);
  }

}
