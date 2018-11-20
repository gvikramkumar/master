import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import CorpAdjustmentsUploadRepo from './repo';
import {DfaModuleIds} from '../../../../shared/enums';
import {ApiError} from '../../../lib/common/api-error';
import SubmeasureRepo from '../../common/submeasure/repo';
import {CorpAdjustmentsUploadPgRepo} from './pgrepo';
import * as _ from 'lodash';


@injectable()
export default class CorpAdjustmentsUploadController extends ControllerBase {
  constructor(
    repo: CorpAdjustmentsUploadRepo,
    pgRepo: CorpAdjustmentsUploadPgRepo,
    private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

}
