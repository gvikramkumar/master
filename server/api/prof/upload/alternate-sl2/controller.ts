import {injectable} from 'inversify';
import * as _ from 'lodash';
import UploadController from '../../../../lib/base-classes/upload-controller';
import AlternateSl2UploadRepo from '../../alternate-sl2-upload/repo';
import AlternateSl2UploadTemplate from './template';
import AlternateSl2UploadImport from './import';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import AnyObj from '../../../../../shared/models/any-obj';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import PgLookupRepo from '../../../pg-lookup/repo';
import DeptUploadImport from '../dept/import';

@injectable()
export default class AlternateSl2UploadUploadController extends UploadController {
  imports: AnyObj[];

  constructor(
    repo: AlternateSl2UploadRepo,
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
      alternateSl2Code: 'Alternate SL2',
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
        this.data.alternateSl2Uploads = results[2];
      });
  }

  validateRow1(row) {
    this.temp = new AlternateSl2UploadTemplate(row);
    return Promise.all([
      this.validateActualSl2Code(),
      this.validateAlternateSl2Code(),
      this.validateAlternateCountryName()
    ])
      .then(() => this.lookForErrors());
  }

  validate() {
    // first check if duplicates in the data they're uploading
    const NO_COUNTRY_VALUE = 'NO_COUNTRY_VALUE';
    this.imports = this.rows1.map(row => new AlternateSl2UploadImport(row, this.fiscalMonth));
    const obj = {};
    this.imports.forEach((val: AlternateSl2UploadImport) => {
      const arr = _.get(obj, `${val.actualSl2Code.toUpperCase()}.${val.alternateSl2Code.toUpperCase()}`);
      const entry = (val.alternateCountryName && val.alternateCountryName.toUpperCase()) || NO_COUNTRY_VALUE;
      if (arr) {
        if (arr.indexOf(entry) !== -1) {
          this.addErrorMessageOnly(`${val.actualSl2Code} / ${val.alternateSl2Code} / ${val.alternateCountryName}`);
        } else {
          arr.push(entry);
        }
      } else {
        _.set(obj, `${val.actualSl2Code.toUpperCase()}.${val.alternateSl2Code.toUpperCase()}`, [entry]);
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Duplicate Actual SL2/Alternate SL2/Alternate Country entries', this.errors));
    }

    return Promise.resolve();
  }

  getImportArray() {
    // we already put the imports together in validate() so just use them
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports: AlternateSl2UploadImport[]) {
    const duplicates = _.uniqWith(imports, (a, b) => a.actualSl2Code === b.actualSl2Code && a.alternateSl2Code === b.alternateSl2Code)
      .map(x => _.pick(x, ['actualSl2Code', 'alternateSl2Code']))
    return this.repo.bulkRemove(duplicates);
  }

  validateActualSl2Code() {
    if (!this.temp.actualSl2Code) {
      this.addErrorRequired(this.PropNames.actualSl2Code);
    } else if (this.notExists(this.data.salesTerritoryNameCodes, this.temp.actualSl2Code)) {
      this.addErrorInvalid(this.PropNames.actualSl2Code, this.temp.actualSl2Code);
    }
    return Promise.resolve();
  }

  validateAlternateSl2Code() {
    if (!this.temp.alternateSl2Code) {
      this.addErrorRequired(this.PropNames.alternateSl2Code);
    } else if (this.notExists(this.data.salesTerritoryNameCodes, this.temp.alternateSl2Code)) {
      this.addErrorInvalid(this.PropNames.alternateSl2Code, this.temp.alternateSl2Code);
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

