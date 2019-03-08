import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import ServiceMapUploadRepo from './repo';
import {ServiceMapUploadPgRepo} from './pgrepo';


@injectable()
export default class ServiceMapUploadController extends ControllerBase {
  constructor(repo: ServiceMapUploadRepo, pgRepo: ServiceMapUploadPgRepo) {
    super(repo, pgRepo);
  }
}
