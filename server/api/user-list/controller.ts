import {injectable} from 'inversify';
import UserListRepo from './repo';
import ControllerBase from '../../lib/base-classes/controller-base';


@injectable()
export class UserListController extends ControllerBase {
  constructor(repo: UserListRepo) {
    super(repo);
  }

}

