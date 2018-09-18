import * as _ from 'lodash';
import {pgc} from '../database/postgres-conn';
import {ApiError} from '../common/api-error';
import AnyObj from '../../../shared/models/any-obj';

/**
 * errorHandler
 * @desc - error handling middleware. We need the error json to show the message and stack properties
 * but these are hidden in json by default, so we add them to another object for json.stringify()
 * @param err
 * @param req
 * @param res
 * @param next
 */

export function errorHandler (options) {

  const defaults = {showStack: false};
  const opts = _.merge(defaults, options)
  const truncateLength = 66;

  return function (err, req, res, next) {
    let obj: AnyObj = {}, statusCode;
    const urlInfo = `${req.method}  ${req.url}`;
    // mongoose validation error
    if (err.name === 'ValidationError' && err.errors) {
      obj.name = 'MongooseValidationError';
      if (err.message.length > truncateLength) {
        obj.message = err.message.substr(0, truncateLength) + '...'; // full message in data
      }
      const data = {
        url: urlInfo,
        message: err.message
      }
      obj.data = Object.assign(data, err.errors);
      statusCode = 400;
    } else if (err.message === 'Cannot read property \'query\' of undefined' && !pgc.pgdb) {
      statusCode = 500;
      const data = _.clone(err);
      data.url = urlInfo;
      if (err && err.message) {
        data.message = err.message;
      }
      if (err && err.stack && opts.showStack) {
        data.stack = err.stack;
      }
      obj = new ApiError('Postgres is down', data, 500);
    } else {
      Object.assign(obj, err);
      statusCode = err.statusCode || 500;
      delete obj.statusCode;
      // Error object message and stack properties are symbols, need to do this to get them in obj then
      if (err && err.message) {
        obj.message = err.message;
      }
      if (err && err.stack && opts.showStack) {
        obj.stack = err.stack;
      }
      if (!obj.data) {
        const data = {
          url: urlInfo,
          message: err.message
        }
        const rest = _.clone(obj);
        delete rest.message; // getting url, message first
        obj.data = Object.assign(data, rest);
        if (obj.message.length > truncateLength) {
          obj.message = obj.message.substr(0, truncateLength) + '...'; // full message in data
        }
      } else {
        obj.data = Object.assign({url: urlInfo}, obj.data);
      }
    }
    console.error(obj);
    res.status(statusCode).send(obj);
  };

}


