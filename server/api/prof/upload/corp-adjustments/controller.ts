import {injectable} from 'inversify';
import * as _ from 'lodash';
import UploadController from '../../../../lib/base-classes/upload-controller';
import CorpAdjustmentsUploadRepo from '../../alternate-sl2-upload/repo';
import CorpAdjustmentsUploadTemplate from './template';
import CorpAdjustmentsUploadImport from './import';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import AnyObj from '../../../../../shared/models/any-obj';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import PgLookupRepo from '../../../common/pg-lookup/repo';

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
    this.uploadName = 'Alternate SL2 Upload';

    this.PropNames = {
      actualSl2Code: 'Actual SL2',
      corpAdjustmentsCode: 'Alternate SL2',
      alternateCountryName: 'Alternate Country'
    };
  }

  getValidationAndImportData() {
    return Promise.all([
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l2_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_iso_country', 'iso_country_name'),
      this.repo.getMany({fiscalMonth: this.fiscalMonth})
    ])
      .then(results => {
        this.data.salesTerritoryNameCodes = results[0];
        this.data.alternateCountryNames = results[1];
        this.data.corpAdjustmentsUploads = results[2];
      });
  }

  validateRow1(row) {
    this.temp = new CorpAdjustmentsUploadTemplate(row);
    return Promise.all([
      this.validateActualSl2Code(),
      this.validateCorpAdjustmentsCode(),
      this.validateAlternateCountryName()
    ])
      .then(() => this.lookForErrors());
  }

  validate() {
    // first check if duplicates in the data they're uploading
    const NO_COUNTRY_VALUE = 'NO_COUNTRY_VALUE';
    this.imports = this.rows1.map(row => new CorpAdjustmentsUploadImport(row, this.fiscalMonth));
    const obj = {};
    this.imports.forEach((val: CorpAdjustmentsUploadImport) => {
      const arr = _.get(obj, `${val.actualSl2Code}.${val.corpAdjustmentsCode}`);
      const entry = (val.alternateCountryName && val.alternateCountryName.toUpperCase()) || NO_COUNTRY_VALUE;
      if (arr) {
        if (arr.indexOf(entry) !== -1) {
          this.addErrorMessageOnly(`${val.actualSl2Code} / ${val.corpAdjustmentsCode} / ${val.alternateCountryName}`);
        } else {
          arr.push(entry);
        }
      } else {
        _.set(obj, `${val.actualSl2Code}.${val.corpAdjustmentsCode}`, [entry]);
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Duplicate Actual SL2/Alternate SL2/Alternate Country entries in your upload', this.errors));
    }

    // second check if duplicates in upload that are already in the database
    const dbVals = this.data.corpAdjustmentsUploads.map(doc => new CorpAdjustmentsUploadImport([doc.actualSl2Code, doc.corpAdjustmentsCode, doc.alternateCountryName], this.fiscalMonth));
    dbVals.forEach((val: CorpAdjustmentsUploadImport) => {
      const arr = _.get(obj, `${val.actualSl2Code}.${val.corpAdjustmentsCode}`);
      const entry = (val.alternateCountryName && val.alternateCountryName.toUpperCase()) || NO_COUNTRY_VALUE;
      if (arr) {
        if (arr.indexOf(entry) !== -1) {
          this.addErrorMessageOnly(`${val.actualSl2Code} / ${val.corpAdjustmentsCode} / ${val.alternateCountryName}`);
        } else {
          arr.push(entry);
        }
      } else {
        _.set(obj, `${val.actualSl2Code}.${val.corpAdjustmentsCode}`, [entry]);
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Duplicate Actual SL2/Alternate SL2/Alternate Country entries already in the database', this.errors));
    }

    return Promise.resolve();
  }

  getImportArray() {
    // we already put the imports together in validate() so just use them
    return Promise.resolve(this.imports);
  }

  validateActualSl2Code() {
    if (!this.temp.actualSl2Code) {
      this.addErrorRequired(this.PropNames.actualSl2Code);
    } else if (this.notExists(this.data.salesTerritoryNameCodes, this.temp.actualSl2Code)) {
      this.addErrorInvalid(this.PropNames.actualSl2Code, this.temp.actualSl2Code);
    }
    return Promise.resolve();
  }

  validateCorpAdjustmentsCode() {
    if (!this.temp.corpAdjustmentsCode) {
      this.addErrorRequired(this.PropNames.corpAdjustmentsCode);
    } else if (this.notExists(this.data.salesTerritoryNameCodes, this.temp.corpAdjustmentsCode)) {
      this.addErrorInvalid(this.PropNames.corpAdjustmentsCode, this.temp.corpAdjustmentsCode);
    }
    return Promise.resolve();
  }

  validateAlternateCountryName() {
    if (this.temp.alternateCountryName && this.notExists(this.data.alternateCountryNames, this.temp.alternateCountryName)) {
      this.addErrorInvalid(this.PropNames.alternateCountryName, this.temp.alternateCountryName);
    }
    return Promise.resolve();
  }

}

