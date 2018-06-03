

module.exports = class DollarUploadImport {

  constructor(row) {
    this.submeasureName = row[0];
    this.product = row[1];
    this.sales = row[2];
    this.grossUnbilledAccruedFlag = row[3];
    this.legalEntity = row[4];
    this.intBusinessEntity = row[5];
    this.scms = row[6];
    this.amount = row[7];
    this.dealId = row[8];
    this.revenueClassification = row[9];

    this.trimStrings();
  }

  trimStrings() {
    Object.keys(this).forEach(key => {
      if (typeof this[key] === 'string') {
        this[key] = this[key].trim();
      }
    })
  }

}
