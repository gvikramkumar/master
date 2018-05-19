

module.exports = class DollarUploadImport {

  constructor(row) {
    this.submeasureName = row[0];
    this.inputProductValue = row[1];
    this.inputSalesValue = row[2];
    this.grossUnbilledAccruedRevFlg = row[3];
    this.inputEntityValue = row[4];
    this.inputBusinessValue = row[5];
    this.scmsValue = row[6];
    this.amount = row[7];
    this.dealId = row[8];
    this.revenueClassification = row[9];
  }

  /*
  // dollar_upload repo:
      measureName: String,
      submeasureName: String,
      inputProductValue: String,
      inputProductHierLevelId: Number,
      inputProductHierLevelName: String,
      inputEntityValue: String,
      inputEntityHierLevelId: Number,
      inputEntityHierLevelName: String,
      inputSalesValue: String,
      inputSalesHierLevelId: Number,
      inputSalesHierLevelName: String,
      scmsValue: String,
      scmsHierLevelId: Number,
      scmsHierLevelName: String,
      inputBusinessValue: String,
      inputBusinessHierLevelId: Number,
      inputBusinessHierLevelName: String,
      dealId: Number,
      grossUnbilledAccruedRevFlg: Boolean,
      revenueClassification: String,
      amount: Number,
*/

}
