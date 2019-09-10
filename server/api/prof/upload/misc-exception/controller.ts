import {injectable} from 'inversify';
import UploadController from '../../../../lib/base-classes/upload-controller';
import PgLookupRepo from '../../../pg-lookup/repo';
import MiscExceptionUploadTemplate from './template';
import _ from 'lodash';
import MiscExceptionUploadImport from './import';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import {svrUtil} from '../../../../lib/common/svr-util';
import {shUtil} from '../../../../../shared/misc/shared-util';
import DatabaseController from '../../../database/controller';
import { SyncMap } from '../../../../../shared/models/sync-map';
import AnyObj from '../../../../../shared/models/any-obj';
import MiscExceptionUploadRepo from '../../misc-exception-upload/repo';
@injectable()
export default class MiscExceptionUploadUploadController extends UploadController {
//imports: ScmsTriangulationUploadImport[];
imports: AnyObj[];
  constructor(
    repo: MiscExceptionUploadRepo,
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
    this.uploadName = 'Misc Exception Mapping';

    this.PropNames = {      
      salesNodeLevel2Code: 'Sales Level 2 Code',
      scmsValue: 'SCMS Value',
      salesTerritoryCode: 'Sales Territory Code'
    };
  }

  getValidationAndImportData() {
    return Promise.all([
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l2_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_coverage_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_territory_name_code')
    ])
      .then(results => {
        this.data.salesTerritoryNameCodes2 = results[0];
        this.data.salesCoverageCodes = results[1];
        this.data.salesTerritoryCodes = results[2];
      });
  }

  validateRow1(row) {
    this.temp = new MiscExceptionUploadTemplate(row);
    return Promise.all([
      this.validateProperty(this.temp, 'salesNodeLevel2Code', this.data.salesTerritoryNameCodes2, false),
      this.validateScmsValue(),
      this.validateSalesTerritoryCode()

      // this.validateProperty(this.temp, 'salesNodeLevel2Code', this.data.salesTerritoryNameCodes2, true),
      // this.validateProperty(this.temp, 'scmsValue', this.data.salesTerritoryNameCodes2, true),
      // this.validateProperty(this.temp, 'salesTerritoryCode', this.data.salesTerritoryNameCodes2, true)
      // this.validateScmsValue(),
      // this.validateSalesTerritoryCode()
    ])
      .then(() => this.lookForErrors());
  }

  validate() {
    // sort by submeasureName, add up splitPercentage, error if not 1.0
    this.imports = this.rows1.map(row => new MiscExceptionUploadImport(row));
    // const obj = {};
    // this.imports.forEach(val => {
    //   const productFamily = val.productFamily.toUpperCase();
    //   if (obj[productFamily] !== undefined) {
    //     obj[productFamily] += val.splitPercentage;
    //   } else {
    //     obj[productFamily] = val.splitPercentage;
    //   }
    // });
    // _.forEach(obj, (val, sl3) => {
    //   if (svrUtil.toFixed8(val) !== 1.0) {
    //     this.addError(`${sl3}`, val);
    //   }
    // });

    // if (this.errors.length) {
    //   return Promise.reject(new NamedApiError(this.UploadValidationError, 'Product Family percentage values not 100%', this.errors));
    // }
    return Promise.resolve();
  }

  getImportArray() {
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports: MiscExceptionUploadTemplate[]) {
    return this.repo.removeMany({});
  }

  validateSplitPercentage() {
    if (this.validatePercentageValue(this.PropNames.splitPercentage, this.temp.splitPercentage, true)) {
      this.temp.splitPercentage = Number(this.temp.splitPercentage);
    }
    return Promise.resolve();
  }
  validateSalesTerritoryCode() {
    if (!this.temp.salesTerritoryCode) {
      this.addErrorRequired(this.PropNames.salesTerritoryCode);
    } else if (this.notExists(this.data.salesTerritoryCodes, this.temp.salesTerritoryCode)) {
      this.addErrorInvalid(this.PropNames.salesTerritoryCode, this.temp.salesTerritoryCode);
    }
    return Promise.resolve();
  }
  validateScmsValue() {
    if (!this.temp.scmsValue) {
      this.addErrorRequired(this.PropNames.scmsValue);
    } else if (this.notExists(this.data.salesCoverageCodes, this.temp.scmsValue)) {
      this.addErrorInvalid(this.PropNames.scmsValue, this.temp.scmsValue);
    }
    return Promise.resolve();
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

