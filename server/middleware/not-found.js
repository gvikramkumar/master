const ExtendedError = require('../errors/extended-error'),
  errorCodes = require('../errors/error-codes'),
  _ = require('lodash');

module.exports = function() {

  return function (req, res, next) {
    next(new ExtendedError('Endpoint not found.', {method: req.method, url: req.url},  errorCodes.server_prefix + errorCodes.server_endpoint_not_found, 404));
  }
}

