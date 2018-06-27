import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {
  }

  isAdminModule(module) {
    return module.moduleId === 99;
  }

  isAdminModuleId(moduleId) {
    return moduleId === 99;
  }

  createHttpParams(_params) {
    let params = new HttpParams();
    _.forEach(_params, (val, key) => {
      params = params.set(key, _params[key]);
    })
    return params;
  }

  submitForm(url, params) {

    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', url);

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => document.body.removeChild(form));
  }


}

