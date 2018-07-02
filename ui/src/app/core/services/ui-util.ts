import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import * as _ from 'lodash';

export const uiUtil = {
  screenHeightShort,
  isAdminModule,
  isAdminModuleId,
  createHttpParams,
  submitForm,
  getFiscalMonthListFromDate
};

function getFiscalMonthListFromDate(date, numMonths) {
  const yearmos = [];
  const months = _.range(date.getMonth() + 5, date.getMonth() + 5 - numMonths);
  let month;

  months.forEach(mon => {
    date.setMonth(mon);
    month = date.getMonth() + 1;
    yearmos.push('' + date.getFullYear() + (month < 10 ? '0' + month : month));
  })

  return yearmos.map(str => {
    return {str: str, num: Number(str)};
  });
}

function screenHeightShort(elem) {
}

function isAdminModule(module) {
  return module.moduleId === 99;
}

function isAdminModuleId(moduleId) {
  return moduleId === 99;
}

function createHttpParams(_params) {
  let params = new HttpParams();
  _.forEach(_params, (val, key) => {
    params = params.set(key, _params[key]);
  })
  return params;
}

function submitForm(url, params) {

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



