import {svrUtil} from '../../../../lib/common/svr-util';

export default class MappingUploadImport {
  submeasureName: string;
  product: string;
  sales: string;
  legalEntity: string;
  intBusinessEntity: string;
  scms: string;
  percentage: number;
  fiscalMonth: number;

  constructor(row, fiscalMonth) {
    this.submeasureName = row[0] && String(row[0]);
    this.product = row[1] && String(row[1]);
    this.sales = row[2] && String(row[2]);
    this.legalEntity = row[3] && String(row[3]);
    this.intBusinessEntity = row[4] && String(row[4]);
    this.scms = row[5] && String(row[5]);
    this.percentage = row[6] && Number(row[6]);
    this.fiscalMonth = fiscalMonth;

    svrUtil.trimStringProperties(this);
  }

}
