const util = require('../../../../lib/common/util');

module.exports = class ProductClassUploadTemplate {

  constructor(row) {
    this.submeasureName = String(row[0]);
    this.splitCategory = String(row[1]);
    this.splitPercentage = Number(row[2]);

    util.trimStringProperties(this);
  }

}
