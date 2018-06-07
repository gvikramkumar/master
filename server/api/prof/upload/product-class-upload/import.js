const util = require('../../../../lib/common/util');

module.exports = class ProductClassUploadImport {

  constructor(row, fiscalMonth) {
    this.submeasureName = row[0];
    this.splitCategory = row[1];
    this.splitPercentage = row[2];
    this.fiscalMonth = fiscalMonth;

    util.trimStringProperties(this);
  }

}
