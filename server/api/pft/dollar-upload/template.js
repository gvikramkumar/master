
module.exports = class DollarUploadTemplate {
  constructor(row) {
    this.submeasureName = row[0];
    this.inputProductValue = row[1];
    this.inputSalesValue = row[2];
    this.grossUnbilledAccruedRevenueFlag = row[3];
    this.inputLegalEntityValue = row[4];
    this.inputBusinessEntityValue = row[5];
    this.ScmsSegment = row[6];
    this.amount = row[7];
    this.dealId = row[8];
    this.revenueClassification = row[9];
  }
}
