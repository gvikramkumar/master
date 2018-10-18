import {FinDfaCookie} from './fin-dfa.cookie';
import {ApiError} from '../../lib/common/api-error';
import {shUtil} from '../../../shared/shared-util';
import * as _ from 'lodash';

export class CookieController {

  setCookie(req, res, next) {
    switch (req.body.name) {
      case 'fin-dfa':
        new FinDfaCookie(req, res).updateCookieFromEndpoint(req.body);
        break;
      default:
        throw new ApiError('No cookie name in body', null, 400);
    }
    next();
  }

}


