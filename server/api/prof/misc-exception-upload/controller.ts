import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import MiscExceptionUploadRepo from './repo';
import {MiscExceptionUploadPgRepo} from './pgrepo';


@injectable()
export default class MiscExceptionUploadController extends ControllerBase {
  constructor(repo: MiscExceptionUploadRepo, pgRepo: MiscExceptionUploadPgRepo) {
    super(repo, pgRepo);
  }

}
