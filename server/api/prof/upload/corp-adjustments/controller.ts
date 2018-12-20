import {injectable} from 'inversify';
import * as _ from 'lodash';
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

@injectable()
export default class CorpAdjustmentsUploadUploadController extends UploadController {
  imports: AnyObj[];

  constructor(
    repo: CorpAdjustmentsUploadRepo,
    private pgRepo: PgLookupRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo
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
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_territory_descr'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_coverage_code'),
      this.repo.getMany({fiscalMonth: this.fiscalMonth})
    ])
      .then(results => {
        this.data.countryNames = results[0];
        this.data.salesTerritoryCodes = results[1];
        this.data.salesCoverageCodes = results[2];
        this.data.corpAdjustmentsUploads = results[3];
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
      const arr = _.get(obj, `${val.salesCountryName.toUpperCase()}.${val.salesTerritoryCode.toUpperCase()}`);
      const entry = val.scmsValue && val.scmsValue.toUpperCase();
      if (arr) {
        if (arr.indexOf(entry) !== -1) {
          this.addErrorMessageOnly(`${val.salesCountryName} / ${val.salesTerritoryCode} / ${val.scmsValue}`);
        } else {
          arr.push(entry);
        }
      } else {
        _.set(obj, `${val.salesCountryName.toUpperCase()}.${val.salesTerritoryCode.toUpperCase()}`, [entry]);
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Duplicate Country Name/Sales Territory Code/SCMS Value entries in your upload', this.errors));
    }

    return Promise.resolve();
  }

  getImportArray() {
    // we already put the imports together in validate() so just use them
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports: CorpAdjustmentsUploadImport[]) {
    const duplicates = _.uniqWith(imports, (a, b) => {
      return a.salesCountryName === b.salesCountryName &&
        a.salesTerritoryCode === b.salesTerritoryCode &&
        a.scmsValue === b.scmsValue;
    })
      .map(x => _.pick(x, ['salesCountryName', 'salesTerritoryCode', 'scmsValue']))
    return this.repo.bulkRemove(duplicates);
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

}

