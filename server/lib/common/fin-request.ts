import {ApiError} from './api-error';
import request from 'request';

export function finRequest(options) {

  return new Promise((resolve, reject) => {

    request(options, (err, resp, body) => {
      if (err) {
        reject(new ApiError('Request error', {
          error: Object.assign({message: err.message}, err),
          options: options
        }));
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



