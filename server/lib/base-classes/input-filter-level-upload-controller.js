const UploadController = require('./upload-controller'),
  PostgresRepo = require('../database/repos/postgres-repo'),
  _ = require('lodash'),
  SubmeasureRepo = require('../../api/pft/submeasure/repo'),
  UserRoleRepo = require('../database/repos/user-role-repo');


const userRoleRepo = new UserRoleRepo();
const pgRepo = new PostgresRepo();
const submeasureRepo = new SubmeasureRepo();

module.exports = class InputFilterLevelUploadController extends UploadController {
  constructor(repo) {
    super(repo);
    this.getValidationData();
  }

  getValidationData() {
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
      pgRepo.getSortedUpperListFromColumn('vw_fds_sales_hierarchy', 'l6_sales_territory_name_code')
    ])
      .then(results => {
        this.userRoles = results[0];
        this.submeasures = results[1];
        this.product = {
          productFamilies: results[2],
          businessUnits: results[3],
          techGroups: results[4]
        };
        this.sales = {
          level1s: results[5],
          level2s: results[6],
          level3s: results[7],
          level4s: results[8],
          level5s: results[9],
          level6s: results[10]
        }
      })
  }

  validateProductValue() {
    let productLevel = this.submeasure.inputFilterLevel.productLevel;
    if (productLevel && !this.temp.inputProductValue) {
      this.addErrorRequiredForSubmeasure(this.PropNames.inputProductValue);
      return Promise.resolve();
    } else if (!productLevel && this.temp.inputProductValue) {
      this.addErrorNotAllowedForSubmeasure(this.PropNames.inputProductValue);
      return Promise.resolve();
    } else {
      // have value to check
      productLevel = productLevel.toUpperCase();
      if (productLevel === 'PF') {
        return pgRepo.checkForExistence('vw_fds_products', 'product_family_id', this.temp.inputProductValue)
          .then(exists => {
            if (!exists) {
              this.addErrorInvalid(this.PropNames.inputProductValue, this.temp.inputProductValue);
            }
          })
      } else if (productLevel === 'BU') {
        return pgRepo.checkForExistence('vw_fds_products', 'business_unit_id', this.temp.inputProductValue)
          .then(exists => {
            if (!exists) {
              this.addErrorInvalid(this.PropNames.inputProductValue, this.temp.inputProductValue);
            }
          })
      } else if (productLevel === 'TG') {
        return pgRepo.checkForExistence('vw_fds_products', 'technology_group_id', this.temp.inputProductValue)
          .then(exists => {
            if (!exists) {
              this.addErrorInvalid(this.PropNames.inputProductValue, this.temp.inputProductValue);
            }
          })
      }
    }
  }

  validateSalesValue() {
    let salesLevel = this.submeasure.inputFilterLevel.salesLevel;
    if (salesLevel && !this.temp.inputSalesValue) {
      this.addErrorRequiredForSubmeasure(this.PropNames.inputSalesValue);
      return Promise.resolve();
    } else if (!salesLevel && this.temp.inputSalesValue) {
      this.addErrorNotAllowedForSubmeasure(this.PropNames.inputSalesValue);
      return Promise.resolve();
    } else {
      // have value to check
      salesLevel = salesLevel.toUpperCase();
      if (salesLevel === 'LEVEL1') {
        return pgRepo.checkForExistence('vw_fds_sales_hierarchy', 'l1_sales_territory_name_code', this.temp.inputSalesValue)
          .then(exists => {
            if (!exists) {
              this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
            }
          })
      } else if (salesLevel === 'LEVEL2') {
        return pgRepo.checkForExistence('vw_fds_sales_hierarchy', 'l2_sales_territory_name_code', this.temp.inputSalesValue)
          .then(exists => {
            if (!exists) {
              this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
            }
          })
      } else if (salesLevel === 'LEVEL3') {
        return pgRepo.checkForExistence('vw_fds_sales_hierarchy', 'l3_sales_territory_name_code\n', this.temp.inputSalesValue)
          .then(exists => {
            if (!exists) {
              this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
            }
          })
      } else if (salesLevel === 'LEVEL4') {
        return pgRepo.checkForExistence('vw_fds_sales_hierarchy', 'l4_sales_territory_name_code\n', this.temp.inputSalesValue)
          .then(exists => {
            if (!exists) {
              this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
            }
          })
      } else if (salesLevel === 'LEVEL5') {
        return pgRepo.checkForExistence('vw_fds_sales_hierarchy', 'l5_sales_territory_name_code\n', this.temp.inputSalesValue)
          .then(exists => {
            if (!exists) {
              this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
            }
          })
      } else if (salesLevel === 'LEVEL6') {
        return pgRepo.checkForExistence('vw_fds_sales_hierarchy', 'l6_sales_territory_name_code\n', this.temp.inputSalesValue)
          .then(exists => {
            if (!exists) {
              this.addErrorInvalid(this.PropNames.inputSalesValue, this.temp.inputSalesValue);
            }
          })
      }
    }
  }

  validateGrossUnbilledAccruedRevenueFlag() {
    if (!_.includes([undefined, 'Y', 'N'], this.temp.grossUnbilledAccruedRevenueFlag)) {
      this.addError(this.PropNames.grossUnbilledAccruedRevenueFlag, 'Invalid value, must be: Y/N/NULL');
    }
    return Promise.resolve();
  }

  validatLegalEntityValue() {
    return Promise.resolve();
  }

  validateSCMSSegment() {
    return Promise.resolve();
  }

  validateAmount() {
    if (this.temp.amount === undefined || '') {
      this.addErrorRequired(this.PropNames.amount);
    } else if (Number.isNaN(Number(this.temp.amount))) {
      this.addError(this.PropNames.amount, 'Not a number');
    } else {
      this.temp.amount = Number(this.temp.amount);
    }
    return Promise.resolve();
  }

  validateRevenueClassification() {
    return Promise.resolve();
  }


}
