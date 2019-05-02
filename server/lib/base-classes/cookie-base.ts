import AnyObj from '../../../shared/models/any-obj';
import {shUtil} from '../../../shared/misc/shared-util';
import _ from 'lodash';
import {ApiError} from '../common/api-error';
import {svrUtil} from '../common/svr-util';

export class CookieBase {
  cookie: AnyObj;
  httpOnly = true;

  constructor(protected req: AnyObj, protected res: AnyObj, protected name, protected secureProps = '') {
    try {
      if (req.cookies[this.name]) {
        const cookie = req.cookies[this.name] && JSON.parse(svrUtil.base64ToAscii(req.cookies[this.name]));
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
    const values = Object.assign(this.cookie || {}, updates);
    this.setCookie(values);
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
