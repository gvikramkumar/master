import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import ProductClassUploadRepo from './repo';


@injectable()
export default class ProductClassUploadController extends ControllerBase {
  constructor(repo: ProductClassUploadRepo) {
    super(repo);
  }
}
