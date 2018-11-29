import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  userId: string;

  constructor(private httpClient: HttpClient) {
  }

  getUserId() {
    return this.userId;
  }

}
