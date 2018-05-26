

module.exports = class DollarUploadImport {

  constructor(row) {
    this.submeasureName = row[0];
    this.data.product = row[1];
    this.data.sales = row[2];
    this.grossUnbilledAccruedFlag = row[3];
    this.legalEntity = row[4];
    this.intbusinessEntity = row[5];
    this.scms = row[6];
    this.amount = row[7];
    this.dealId = row[8];
    this.revenueClassification = row[9];
  }

}
