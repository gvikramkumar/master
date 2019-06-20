import {ApiError} from '../common/api-error';
import config from '../../config/get-config';
import {shUtil} from '../../../shared/misc/shared-util';

export function timeoutHandler() {
  return function (req, res, next) {
    setTimeout(() => {
      if (!res.headersSent) {
        if (/^\/api\/[a-z]{4}\/upload/.test(req.originalUrl)) {
          next(new ApiError('Your upload request is still being processed. Please check email for success/fail status.', null, 504));
        } else if (/^\/api\/report\/.*/.test(req.originalUrl)) {
          // if report, this is on a new tab in the browser, so has to show in html then
          res.status(504).send(shUtil.getHtmlForLargeSingleMessage('Report took too long to generate, please try again.'));
        } else {
          next(new ApiError('Your request took too long to complete, please try again.', null, 504));
        }
      }
    }, config.expressTimeout);
    next();
  };
}
