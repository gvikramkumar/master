import AnyObj from '../../../shared/models/any-obj';
import {shUtil} from '../../../shared/shared-util';
import * as _ from 'lodash';
import {svrUtil} from '../common/svr-util';
import {ApiError} from '../common/api-error';

export class CookieBase {
  cookie: AnyObj;
  httpOnly = true;

  constructor(protected req: AnyObj, protected res: AnyObj, protected name, protected secureProps = '') {
    try {
      if (req.cookie && req.cookie[this.name]) {
        const cookie = req.cookie[this.name] && JSON.parse(svrUtil.base64toAscii(req.cookie[this.name]));
        this.cookie = cookie;
      }
    } catch (err) {
      throw new ApiError(`Failed to parse cookie: ${this.name}`, err);
    }

  }

  // called from api for create or update
  setCookie(values: AnyObj) {
    this.res.cookie(this.name, svrUtil.asciiToBase64(JSON.stringify(values)), this.getOptions());
  }

  updateCookie(updates) {
    this.cookie = Object.assign(this.cookie || {}, updates);
    this.res.cookie(this.name, svrUtil.asciiToBase64(JSON.stringify(this.cookie)), this.getOptions());
  }

  // called from api put endpoint, cleans out any secure properties
  updateCookieFromEndpoint(updates = {}) {
    _.omit(updates, shUtil.stringToArray(this.secureProps));
    this.setCookie(updates);
  }

  getOptions() {
    const opts: AnyObj = {};
    if (this.httpOnly) {
      opts.httpOnly = true;
    }
    return opts;
  }

}
