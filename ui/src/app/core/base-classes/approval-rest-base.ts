import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import AnyObj from '../../../../../shared/models/any-obj';
import {AppStore} from '../../app/app-store';
import {RestBase} from './rest-base';
import {shUtil} from '../../../../../shared/misc/shared-util';

const apiUrl = environment.apiUrl;

export class ApprovalRestBase<T extends AnyObj> extends RestBase<T> {
  endpointUrl: string;

  constructor(
    protected endpointName: string,
    protected httpClient: HttpClient,
    protected store: AppStore,
    protected isModuleRepo = false) {
      super(endpointName, httpClient, store, isModuleRepo);
  }

  saveToDraft(data, params: AnyObj = {}) {
    return this.callMethod('saveToDraft', data, params);
  }

  submitForApproval(data, params: AnyObj = {}) {
    params.showProgress = true;
    return this.callMethod('submitForApproval', data, params);
  }

  approveMany(arr) {
    const params: AnyObj = {};
    params.showProgress = true;
    return this.callMethod('approveMany', arr, params);
  }

  approve(data) {
    const params: AnyObj = {};
    params.showProgress = true;
    return this.callMethod('approveOne', data, params);
  }

  reject(data) {
    const params: AnyObj = {};
    params.showProgress = true;
    return this.callMethod('reject', data, params);
  }

  getApprovalVersionedListByNameAndUserType() {
    const user = this.store.user;
    if (user.isModuleBusinessUser() || user.isModuleEndUser()) {
      return this.callMethod('getManyLatestGroupByNameActiveInactive');
    } else if (user.isModuleSuperUser()) {
      return this.callMethod('getManyLatestGroupByNameActiveInactiveConcatDraftPendingOfUser');
    } else if (user.isModuleAdminOrGreater()) {
      return this.callMethod('getManyLatestGroupByNameActiveInactiveConcatDraftPending');
    }
  }

  getManyLatestGroupByNameActiveInactiveConcatDraftPending() {
    return this.callMethod('getManyLatestGroupByNameActiveInactiveConcatDraftPending');
  }

}
