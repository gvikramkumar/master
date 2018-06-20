import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import SalesSplitUploadRepo from './repo';


@injectable()
export default class SalesSplitUploadController extends ControllerBase {
  constructor(repo: SalesSplitUploadRepo) {
    super(repo);
  }
}
