import {ApiError} from './api-error';
import * as _request from 'request';

export function finRequest(options) {
  const request = _request.default;

  return new Promise((resolve, reject) => {

    request(options, (err, resp, body) => {
      if (err) {
        throw new ApiError('Request error', {
          error: err,
          options: options
        });
      }
      resolve({resp, body});
    });

  });

}

export function finJsonRequest(url, method, json, _options = {}) {
  const options = {
    url,
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    json
  };
  Object.assign(options, _options);

  return finRequest(options);
}



