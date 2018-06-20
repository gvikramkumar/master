import {injectable} from 'inversify';
import DollarUploadRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';


@injectable()
export default class DollarUploadController extends ControllerBase {
  constructor(repo: DollarUploadRepo) {
    super(repo);
  }
}
