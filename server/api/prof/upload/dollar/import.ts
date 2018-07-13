import {svrUtil} from '../../../../lib/common/svr-util';

export default class DollarUploadImport {
  submeasureName: string;
  product: string;
  sales: string;
  grossUnbilledAccruedFlag: string;
  legalEntity: string;
  intBusinessEntity: string;
  scms: string;
  amount: number;
  dealId: string;
  revenueClassification: string;
  fiscalMonth: number;

  constructor(row, fiscalMonth) {
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
    this.fiscalMonth = fiscalMonth;

    svrUtil.trimStringProperties(this);
  }

}
