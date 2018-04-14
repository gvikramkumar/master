import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {User} from '../../store/models/user';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Router} from '@angular/router';
import {Store} from '../../store/store';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {StoreUser} from '../../store/store-user';


@Injectable()
export class UserService {
  usr: StoreUser;

  constructor(private http: HttpClient, private store: Store, private router: Router) {
    this.usr = store.usr;
  }

  getUser() {
    return this.http.get<User>(environment.apiUrl + 'api/login/current')
      .do(user => {
        this.usr.pubUser(user);
      })
      .catch(e => {
        return Observable.throw(e);
      });
  }

  addUser(user) {
    return this.http.post<User>(`${environment.apiUrl}api/users`, user)
      .do(_user => this.usr.pubUser(_user));
  }

  updateUser(user) {
    return this.http.put<User>(`${environment.apiUrl}api/users/${user.id}`, user)
      .do(_user => this.usr.pubUser(_user));
  }

  deleteLabel(user, label) {
    user.labels.splice(_.findIndex(user.labels, {id: label.id}), 1);
    return this.updateUser(user);

  }

  getLabelById(id) {
    return _.find(this.usr.user.labels, {id: id});
  }

}

