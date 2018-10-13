import {injectable} from 'inversify';
import {ControllerCallMethodBase} from '../../lib/base-classes/controller-call-method-base';
import {svrUtil} from '../../lib/common/svr-util';


@injectable()
export default class UserController extends ControllerCallMethodBase {

  getUser(req, res, next) {
    res.json(req.user);
  }

  isLocalEnv(req, res, next) {
    res.json(svrUtil.isLocalEnv());
  }

}

