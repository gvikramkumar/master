import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import CorpAdjustmentsUploadRepo from './repo';
import SubmeasureRepo from '../../common/submeasure/repo';
import {CorpAdjustmentsUploadPgRepo} from './pgrepo';
import _ from 'lodash';
import {svrUtil} from '../../../lib/common/svr-util';

@injectable()
export default class CorpAdjustmentsUploadController extends ControllerBase {
  constructor(
    repo: CorpAdjustmentsUploadRepo,
    pgRepo: CorpAdjustmentsUploadPgRepo,
    private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

}
