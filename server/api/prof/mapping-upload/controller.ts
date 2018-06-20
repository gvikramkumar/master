import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import MappingUploadRepo from './repo';


@injectable()
export default class MappingUploadController extends ControllerBase {
  constructor(repo: MappingUploadRepo) {
    super(repo);
  }
}
