import UploadController from './upload-controller';
import PgLookupRepo from '../../api/common/pg-lookup/repo';
import LookupRepo from '../../api/common/lookup/repo';
import {Modules} from '../../../shared/enums';
import SubmeasureRepo from '../../api/common/submeasure/repo';
import OpenPeriodPgRepo from '../../api/common/open-period/repo';
import UserRoleRepo from '../database/repos/user-role-repo';

const pgRepo = new PgLookupRepo();
const lookupRepo = new LookupRepo();

export default class InputFilterLevelUploadController extends UploadController {
data;

  constructor(
    moduleId,
    repo,
    openPeriodRepo: OpenPeriodPgRepo,
    submeasureRepo: SubmeasureRepo,
    userRoleRepo: UserRoleRepo
  ) {
    super(
      moduleId,
      repo,
      openPeriodRepo,
      submeasureRepo,
      userRoleRepo
      );
  }

  // IMPORTANT: we use a lodash binary search on these values, so all values need to be upper case and
  // "sorted by lodash", i.e. can't rely on anyone else to sort as any disagreements
  // (say sorting by postgres with orderby clause), will result in failures. Originally had been using postgres
  // to sort, but after noticing failures... had to go with lodash to keep in sync, that or toss the binary search
  // which probably speeds things up immensely.
  getValidationAndImportData(): Promise<any> {
    return Promise.all([
      super.getValidationAndImportData(),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_products', 'product_family_id'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_products', 'business_unit_id'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_products', 'technology_group_id'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l1_sales_territory_name_code'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l2_sales_territory_name_code'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l3_sales_territory_name_code'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l4_sales_territory_name_code'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l5_sales_territory_name_code'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l6_sales_territory_name_code'),
      // todo: fix this location:
      Promise.resolve(['LEGAL ENTITY VALUE']), // todo: this doesn't exits yet: pgRepo.getSortedUpperListFromColumn('business_entity', 'business_entity_name'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_be_hierarchy', 'bk_business_entity_name'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_be_hierarchy', 'bk_sub_business_entity_name'),
      lookupRepo.getTextValuesSortedUpperCase('revenue_classification'),
      pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_coverage_code')
    ])
      .then(results => {
        this.data.product = {
          productFamilies: results[1],
          businessUnits: results[2],
          techGroups: results[3]
        };
        this.data.sales = {
          level1s: results[4],
          level2s: results[5],
          level3s: results[6],
          level4s: results[7],
          level5s: results[8],
          level6s: results[9]
        };
        this.data.legalEntities = results[10];
        this.data.businessEntity = {
          internalBe: results[11],
          internalSubBe: results[12]
        };
        this.data.revClassifications = results[13];
        this.data.scms = results[14];
      })
  }

  validateInputProductValue() {
    const productLevel = this.submeasure.inputFilterLevel.productLevel &&
      this.submeasure.inputFilterLevel.productLevel.toUpperCase();
    if (productLevel && !this.temp.inputProductValue) {
      this.addErrorRequiredForSubmeasure(this.PropNames.inputProductValue);
    } else if (!productLevel && this.temp.inputProductValue) {
      this.addErrorNotAllowedForSubmeasure(this.PropNames.inputProductValue);
    } else {
      if (productLevel === 'PF') {
        if (this.notExists(this.data.product.productFamilies, this.temp.inputProductValue)) {
          this.addErrorInvalid(this.PropNames.inputProductValue, this.temp.inputProductValue);
        }
      } else if (productLevel === 'BU') {
        if (this.notExists(this.data.product.businessUnits, this.temp.inputProductValue)) {
          this.addErrorInvalid(this.PropNames.inputProductValue, this.temp.inputProductValue);
        }
      } else if (productLevel === 'TG') {
        if (this.notExists(this.data.product.techGroups, this.temp.inputProductValue)) {
          this.addErrorInvalid(this.PropNames.inputProductValue, this.temp.inputProductValue);
        }
      }
    }
    return Promise.resolve();
  }

