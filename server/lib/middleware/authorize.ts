import {NamedApiError} from '../common/named-api-error';

export function authorize(allowedRoles) {
  return (req, res, next) => {
    if (req.user.isAuthorized(allowedRoles)) {
      next();
    } else {
      const err = new NamedApiError('AuthorizationError', 'Not authorized', undefined, 401);
      next(err);
    }
  }
}

