import {ApiError} from '../common/api-error';
import {svrUtil} from '../common/svr-util';

export function authUnit() {
  return (req, res, next) => {
    if (!svrUtil.isUnitEnv()) {
      throw new ApiError('Api access allowed only for unit environment.', null, 401);
    }
    next();
  };
}

