import {svrUtil} from '../../../../lib/common/svr-util';

export default class ProductClassUploadImport {
  submeasureName: string;
  splitCategory: string;
  splitPercentage: number;
  fiscalMonth: number;

  constructor(row, fiscalMonth) {
    this.submeasureName = row[0] && String(row[0]);
    this.splitCategory = row[1] && String(row[1]);
    this.splitPercentage = row[2] && svrUtil.truncateDecimal8(Number(row[2]));
    this.fiscalMonth = fiscalMonth;

    svrUtil.trimStringProperties(this);
  }

}
