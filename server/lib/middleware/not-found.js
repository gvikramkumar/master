const ApiError = require('../errors/api-error'),
  _ = require('lodash');

module.exports = function() {

  return function (req, res, next) {
    next(new ApiError('Endpoint not found.', {method: req.method, url: req.url}, 404));
  }
}

