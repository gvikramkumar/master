import * as _ from 'lodash';
import LookupRepo from '../../api/common/lookup/repo';
import {ApiError} from '../common/api-error';
import AnyObj from '../../../shared/models/any-obj';
import {shUtil} from '../../../shared/shared-util';

export function authAdmin() {

  return (req, res, next) => {
    req.requiresAdminAccess = true;
    next();
  };

}

