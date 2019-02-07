import {injectable} from 'inversify';
import {ControllerCallMethodBase} from '../../lib/base-classes/controller-call-method-base';
import {svrUtil} from '../../lib/common/svr-util';
import {getArtRoles} from '../../lib/middleware/add-sso-user';
import {ApiError} from '../../lib/common/api-error';


@injectable()
export default class UserController extends ControllerCallMethodBase {

  getUser(req, res, next) {
    res.json(req.user);
  }

  getEnv(req, res, next) {
    res.json(process.env.NODE_ENV || 'dev');
  }

  // temporary endpoint to determine staging ART issues
  getArtRoles(req, res, next) {
    getArtRoles(req.user.id)
      .then(roles => {
          if (!roles || roles.length === 0) {
            next(new ApiError(`No ART roles for user: ${req.user.id}`));
          } else {
            res.json({userId: req.user.id, roles});
          }
        });
  }

}

