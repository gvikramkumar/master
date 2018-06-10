const SalesSplitUploadRepo = require('../../sales-split-upload/repo'),
  SalesSplitUploadTemplate = require('./template'),
  SalesSplitUploadImport = require('./import'),
  _ = require('lodash'),
  UploadController = require('../../../../lib/base-classes/upload-controller');

const repo = new SalesSplitUploadRepo();

module.exports = class SalesSplitUploadController extends UploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Sales Level Split Upload';

    this.PropNames = {
      accountId: 'Account ID',
      companyCode: 'Company Code',
      salesTerritoryCode: 'Sales Territory Code',
      splitPercentage: 'Percentage Value'
    }
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData(),
      // pgRepo.getSortedUpperListFromColumn('vw_fds_financial_account', 'financial_account_code'),
      // pgRepo.getSortedUpperListFromColumn('vw_fds_financial_department', 'company_code'),
      // pgRepo.getSortedUpperListFromColumn('vw_fds_sales_hierarchy', 'sales_territory_name_code')
    ])
      .then(results => {
        this.data.accountIds = ['123']; //results[1];
        this.data.companyCodes = ['456']; //results[2];
        this.data.salesTerritoryCodes = ['789']; // results[3];
      })
  }

  validateRow1(row) {
    this.temp = new SalesSplitUploadTemplate(row);
    return Promise.all([
      this.validateAccountId(),
      this.validateCompanyCode(),
      this.validateSalesTerritoryCode(),
      this.validateSplitPercentage(),
      this.lookForErrors()
    ]);
  }

  validate() {
    return Promise.resolve();
  }

  getSubaccountCodeDataFromUploadData() {
    return Promise.resolve([]);
  }

  getImportArray() {
    const imports = [];
    const sales = this.rows1.map(row => new SalesSplitUploadTemplate(row))

    // maybe this happens in getValidationAndImportData instead??
    // have no idea what the query looks like and pg table doesn't exist yet
    this.getSubaccountCodeDataFromUploadData(sales)
      .then(subaccts => {
        this.sales.forEach(sale => {
          _.sortBy(_.filter(subaccts, {
            accountId: sale.accountId,
            salesTerritoryCode: sale.salesTerritoryCode
          }), 'subaccountCode')
            .forEach(sa => {
              imports.push(new SalesSplitUploadImport(sale, this.fiscalMonth, sa.subaccountCode));
            })
        });
      })
    return Promise.resolve(imports);
  }

  validateAccountId() {
    if (!this.temp.accountId) {
      this.addErrorRequired(this.PropNames.accountId);
    } else if (this.notExists(this.data.accountIds, this.temp.accountId)) {
      this.addErrorInvalid(this.PropNames.accountId, this.temp.accountId);
    }
    return Promise.resolve();
  }

  validateCompanyCode() {
    if (this.temp.companyCode && this.notExists(this.data.companyCodes, this.temp.companyCode)) {
      this.addErrorInvalid(this.PropNames.companyCode, this.temp.companyCode);
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

  validateSplitPercentage() {
    if (this.validatePercentageValue(this.PropNames.splitPercentage, this.temp.splitPercentage, true)) {
      this.temp.splitPercentage = Number(this.temp.splitPercentage);
    }
    return Promise.resolve();
  }

}

