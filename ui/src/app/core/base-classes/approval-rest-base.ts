import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import AnyObj from '../../../../../shared/models/any-obj';
import {AppStore} from '../../app/app-store';
import {RestBase} from './rest-base';

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
    params.moduleId = this.store.getNonAdminModuleId();
    return this.callMethod('saveToDraft', data, params);
  }

  submitForApproval(data, params: AnyObj = {}) {
    params.moduleId = this.store.getNonAdminModuleId();
    params.showProgress = true;
    return this.callMethod('submitForApproval', data, params);
  }

  approve(data) {
    const params: AnyObj = {};
    params.moduleId = this.store.getNonAdminModuleId();
    params.showProgress = true;
    return this.callMethod('approve', data, params);
  }

  reject(data) {
    const params: AnyObj = {};
    params.moduleId = this.store.getNonAdminModuleId();
    params.showProgress = true;
    return this.callMethod('reject', data, params);
  }

  activate(data) {
    const params: AnyObj = {};
    params.moduleId = this.store.getNonAdminModuleId();
    this.callMethod('activate', data, params);
  }

  inactivate(data) {
    const params: AnyObj = {};
    params.moduleId = this.store.getNonAdminModuleId();
    this.callMethod('inactivate', data, params);
  }

  getApprovalVersionedListByNameAndUserType() {
    const moduleId = this.store.module.moduleId;
    const user = this.store.user;
    if (user.isModuleEndUser()) {
      return this.getLatestByName({status: 'A'});
    } else if (user.isModuleSuperUser()) {
      return this.callMethod('getManyLatestByNameActiveConcatDraftPendingOfUser');
    } else if (user.isModuleAdminOrGreater()) {
      return this.callMethod('getManyLatestByNameActiveConcatDraftPending');
    }
  }

}
