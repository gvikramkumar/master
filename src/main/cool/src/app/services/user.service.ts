import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
private userId;
constructor(private httpClient: HttpClient) {}

public setUserId(userId){
  this.userId = userId;
}

public getUserId() {
  return this.userId;
}

}
