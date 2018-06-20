const util = require('../../../../lib/common/util');

export default class DollarUploadTemplate {
  submeasureName: string;
  inputProductValue: string;
  inputSalesValue: string;
  grossUnbilledAccruedRevenueFlag: string;
  inputLegalEntityValue: string;
  inputBusinessEntityValue: string;
  scmsSegment: string;
  amount: number;
  dealId: string;
  revenueClassification: string;

  constructor(row) {
    this.submeasureName = row[0];
    this.inputProductValue = row[1];
    this.inputSalesValue = row[2];
    this.grossUnbilledAccruedRevenueFlag = row[3];
    this.inputLegalEntityValue = row[4];
    this.inputBusinessEntityValue = row[5];
    this.scmsSegment = row[6];
    this.amount = row[7];
    this.dealId = row[8];
    this.revenueClassification = row[9];

    util.trimStringProperties(this);
  }

}
