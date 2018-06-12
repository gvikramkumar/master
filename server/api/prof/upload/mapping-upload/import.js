const util = require('../../../../lib/common/util');

module.exports = class MappingUploadImport {

  constructor(row, fiscalMonth) {
    this.submeasureName = row[0];
    this.product = row[1];
    this.sales = row[2];
    this.legalEntity = row[3];
    this.intBusinessEntity = row[4];
    this.scms = row[5];
    this.percentage = row[6];
    this.fiscalMonth = fiscalMonth;

    util.trimStringProperties(this);
  }

}
