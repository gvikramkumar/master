const UploadController = require('./upload-controller'),
  PostgresRepo = require('../database/repos/postgres-repo'),
  _ = require('lodash'),
  SubmeasureRepo = require('../../api/pft/submeasure/repo'),
  UserRoleRepo = require('../database/repos/user-role-repo'),
  LookupRepo = require('../../api/common/lookup/repo');


const userRoleRepo = new UserRoleRepo();
const pgRepo = new PostgresRepo();
const submeasureRepo = new SubmeasureRepo();
const lookupRepo = new LookupRepo();

module.exports = class InputFilterLevelUploadController extends UploadController {
  constructor(repo) {
    super(repo);
    this.data = {};
  }

  // IMPORTANT: we use a lodash binary search on these values, so all values need to be upper case and
  // "sorted by lodash", i.e. can't rely on anyone else to sort as any disagreements
  // (say sorting by postgres with orderby clause), will result in failures. Originally had been using postgres
  // to sort, but after noticing failures... had to go with lodash to keep in sync, that or toss the binary search
  // which probably speeds things up immensely.
  getInputFilterLevelValidationData() {
    return Promise.all([
      userRoleRepo.getRolesByUserId(),
      submeasureRepo.getMany(),
      pgRepo.getSortedUpperListFromColumn('vw_fds_products', 'product_family_id'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_products', 'business_unit_id'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_products', 'technology_group_id'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_sales_hierarchy', 'l1_sales_territory_name_code'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_sales_hierarchy', 'l2_sales_territory_name_code'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_sales_hierarchy', 'l3_sales_territory_name_code'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_sales_hierarchy', 'l4_sales_territory_name_code'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_sales_hierarchy', 'l5_sales_territory_name_code'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_sales_hierarchy', 'l6_sales_territory_name_code'),
      //todo: fix this location:
      Promise.resolve(['LEGAL ENTITY VALUE']), //todo: this doesn't exits yet: pgRepo.getSortedUpperListFromColumn('business_entity', 'business_entity_name'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_be_hierarchy', 'bk_business_entity_name'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_be_hierarchy', 'bk_sub_business_entity_name'),
      lookupRepo.getTextValuesByTypeandSortedUpperCase('revenue_classification'),
      pgRepo.getSortedUpperListFromColumn('vw_fds_sales_hierarchy', 'sales_coverage_code')
    ])
      .then(results => {
        this.data.userRoles = results[0];
        this.data.submeasures = results[1];
        this.data.product = {
          productFamilies: results[2],
          businessUnits: results[3],
          techGroups: results[4]
        };
        this.data.sales = {
          level1s: results[5],
          level2s: results[6],
          level3s: results[7],
          level4s: results[8],
          level5s: results[9],
          level6s: results[10]
        };
        this.data.legalEntities = results[11];
        this.data.businessEntity = {
          internalBe: results[12],
          internalSubBe: results[13]
        };
        this.data.revClassifications = results[14];
        this.data.scms = results[15];
      })
  }

  getSubmeasure() {
    this.submeasure = _.find(this.data.submeasures, {name: this.temp.submeasureName});
    return Promise.resolve();
  }

  validateSubmeasureName() {
    if (!this.temp.submeasureName) {
      this.addErrorRequired(this.PropNames.submeasureName);
    } else if (!this.submeasure) {
      this.addError(this.PropNames.submeasureName, 'No Sub Measure exists by this name');
    }
    return Promise.resolve();
  }

  validateMeasureAccess() {
    // todo: requires onramp table, this is a temporary placeholder
    /*
        return userRoleRepo.userHasRole(this.req.user.id, this.submeasure.measureName)
          .then(hasRole => {
            if (!hasRole) {
              this.addError('', 'Not authorized for this upload.');
            }
          });
    */
    // need to check this with cached data
  }

  validateInputProductValue() {
    let productLevel = this.submeasure.inputFilterLevel.productLevel.toUpperCase();
    if (productLevel && !this.temp.inputProductValue) {
      this.addErrorRequiredForSubmeasure(this.PropNames.inputProductValue);
    } else if (!productLevel && this.temp.inputProductValue) {
      this.addErrorNotAllowedForSubmeasure(this.PropNames.inputProductValue);
    } else {
      productLevel = productLevel.toUpperCase();
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
  }

  validateInputSalesValue() {
    let salesLevel = this.submeasure.inputFilterLevel.salesLevel.toUpperCase();
    if (salesLevel && !this.temp.inputSalesValue) {
      this.addErrorRequiredForSubmeasure(this.PropNames.inputSalesValue);
    } else if (!salesLevel && this.temp.inputSalesValue) {
      this.addErrorNotAllowedForSubmeasure(this.PropNames.inputSalesValue);
    } else {
      salesLevel = salesLevel.toUpperCase();
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
  }

  validateGrossUnbilledAccruedRevenueFlag() {
    if (!_.includes([undefined, 'Y', 'N'], this.temp.grossUnbilledAccruedRevenueFlag)) {
      this.addErrorInvalid(this.PropNames.grossUnbilledAccruedRevenueFlag,
        this.temp.grossUnbilledAccruedRevenueFlag, 'Y/N/NULL');
    }
    return Promise.resolve();
  }

  validateInputLegalEntityValue() {
    let entityLevel = this.submeasure.inputFilterLevel.entityLevel.toUpperCase();
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
  }

  validateInputBusinessEntityValue() {
    let internalBELevel = this.submeasure.inputFilterLevel.internalBELevel.toUpperCase();
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
  }

  validateSCMSSegment() {
    let scmsLevel = this.submeasure.inputFilterLevel.scmsLevel.toUpperCase();
    if (scmsLevel && !this.temp.ScmsSegment) {
      this.addErrorRequiredForSubmeasure(this.PropNames.scmsSegment);
    } else if (!scmsLevel && this.temp.ScmsSegment) {
      this.addErrorNotAllowedForSubmeasure(this.PropNames.scmsSegment);
    } else {
      if (scmsLevel === 'SCMS') {
        if (this.notExists(this.data.scms, this.temp.ScmsSegment)) {
          this.addErrorInvalid(this.PropNames.scmsSegment, this.temp.ScmsSegment);
        }
      }
    }
  }

}
