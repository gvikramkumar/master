import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import AlternateSl2UploadRepo from './repo';
import {DfaModuleIds} from '../../../../shared/misc/enums';
import {ApiError} from '../../../lib/common/api-error';
import SubmeasureRepo from '../../common/submeasure/repo';
import {AlternateSl2UploadPgRepo} from './pgrepo';
import _ from 'lodash';


@injectable()
export default class AlternateSl2UploadController extends ControllerBase {
  constructor(
    repo: AlternateSl2UploadRepo,
    pgRepo: AlternateSl2UploadPgRepo,
    private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

}
