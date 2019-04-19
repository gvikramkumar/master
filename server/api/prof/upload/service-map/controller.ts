import {injectable} from 'inversify';
import UploadController from '../../../../lib/base-classes/upload-controller';
import PgLookupRepo from '../../../pg-lookup/repo';
import ServiceMapUploadTemplate from './template';
import * as _ from 'lodash';
import ServiceMapUploadImport from './import';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import ServiceMapUploadRepo from '../../service-map-upload/repo';
import {svrUtil} from '../../../../lib/common/svr-util';

@injectable()
export default class ServiceMapUploadUploadController extends UploadController {
imports: ServiceMapUploadImport[];

  constructor(
    repo: ServiceMapUploadRepo,
    private pgRepo: PgLookupRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo
    );
    this.uploadName = 'Service Mapping Upload';

    this.PropNames = {
      salesTerritoryCode: 'Sales Territory Code',
      salesNodeLevel1Code: 'Sales Level 1 Code',
      salesNodeLevel2Code: 'Sales Level 2 Code',
      salesNodeLevel3Code: 'Sales Level 3 Code',
      salesNodeLevel4Code: 'Sales Level 4 Code',
      salesNodeLevel5Code: 'Sales Level 5 Code',
      salesNodeLevel6Code: 'Sales Level 6 Code',
      businessEntity: 'Legal Entity',
      technologyGroup: 'Technology Group',
      businessUnit: 'Business Unit',
      productFamily: 'Product Family',
      splitPercentage: 'Split Percentage'
    };
  }

  getValidationAndImportData() {
    return Promise.all([
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_territory_name'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l1_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l2_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l3_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l4_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l5_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l6_sales_territory_name_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpadfa.dfa_business_entity', 'business_entity_name'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_products', 'technology_group_id'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_products', 'business_unit_id'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_products', 'product_family_id'),
    ])
      .then(results => {
        this.data.salesTerritoryNames = results[0];
        this.data.salesTerritoryNameCodes1 = results[1];
        this.data.salesTerritoryNameCodes2 = results[2];
        this.data.salesTerritoryNameCodes3 = results[3];
        this.data.salesTerritoryNameCodes4 = results[4];
        this.data.salesTerritoryNameCodes5 = results[5];
        this.data.salesTerritoryNameCodes6 = results[6];
        this.data.businessEntities = results[7];
        this.data.technologyGroups = results[8];
        this.data.businessUnits = results[9];
        this.data.productFamilies = results[10];
      });
  }

  validateRow1(row) {
    this.temp = new ServiceMapUploadTemplate(row);
    return Promise.all([
      this.validateProperty(this.temp, 'salesTerritoryCode', this.data.salesTerritoryNames, true),
      this.validateProperty(this.temp, 'salesNodeLevel1Code', this.data.salesTerritoryNameCodes1, false),
      this.validateProperty(this.temp, 'salesNodeLevel2Code', this.data.salesTerritoryNameCodes2, false),
      this.validateProperty(this.temp, 'salesNodeLevel3Code', this.data.salesTerritoryNameCodes3, false),
      this.validateProperty(this.temp, 'salesNodeLevel4Code', this.data.salesTerritoryNameCodes4, false),
      this.validateProperty(this.temp, 'salesNodeLevel5Code', this.data.salesTerritoryNameCodes5, false),
      this.validateProperty(this.temp, 'salesNodeLevel6Code', this.data.salesTerritoryNameCodes6, false),
      this.validateProperty(this.temp, 'businessEntity', this.data.businessEntities, true),
      this.validateProperty(this.temp, 'technologyGroup', this.data.technologyGroups, false),
      this.validateProperty(this.temp, 'businessUnit', this.data.businessUnits, false),
      this.validateProperty(this.temp, 'productFamily', this.data.productFamilies, false),
      this.validateSplitPercentage(),
    ])
      .then(() => this.lookForErrors());
  }

  validate() {
    // sort by submeasureName, add up splitPercentage, error if not 1.0
    this.imports = this.rows1.map(row => new ServiceMapUploadImport(row, this.fiscalMonth));
    const obj = {};
    this.imports.forEach(val => {
      const salesTerritoryCode = val.salesTerritoryCode.toUpperCase();
      const businessEntity = val.businessEntity.toUpperCase();
      if (obj[salesTerritoryCode] && obj[salesTerritoryCode][businessEntity] !== undefined) {
        obj[salesTerritoryCode][businessEntity] += val.splitPercentage;
      } else {
        obj[salesTerritoryCode] = {[businessEntity]: val.splitPercentage};
      }
    });
    _.forEach(obj, (obj1, salesTerr) => {
      _.forEach(obj1, (val, busEntity) => {
        if (svrUtil.truncateNumber8(val) !== 1.0) {
          this.addError(`${salesTerr} / ${busEntity}`, val);
        }
      });
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Sales Territory Code / Legal Entity  percentage values not 100%', this.errors));
    }
    return Promise.resolve();
  }

  getImportArray() {
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports: ServiceMapUploadImport[]) {
    const duplicates = _.uniqWith(imports, (a, b) => {
      return a.salesTerritoryCode === b.salesTerritoryCode &&
        a.businessEntity === b.businessEntity;
    })
      .map(x => _.pick(x, ['salesTerritoryCode', 'businessEntity']))
    return this.repo.bulkRemove(duplicates);
  }

  validateSplitPercentage() {
    if (this.validatePercentageValue(this.PropNames.splitPercentage, this.temp.splitPercentage, true)) {
      this.temp.splitPercentage = Number(this.temp.splitPercentage);
    }
    return Promise.resolve();
  }

}

