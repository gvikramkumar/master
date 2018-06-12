const util = require('../../../../lib/common/util');

module.exports = class ProductClassUploadImport {

  constructor(row, fiscalMonth) {
    this.submeasureName = String(row[0]);
    this.splitCategory = String(row[1]);
    this.splitPercentage = Number(row[2]);
    this.fiscalMonth = fiscalMonth;

    util.trimStringProperties(this);
  }

}
