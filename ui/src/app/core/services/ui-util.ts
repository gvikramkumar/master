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
  const curMonths = _.range(date.getMonth(), date.getMonth() - numMonths);
  const fisMonths = _.range(date.getMonth() + 5, date.getMonth() + 5 - numMonths);

  for (let i = 0; i < numMonths; i++) {
    const curDate = new Date(date.getTime());
    const fisDate = new Date(date.getTime());
    curDate.setMonth(curMonths[i]);
    const curYear = curDate.getFullYear();
    const curMonthNum = curDate.getMonth() + 1;
    const curMonthName = getMonthNameFromNum(curMonthNum);
    fisDate.setMonth(fisMonths[i]);
    const fisYear = fisDate.getFullYear();
    const fisMonth = fisDate.getMonth() + 1;
    const fisYearMoStr = '' + fisYear + (fisMonth < 10 ? '0' + fisMonth : fisMonth)
    const fisYearMoNum = Number(fisYearMoStr);
    const yearMoMoYear = `${fisYearMoStr} ${curMonthName} FY${fisYear}`;
    yearmos.push({
      // curYear,
      // curMonthNum,
      // curMonthName,
      // fisYear,
      // fisMonth,
      str: fisYearMoStr,
      num: fisYearMoNum,
      long: yearMoMoYear
    });
  }

  return yearmos;
}

function getMonthNameFromNum(mon) {
  const months = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Apr',
    '5': 'May',
    '6': 'Jun',
    '7': 'Jul',
    '8': 'Aug',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
  };
  return months[mon.toString()];
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



