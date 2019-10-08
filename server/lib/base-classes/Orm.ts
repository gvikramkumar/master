import AnyObj from '../../../shared/models/any-obj';
import _ from 'lodash';
import {ApiError} from '../common/api-error';
import {svrUtil} from '../common/svr-util';

export enum OrmTypes {
  string = 1,
  number,
  date,
  dateString
}

export interface OrmMap {
  prop: string;
  field: string;
  type?: OrmTypes;
  serial?: boolean;
  mgDefault?: any;
  pgDefault?: any;
}

export class Orm {
  mapsFull: OrmMap[];
  maps: OrmMap[];
  hasCreatedBy = false;
  mapsToPg: OrmMap[];
  mapsToMongo: OrmMap[];

  constructor(_maps: OrmMap[]) {
    this.maps = _maps.filter(map => map.prop && map.field);
    this.mapsToPg = _maps.filter(map => !map.serial && map.field);
    this.mapsToMongo = _maps.filter(map => map.prop);
    this.hasCreatedBy = !!_.find(this.maps, {prop: 'createdBy'});
  }

  recordToObject(record): AnyObj {
    const obj = {};

    this.mapsToMongo.forEach(map => {
      // pg's converting to date objects, but that's working, so we'll leave that be for now
      // if we need to, we can convert it to toIsoString()
      // if (false) { // record[map.field] instanceof Date) {
      //   obj[map.prop] = record[map.field].toISOString();
      // } else
      if (map.prop && !map.field) {
        if (map.mgDefault === undefined) {
          throw new ApiError(`Orm.recordToObject no mgDefault for ${map.prop}.`);
        }
        _.set(obj, map.prop, map.mgDefault);
      } else if (map.type === OrmTypes.number) {
        // Number(undefined) = NaN and Number(null) = 0, we don't want either
        if (record[map.field] !== undefined && record[map.field] !== null) {
          _.set(obj, map.prop, Number(record[map.field])); // pg returns numbers as strings, so we have to convert
        }
      } else {
        _.set(obj, map.prop, record[map.field]);
      }
    });
    return obj;
  }

  objectToRecordAdd(obj, userId, bypassCreatedUpdated?) {
    return this.objectToRecord(obj, userId, 'add', bypassCreatedUpdated);
  }

  objectToRecordUpdate(obj, userId) {
    return this.objectToRecord(obj, userId, 'update');
  }

  objectToRecord(obj, userId?: string, mode?: string, bypassCreatedUpdated = false): AnyObj {
    const record = {};

    if (bypassCreatedUpdated) {
      // need to skip this for mongoToPgSync, we want to maintain current created/updated values
    } else if (mode === 'add') {
      this.addCreatedByAndUpdatedBy(obj, userId);
    } else {
      this.addUpdatedBy(obj, userId);
    }

    this.mapsToPg.forEach(map => {
      if (map.field && !map.prop) {
        if (map.pgDefault === undefined) {
          throw new ApiError(`Orm.objectToRecord no pgDefault for ${map.field}.`);
        }
        record[map.field] = map.pgDefault;
      } else if (map.type === OrmTypes.date) {


        record[map.field] = this.getPgDateString(_.get(obj, map.prop));
      } else if (map.type === OrmTypes.dateString) {

        record[map.field] = this.getPgDate(_.get(obj, map.prop));
      } else {
        let val = _.get(obj, map.prop);
        if (val && typeof val === 'string') {
          val = svrUtil.postgresReplaceQuotes(val);
        }
        record[map.field] = val;
      }
    });
    return record;
  }

  getPgValue(prop, field, val) {
    if (!prop && !field) {
      throw new ApiError('OrmGetPgValue has no prop or field.');
    }
    if (val === undefined) {
      return val;
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

    if (!val) {
      return undefined;
    }
    let dt: Date;
    if (val instanceof Date) {
      dt = val;
    } else {
      dt = new Date(val);
    }
    return this.dateToString(dt);

  }
  getPgDate(val) {

    if (!val) {
      return undefined;
    }
    let dt: Date;
    dt = val;

    /* if (val instanceof Date) {
        dt = val;
      } else {
        dt = new Date(val);
      }
  */
    let ret = this.pad(val.getFullYear(), 4) + '-' +
      this.pad(val.getMonth() + 1, 2) + '-' +
      this.pad(val.getDate(), 2)

    return ret;

  }
  getPgField(idProp) {
    const map = _.find(this.maps, {prop: idProp});
    if (!map) {
      throw new ApiError('Failed to find idProp map.');
    }
    return map.field;
  }

  quote(val) {
    if (typeof val === 'string') {
      return '\'' + val + '\'';
    } else if (val === null || val === undefined) {
      return 'null';
    } else if (val.toString) {
      return val.toString();
    } else {
      return val;
    }
  }


  pad(number, digits) {
    number = '' + number
    while (number.length < digits) {
      number = '0' + number;
    }
    return number;
  }

  // stolen from node-postgres/lib/util.js, converts date to postgres string
  dateToString(date) {
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
    } else {
      ret += '+';
    }

    return ret + this.pad(Math.floor(offset / 60), 2) + ':' + this.pad(offset % 60, 2)
  }

  addCreatedByAndUpdatedBy(item, userId) {
    if (this.hasCreatedBy) {
      if (!userId) {
        throw new ApiError('no userId for createdBy/updatedBy.');
      }
      const date = new Date();
      item.createdBy = userId;
      item.createdDate = date;
      item.updatedBy = userId;
      item.updatedDate = date;
    }
  }

  addUpdatedBy(item, userId) {
    if (this.hasCreatedBy) {
      if (!userId) {
        throw new ApiError('no userId for createdBy/updatedBy.');
      }
      const date = new Date();
      if (!item.createdBy) {
        item.createdBy = userId;
      }
      if (!item.createdDate) {
        item.createdDate = date;
      }
      item.updatedBy = userId;
      item.updatedDate = date;
    }
  }

}

