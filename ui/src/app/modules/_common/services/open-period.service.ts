import { Injectable } from '@angular/core';

const arr = [
  {fiscalMonthName: 'JUL FY2018', fiscalMonthInt:	201812},
  {fiscalMonthName: 'JUN FY2018', fiscalMonthInt:	201811},
  {fiscalMonthName: 'MAY FY2018', fiscalMonthInt:	201810},
  {fiscalMonthName: 'APR FY2018', fiscalMonthInt:	201809},
  {fiscalMonthName: 'MAR FY2018', fiscalMonthInt:	201808},
  {fiscalMonthName: 'FEB FY2018', fiscalMonthInt:	201807},
  {fiscalMonthName: 'JAN FY2018', fiscalMonthInt:	201806},
];


@Injectable({
  providedIn: 'root'
})
export class OpenPeriodService {

  constructor() { }

  getMany(months) {
    return arr.slice(0, months);
  }



}
