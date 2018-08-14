import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {RestBase} from '../base-classes/rest-base';
import {DfaModule} from '../../modules/_common/models/module';
import {HttpClient} from '../../../../node_modules/@angular/common/http';
import {AppStore} from '../../app/app-store';
import DfaUser from '../../../../../shared/models/dfa-user';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService extends RestBase<DfaUser> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('user', httpClient, store);
  }

  refreshUser() {
   return this.callMethod('getUser').toPromise()
     .then((user: DfaUser) => {

       this.store.pubUser(new DfaUser(
         user.id,
         user.firstName,
         user.lastName,
         user.email,
         user.roles
       ));
     });
  }

}
