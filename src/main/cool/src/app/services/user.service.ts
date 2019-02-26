import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  private userId;
  private firstName;
  private lastName;
  private fullName;

  constructor(private httpClient: HttpClient) { }

  public setUserId(userId) {
    this.userId = userId;
  }

  public getUserId() {
    return this.userId;
  }

  public setFirstName(firstName) {
    this.firstName = firstName;
  }

  public getFirstName() {
    return this.firstName;
  }

  public setLastName(lastName) {
    this.lastName = lastName;
  }

  public getLastName() {
    return this.lastName;
  }
  public setName(fullName) {
    this.fullName = fullName;
  }
  public getName() {
    return this.fullName;
  }

}
