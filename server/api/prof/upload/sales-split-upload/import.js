const util = require('../../../../lib/common/util');

module.exports = class SalesSplitUploadImport {

  constructor(sale, subaccountCode, fiscalMonth) {
    this.accountId = sale.accountId;
    this.companyCode = sale.companyCode;
    this.salesTerritoryCode = sale.salesTerritoryCode;
    this.splitPercentage = sale.splitPercentage;
    this.subaccountCode = subaccountCode;
    this.fiscalMonth = fiscalMonth;

    util.trimStringProperties(this);
  }

}
