import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import Distisl3ToDirectsl2UploadRepo from './repo';
import {DfaModuleIds} from '../../../../shared/misc/enums';
import {ApiError} from '../../../lib/common/api-error';
import SubmeasureRepo from '../../common/submeasure/repo';
import {Distisl3ToDirectsl2UploadPgRepo} from './pgrepo';
import _ from 'lodash';


@injectable()
export default class Distisl3ToDirectsl2UploadController extends ControllerBase {
  constructor(
    repo: Distisl3ToDirectsl2UploadRepo,
    pgRepo: Distisl3ToDirectsl2UploadPgRepo,
    private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

}
