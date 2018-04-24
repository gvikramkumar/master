const _ = require('lodash');

/**
 * errorHandler
 * @desc - error handling middleware. We need the error json to show the message and stack properties
 * but these are hidden in json by default, so we add them to another object for json.stringify()
 * @param err
 * @param req
 * @param res
 * @param next
 */

module.exports = function(options) {

  const defaults = {showStack: false};
  const opts = _.merge(defaults, options)

  return function (err, req, res, next) {
    let obj = {}, statusCode;
    // mongoose validation error
    if (err.name === 'ValidationError' && err.errors) {
      obj.name = 'MongooseValidationError';
      obj.message = err.message;
      obj.data = err.errors;
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
        obj.data = _.clone(obj);
      }
    }
    obj.data.url = `${req.method} - ${statusCode}  ${req.url}`
    console.error(obj);
    res.status(statusCode).send(obj);
  };

}


