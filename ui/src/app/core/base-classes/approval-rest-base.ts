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

  saveToDraft(data) {
    this.addModuleId(data);
    return this.callMethod('saveToDraft', data);
  }

  submitForApproval(data) {
    this.addModuleId(data);
    return this.callMethod('submitForApproval', data);
  }

  approve(data) {
    return this.callMethod('approve', data);
  }

  reject(data) {
    return this.callMethod('reject', data);
  }

  activate(data) {
    this.callMethod('activate', data);
  }

  inactivate(data) {
    this.callMethod('inactivate', data);
  }

}
