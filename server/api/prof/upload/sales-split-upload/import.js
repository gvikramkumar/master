const util = require('../../../../lib/common/util');

module.exports = class SalesSplitUploadImport {

  constructor(row, fiscalMonth, subAccountCode) {
    this.accountId = row[0];
    this.companyCode = row[1];
    this.salesTerritoryCode = row[2];
    this.splitPercentage = row[3];
    this.fiscalMonth = fiscalMonth;
    this.subAccountCode = subAccountCode;

    util.trimStringProperties(this);
  }

}
