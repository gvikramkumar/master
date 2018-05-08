const ApiError = require('../common/api-error');

module.exports = function(allowedRoles) {
  return (req, res, next) => {
    if (req.user.isAuthorized(allowedRoles)) {
      next();
    } else {
      const err = new ApiError('Not authorized', null, 401);
      err.name = 'AuthorizationError';
      next(err);
    }
  }
}

