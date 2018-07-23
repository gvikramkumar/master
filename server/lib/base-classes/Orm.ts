import AnyObj from '../../../shared/models/any-obj';
import * as _ from 'lodash';
import {ApiError} from '../common/api-error';

export enum OrmTypes {
  string = 1,
  number,
  date
}

export interface OrmMap {
  prop: string;
  field: string;
  type?: OrmTypes;
}

export class Orm {

  constructor(public maps: OrmMap[]) {
  }

  recordToObject(record): AnyObj {
    const obj = {};

    this.maps.forEach(map => {
      // pg's converting to date objects, but that's working
      if (false) { // record[map.field] instanceof Date) {
        obj[map.prop] = record[map.field].toISOString();
      } else if (map.type === OrmTypes.number) {
        obj[map.prop] = Number(record[map.field]); // pg returns numbers as strings, so we have to convert
      } else {
        obj[map.prop] = record[map.field];
      }
    });
    return obj;
  }

  objectToRecordAdd(obj, userId) {
    return this.objectToRecord(obj, userId, 'add');
  }

  objectToRecordUpdate(obj, userId) {
    return this.objectToRecord(obj, userId, 'update');
  }

  objectToRecord(obj, userId?: string, mode?: string): AnyObj {
    const record = {};

    const date = new Date();
    if (_.find(this.maps, {prop: 'createdBy'})) {
      if (!userId) {
        throw new ApiError('no userId for createdBy/updatedBy.');
      }
      if (mode === 'add') {
        obj.createdBy = userId;
        obj.createdDate = date;
      }
      obj.updatedBy = userId;
      obj.updatedDate = date;
    }
    this.maps.forEach(map => {
      if (map.type === OrmTypes.date) {
        record[map.field] = this.getPgDateString(obj[map.prop]);
      } else {
        record[map.field] = obj[map.prop];
      }
    });
    return record;
  }

  getPgValue(prop, field, val) {
    if (!prop && !field) {
      throw new ApiError('OrmGetPgValue has no prop or field');
    }
    const type = prop ? _.find(this.maps, {prop}).type : _.find(this.maps, {field}).type;
    switch (type) {
      case OrmTypes.number:
        return Number(val);
      case OrmTypes.date:
        return this.getPgDateString(val);
      default:
        return val.toString();
    }
  }

  getPgDateString(val) {
    let dt: Date;
    if (val instanceof Date) {
      dt = val;
    } else {
      dt = new Date(val);
    }
    return this.dateToString(dt);

  }

  quote(val) {
    return typeof val === 'string' ? '\'' + val + '\'' : val.toString();
  }


  pad (number, digits) {
    number = '' + number
    while (number.length < digits) { number = '0' + number }
    return number
  }

  // stolen from node-postgres/lib/util.js, converts date to postgres string
  dateToString (date) {
    let offset = -date.getTimezoneOffset()
    let ret = this.pad(date.getFullYear(), 4) + '-' +
      this.pad(date.getMonth() + 1, 2) + '-' +
      this.pad(date.getDate(), 2) + 'T' +
      this.pad(date.getHours(), 2) + ':' +
      this.pad(date.getMinutes(), 2) + ':' +
      this.pad(date.getSeconds(), 2) + '.' +
      this.pad(date.getMilliseconds(), 3)

    if (offset < 0) {
      ret += '-';
      offset *= -1;
    } else { ret += '+'; }

    return ret + this.pad(Math.floor(offset / 60), 2) + ':' + this.pad(offset % 60, 2)
  }

}


