import {injectable} from 'inversify';
import {ControllerCallMethodBase} from '../../../lib/base-classes/controller-call-method-base';


@injectable()
export default class UserController extends ControllerCallMethodBase {

  getUser(req, res, next) {
    res.json(req.user);
  }

}

