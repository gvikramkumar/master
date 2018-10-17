import AnyObj from '../../../shared/models/any-obj';
import {shUtil} from '../../../shared/shared-util';
import * as _ from 'lodash';
import {svrUtil} from '../common/svr-util';
import {ApiError} from '../common/api-error';

export class CookieBase {
  name: string;
  secureProps = ''; // properties that don't allow api updating
  cookie: AnyObj;
  httpOnly = true;

  constructor(protected req: AnyObj, protected res: AnyObj) {
    try {
      const cookie = req.cookie[this.name] && JSON.parse(svrUtil.base64toAscii(req.cookie[this.name]));
      this.cookie = cookie || {};
    } catch (err) {
      throw new ApiError(`Failed to parse cookie: ${this.name}`, err);
    }
  }

  // called from api for create or update
  setCookie(updates) {
    updates ? Object.assign(this.cookie, updates) : this.create();
    this.res.cookie(this.name, svrUtil.asciiToBase64(JSON.stringify(this.cookie)), this.getOptions());
  }

  // called from api put endpoint, cleans out any secure properties
  updateCookieFromEndpoint(updates = {}) {
    _.omit(updates, shUtil.stringToArray(this.secureProps));
    this.setCookie(updates);
  }

  create() {
    throw new Error('Not implemented');
  }

  getOptions() {
    const opts: AnyObj = {};
    if (this.httpOnly) {
      opts.httpOnly = true;
    }
  }

  serialize(ascii) {
    return Buffer.from(JSON.stringify(this.cookie)).toString('base64');
  }

  deserialize(base64) {
    return Buffer.from(JSON.stringify(this.cookie)).toString('base64');
  }

}
