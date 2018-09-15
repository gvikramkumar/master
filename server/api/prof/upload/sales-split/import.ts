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
    this.accountId = row[0];
    this.companyCode = row[1];
    this.subaccountCode = row[2];
    this.salesTerritoryCode = row[3];
    this.splitPercentage = row[4];

    svrUtil.trimStringProperties(this);
  }

}
