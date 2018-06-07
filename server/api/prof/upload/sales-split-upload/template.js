const util = require('../../../../lib/common/util');

module.exports = class SalesSplitUploadTemplate {

  constructor(row) {
    this.accountId = row[0];
    this.companyCode = row[1];
    this.salesTerritoryCode = row[2];
    this.splitPercentage = row[3];

    util.trimStringProperties(this);
  }

}
