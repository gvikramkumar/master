import {injectable} from 'inversify';
import _ from 'lodash';
import UploadController from '../../../../lib/base-classes/upload-controller';
import Distisl3ToDirectsl2UploadRepo from '../../distisl3-to-directsl2-upload/repo';
import Distisl3ToDirectsl2UploadTemplate from './template';
import Distisl3ToDirectsl2UploadImport from './import';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import AnyObj from '../../../../../shared/models/any-obj';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import {svrUtil} from '../../../../lib/common/svr-util';
import DatabaseController from '../../../database/controller';
import { SyncMap } from '../../../../../shared/models/sync-map';
import PgLookupRepo from '../../../pg-lookup/repo';
@injectable()
export default class Distisl3ToDirectsl2UploadUploadController extends UploadController {
  imports: AnyObj[];

  constructor(
    repo: Distisl3ToDirectsl2UploadRepo,
    private pgRepo: PgLookupRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo,
    private databaseController: DatabaseController
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo
    );
    this.uploadName = 'Disty SL3 to Direct SL2 Mapping';

    this.PropNames = {
      driverSl2: 'Driver SL2',
      sourceSl2: 'Source SL3',
      externalTheater: 'External Theater'
    };
  }

  getValidationAndImportData() {
    return Promise.all([
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l2_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l3_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'dd_external_theater_name'),
    ])
      .then(results => {
        this.data.salesTerritoryNameCodes2 = results[0];
        this.data.salesTerritoryNameCodes3 = results[1];
        this.data.extTheaters = results[2];
      });
  }

  validateRow1(row) {
    this.temp = new Distisl3ToDirectsl2UploadTemplate(row);
    return Promise.all([
      this.validateProperty(this.temp, 'driverSl2', this.data.salesTerritoryNameCodes2, true),
      this.validateProperty(this.temp, 'sourceSl2', this.data.salesTerritoryNameCodes3, true),
      this.validateProperty(this.temp, 'externalTheater', this.data.extTheaters, false),
    ])
      .then(() => this.lookForErrors());
  }

  validate() {
    this.imports = this.rows1.map(row => new Distisl3ToDirectsl2UploadImport(row, this.fiscalMonth));
    return Promise.resolve();
  }

  getImportArray() {
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports: Distisl3ToDirectsl2UploadImport[]) {
    return this.repo.removeMany({});
  }

  autoSync(req) {
    return this.getImportArray()
      .then(imports => {
        const syncMap = new SyncMap();
        const data = {syncMap};
        return this.databaseController.mongoToPgSyncPromise(req.dfa, data, req.user.id);
      });
  }
}


