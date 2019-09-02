import {injectable} from 'inversify';
import _ from 'lodash';
import UploadController from '../../../../lib/base-classes/upload-controller';
import CorpAdjustmentsUploadTemplate from './template';
import CorpAdjustmentsUploadImport from './import';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import AnyObj from '../../../../../shared/models/any-obj';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import PgLookupRepo from '../../../pg-lookup/repo';
import CorpAdjustmentsUploadRepo from '../../corp-adjustments-upload/repo';
import DeptUploadImport from '../dept/import';
import DatabaseController from '../../../database/controller';
import { SyncMap } from '../../../../../shared/models/sync-map';
@injectable()
export default class CorpAdjustmentsUploadUploadController extends UploadController {
  imports: AnyObj[];

  constructor(
    repo: CorpAdjustmentsUploadRepo,
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
    this.uploadName = 'Corp Adjustments Upload';

    this.PropNames = {
      salesCountryName: 'Country Name',
      salesTerritoryCode: 'Sales Territory Code',
      scmsValue: 'SCMS Value'
    };
  }

  getValidationAndImportData() {
    return Promise.all([
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_iso_country', 'iso_country_name'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_coverage_code'),
    ])
      .then(results => {
        this.data.countryNames = results[0];
        this.data.salesTerritoryCodes = results[1];
        this.data.salesCoverageCodes = results[2];
      });
  }

  validateRow1(row) {
    this.temp = new CorpAdjustmentsUploadTemplate(row);
    return Promise.all([
      this.validateCountryName(),
      this.validateSalesTerritoryCode(),
      this.validateScmsValue()
    ])
      .then(() => this.lookForErrors());
  }

  validate() {
    // first check if duplicates in the data they're uploading
    this.imports = this.rows1.map(row => new CorpAdjustmentsUploadImport(row, this.fiscalMonth));
    const obj = {};
    this.imports.forEach((val: CorpAdjustmentsUploadImport) => {
      if (obj[val.salesCountryName.toUpperCase()]) {
        this.addErrorMessageOnly(val.salesCountryName);
      } else {
        obj[val.salesCountryName.toUpperCase()] = true;
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Duplicate Country Name entries in your upload', this.errors));
    }

    return Promise.resolve();
  }

  getImportArray() {
    // we already put the imports together in validate() so just use them
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports: CorpAdjustmentsUploadImport[]) {
    return this.repo.removeMany({});
  }

  validateCountryName() {
    if (!this.temp.salesCountryName) {
      this.addErrorRequired(this.PropNames.salesCountryName);
    } else if (this.notExists(this.data.countryNames, this.temp.salesCountryName)) {
      this.addErrorInvalid(this.PropNames.salesCountryName, this.temp.salesCountryName);
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

