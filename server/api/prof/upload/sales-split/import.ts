import {svrUtil} from '../../../../lib/common/svr-util';

export default class SalesSplitUploadImport {
  accountId: string;
  companyCode: string;
  subaccountCode: string;
  salesTerritoryCode: string;
  splitPercentage: number;
  fiscalMonth: number;

  constructor(row, fiscalMonth) {
    this.fiscalMonth = fiscalMonth;
    this.accountId = row[0] && String(row[0]);
    this.companyCode = row[1] && String(row[1]);
    this.subaccountCode = row[2] && String(row[2]);
    this.salesTerritoryCode = row[3] && String(row[3]);
    this.splitPercentage = row[4] && svrUtil.truncateDecimal8(Number(row[4]));

    svrUtil.trimStringProperties(this);
  }

}
