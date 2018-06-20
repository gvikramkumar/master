import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import DeptUploadRepo from './repo';


@injectable()
export default class DeptUploadController extends ControllerBase {
  constructor(repo: DeptUploadRepo) {
    super(repo);
  }
}
