import {ApiError} from '../common/api-error';
import config from '../../config/get-config';

export function timeoutHandler() {
  return function (req, res, next) {
    setTimeout(() => {
      if (!res.headersSent) {
        if (/^\/api\/[a-z]{4}\/upload$/.test(req.path)) {
          next(new ApiError('Your request has timed out. Please check email for success/fail status', null));
        } else {
          next(new ApiError('Your request has timed out', null));
        }
      }
    }, config.expressTimeout);
    next();
  };
}