  validateInputSalesValue() {
    const salesLevel = this.submeasure.inputFilterLevel.salesLevel &&
      this.submeasure.inputFilterLevel.salesLevel.toUpperCase();
    if (salesLevel && !this.temp.inputSalesValue) {
      this.addErrorRequiredForSubmeasure(this.PropNames.inputSalesValue);
    } else if (!salesLevel && this.temp.inputSalesValue) {
      this.addErrorNotAllowedForSubmeasure(this.PropNames.inputSalesValue);
    } else {
      if (salesLevel === 'LEVEL1') {
        if (this.notExists(this.data.sales.level1s, this.temp.inputSalesValue)) {
          this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
        }
      } else if (salesLevel === 'LEVEL2') {
        if (this.notExists(this.data.sales.level2s, this.temp.inputSalesValue)) {
          this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
        }
      } else if (salesLevel === 'LEVEL3') {
        if (this.notExists(this.data.sales.level3s, this.temp.inputSalesValue)) {
          this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
        }
      } else if (salesLevel === 'LEVEL4') {
        if (this.notExists(this.data.sales.level4s, this.temp.inputSalesValue)) {
          this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
        }
      } else if (salesLevel === 'LEVEL5') {
        if (this.notExists(this.data.sales.level5s, this.temp.inputSalesValue)) {
          this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
        }
      } else if (salesLevel === 'LEVEL6') {
        if (this.notExists(this.data.sales.level6s, this.temp.inputSalesValue)) {
          this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
        }
      }
    }
    return Promise.resolve();
  }

  validateInputLegalEntityValue() {
    const entityLevel = this.submeasure.inputFilterLevel.entityLevel &&
      this.submeasure.inputFilterLevel.entityLevel.toUpperCase();
    if (entityLevel && !this.temp.inputLegalEntityValue) {
      this.addErrorRequiredForSubmeasure(this.PropNames.inputLegalEntityValue);
    } else if (!entityLevel && this.temp.inputLegalEntityValue) {
      this.addErrorNotAllowedForSubmeasure(this.PropNames.inputLegalEntityValue);
    } else {
      if (entityLevel === 'BE') {
        if (this.notExists(this.data.legalEntities, this.temp.inputLegalEntityValue)) {
          this.addErrorInvalid(this.PropNames.inputLegalEntityValue, this.temp.inputLegalEntityValue);
        }
      }
    }
    return Promise.resolve();
  }

  validateInputBusinessEntityValue() {
    const internalBELevel = this.submeasure.inputFilterLevel.internalBELevel &&
      this.submeasure.inputFilterLevel.internalBELevel.toUpperCase();
    if (internalBELevel && !this.temp.inputBusinessEntityValue) {
      this.addErrorRequiredForSubmeasure(this.PropNames.inputBusinessEntityValue);
    } else if (!internalBELevel && this.temp.inputBusinessEntityValue) {
      this.addErrorNotAllowedForSubmeasure(this.PropNames.inputBusinessEntityValue);
    } else {
      if (internalBELevel === 'INTERNAL BE') {
        if (this.notExists(this.data.businessEntity.internalBe, this.temp.inputBusinessEntityValue)) {
          this.addErrorInvalid(this.PropNames.inputBusinessEntityValue, this.temp.inputBusinessEntityValue);
        }
      } else if (internalBELevel === 'INTERNAL SUB BE') {
        if (this.notExists(this.data.businessEntity.internalSubBe, this.temp.inputBusinessEntityValue)) {
          this.addErrorInvalid(this.PropNames.inputBusinessEntityValue, this.temp.inputBusinessEntityValue);
        }
      }
    }
    return Promise.resolve();
  }

  validateSCMSSegment() {
    const scmsLevel = this.submeasure.inputFilterLevel.scmsLevel &&
      this.submeasure.inputFilterLevel.scmsLevel.toUpperCase();
    if (scmsLevel && !this.temp.scmsSegment) {
      this.addErrorRequiredForSubmeasure(this.PropNames.scmsSegment);
    } else if (!scmsLevel && this.temp.scmsSegment) {
      this.addErrorNotAllowedForSubmeasure(this.PropNames.scmsSegment);
    } else {
      if (scmsLevel === 'SCMS') {
        if (this.notExists(this.data.scms, this.temp.scmsSegment)) {
          this.addErrorInvalid(this.PropNames.scmsSegment, this.temp.scmsSegment);
        }
      }
    }
    return Promise.resolve();
  }

}
