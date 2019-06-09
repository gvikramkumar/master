import _ from 'lodash';
import {pgc} from '../database/postgres-conn';
import {ApiError} from '../common/api-error';
import AnyObj from '../../../shared/models/any-obj';
import {DisregardError} from '../common/disregard-error';
import config from '../../config/get-config';
import {svrUtil} from '../common/svr-util';

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
  const truncateLength = 160;

  return function (err, req, res, next) {
    const obj: AnyObj = {};
    let statusCode;
    const data = {
      user: req.user && req.user.id,
      timestamp: new Date().toISOString(),
      url: `${req.method}  ${req.url}`,
      message: err.message
    };
    if (err instanceof DisregardError) {
      return;
    } else if (err.name === 'ValidationError' && err.errors) {
      obj.name = 'MongooseValidationError';
      if (err.message.length > truncateLength) {
        obj.message = err.message.substr(0, truncateLength) + '...'; // full message in data
      }
      obj.data = Object.assign(data, err.errors);
      statusCode = 400;
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
        const rest = _.clone(obj);
        delete rest.message; // getting url, message first
        obj.data = Object.assign(data, rest);
        if (obj.message.length > truncateLength) {
          obj.message = obj.message.substr(0, truncateLength) + '...'; // full message in data
        }
      } else {
        obj.data = Object.assign(data, obj.data);
      }
    }
    if (!svrUtil.isUnitEnv()) {
      console.error(obj);
    }
    if (!res.headersSent) {
      res.status(statusCode).send(obj);
    }
  };

}


