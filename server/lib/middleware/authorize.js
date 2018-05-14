const NamedApiError = require('../common/named-api-error');

module.exports = function(allowedRoles) {
  return (req, res, next) => {
    if (req.user.isAuthorized(allowedRoles)) {
      next();
    } else {
      const err = new NamedApiError('AuthorizationError', 'Not authorized', null, 401);
      next(err);
    }
  }
}

