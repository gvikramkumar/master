const util = require('../../../../lib/common/util');

module.exports = class ProductClassUploadTemplate {

  constructor(row) {
    this.submeasureName = row[0];
    this.splitCategory = row[1];
    this.splitPercentage = row[2];

    util.trimStringProperties(this);
  }

}
