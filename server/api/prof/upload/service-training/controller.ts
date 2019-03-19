import {injectable} from 'inversify';
import UploadController from '../../../../lib/base-classes/upload-controller';
import PgLookupRepo from '../../../pg-lookup/repo';
import ServiceTrainingUploadTemplate from './template';
import * as _ from 'lodash';
import ServiceTrainingUploadImport from './import';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import ServiceTrainingUploadRepo from '../../service-training-upload/repo';

@injectable()
export default class ServiceTrainingUploadUploadController extends UploadController {
imports: ServiceTrainingUploadImport[];

  constructor(
    repo: ServiceTrainingUploadRepo,
    private pgRepo: PgLookupRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo
    );
    this.uploadName = 'Service Training Upload';

    this.PropNames = {
      salesTerritoryCode: 'Sales Territory Code',
      salesNodeLevel3Code: 'Sales Level 3 Code',
      extTheaterName: 'External Theater',
      salesCountryName: 'Sales Country',
      productFamily: 'Product Family',
      splitPercentage: 'Split Percentage'
    };
  }

  getValidationAndImportData() {
    return Promise.all([
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_territory_name'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l3_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'dd_external_theater_name'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_iso_country', 'iso_country_name'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_products', 'product_family_id'),
    ])
      .then(results => {
        this.data.salesTerritoryNames = results[0];
        this.data.salesTerritoryNameCodes3 = results[1];
        this.data.extTheaters = results[2];
        this.data.salesCountries = results[3];
        this.data.productFamilies = results[4];
      });
  }

  validateRow1(row) {
    this.temp = new ServiceTrainingUploadTemplate(row);
    return Promise.all([
      this.validateProperty(this.temp, 'salesTerritoryCode', this.data.salesTerritoryNames, true),
      this.validateProperty(this.temp, 'salesNodeLevel3Code', this.data.salesTerritoryNameCodes3, true),
      this.validateProperty(this.temp, 'extTheaterName', this.data.extTheaters, false),
      this.validateProperty(this.temp, 'salesCountryName', this.data.salesCountries, false),
      this.validateProperty(this.temp, 'productFamily', this.data.productFamilies, false),
      this.validateSplitPercentage(),
    ])
      .then(() => this.lookForErrors());
  }

  validate() {
    // sort by submeasureName, add up splitPercentage, error if not 1.0
    this.imports = this.rows1.map(row => new ServiceTrainingUploadImport(row, this.fiscalMonth));
    const obj = {};
    this.imports.forEach(val => {
      const salesTerritoryCode = val.salesTerritoryCode.toUpperCase();
      const salesNodeLevel3Code = val.salesNodeLevel3Code.toUpperCase();
      if (obj[salesTerritoryCode] && obj[salesTerritoryCode][salesNodeLevel3Code] !== undefined) {
        obj[salesTerritoryCode][salesNodeLevel3Code] += val.splitPercentage;
      } else {
        obj[salesTerritoryCode] = {[salesNodeLevel3Code]: val.splitPercentage};
      }
    });
    _.forEach(obj, (obj1, salesTerr) => {
      _.forEach(obj1, (val, busEntity) => {
        if (val !== 1.0) {
          this.addError(`${salesTerr} / ${busEntity}`, val);
        }
      });
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Sales Territory Code / Sales Level 3 Code  percentage values not 100%', this.errors));
    }
    return Promise.resolve();
  }

  getImportArray() {
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports: ServiceTrainingUploadImport[]) {
    const duplicates = _.uniqWith(imports, (a, b) => {
      return a.salesTerritoryCode === b.salesTerritoryCode &&
        a.salesNodeLevel3Code === b.salesNodeLevel3Code;
    })
      .map(x => _.pick(x, ['salesTerritoryCode', 'salesNodeLevel3Code']))
    return this.repo.bulkRemove(duplicates);
  }

  validateSplitPercentage() {
    if (this.validatePercentageValue(this.PropNames.splitPercentage, this.temp.splitPercentage, true)) {
      this.temp.splitPercentage = Number(this.temp.splitPercentage);
    }
    return Promise.resolve();
  }

}

