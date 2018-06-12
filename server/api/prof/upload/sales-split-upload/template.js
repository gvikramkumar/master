const util = require('../../../../lib/common/util');

module.exports = class SalesSplitUploadTemplate {

  constructor(row) {
    this.accountId = row[0];
    this.companyCode = row[1];
    this.salesTerritoryCode = String(row[2]);
    this.splitPercentage = Number(row[3]);

    util.trimStringProperties(this);
  }

}
