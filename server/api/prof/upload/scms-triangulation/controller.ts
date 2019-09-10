import {injectable} from 'inversify';
import UploadController from '../../../../lib/base-classes/upload-controller';
import PgLookupRepo from '../../../pg-lookup/repo';
import ScmsTriangulationUploadTemplate from './template';
import _ from 'lodash';
import ScmsTriangulationUploadImport from './import';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import {svrUtil} from '../../../../lib/common/svr-util';
import {shUtil} from '../../../../../shared/misc/shared-util';
import DatabaseController from '../../../database/controller';
import { SyncMap } from '../../../../../shared/models/sync-map';
import AnyObj from '../../../../../shared/models/any-obj';
import ScmsTriangulationUploadRepo from '../../scms-triangulation-upload/repo';
@injectable()
export default class ScmsTriangulationUploadUploadController extends UploadController {
//imports: ScmsTriangulationUploadImport[];
imports: AnyObj[];
  constructor(
    repo: ScmsTriangulationUploadRepo,
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
    this.uploadName = 'Scms Triangulation Upload';

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
    this.temp = new ScmsTriangulationUploadTemplate(row);
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
    this.imports = this.rows1.map(row => new ScmsTriangulationUploadTemplate(row));
    const obj = {};
    this.imports.forEach(val => {
      const productFamily = val.productFamily.toUpperCase();
      if (obj[productFamily] !== undefined) {
        obj[productFamily] += val.splitPercentage;
      } else {
        obj[productFamily] = val.splitPercentage;
      }
    });
    _.forEach(obj, (val, sl3) => {
      if (svrUtil.toFixed8(val) !== 1.0) {
        this.addError(`${sl3}`, val);
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Product Family percentage values not 100%', this.errors));
    }
    return Promise.resolve();
  }

  getImportArray() {
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports: ScmsTriangulationUploadTemplate[]) {
    return this.repo.removeMany({});
  }

  validateSplitPercentage() {
    if (this.validatePercentageValue(this.PropNames.splitPercentage, this.temp.splitPercentage, true)) {
      this.temp.splitPercentage = Number(this.temp.splitPercentage);
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

