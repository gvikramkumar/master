import _ from 'lodash';
import {ApiError} from '../common/api-error';

export default function() {

  return function (req, res, next) {
    next(new ApiError('Endpoint not found.', {method: req.method, url: req.url}, 404));
  };
}

