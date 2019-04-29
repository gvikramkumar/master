import {ApiError} from '../common/api-error';
import config from '../../config/get-config';
import {shUtil} from '../../../shared/shared-util';

export function timeoutHandler() {
  return function (req, res, next) {
    setTimeout(() => {
      if (!res.headersSent) {
        if (/^\/api\/[a-z]{4}\/upload/.test(req.originalUrl)) {
          next(new ApiError('Your upload request has timed out, but is still being processed. Please check email for success/fail status'));
        } else if (/^\/api\/report\/.*/.test(req.originalUrl)) {
          next(new ApiError(shUtil.getHtmlForLargeSingleMessage('Your request has timed out')));
        } else {
          next(new ApiError('Your request has timed out'));
        }
      }
    }, config.expressTimeout);
    next();
  };
}
