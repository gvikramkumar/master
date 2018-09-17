import {svrUtil} from '../../../../lib/common/svr-util';

export default class SalesSplitUploadTemplate {
  accountId: string;
  companyCode: string;
  subaccountCode: string;
  salesTerritoryCode: string;
  splitPercentage: number;

  constructor(row) {
    this.accountId = row[0];
    this.companyCode = row[1];
    this.subaccountCode = row[2];
    this.salesTerritoryCode = row[3];
    this.splitPercentage = row[4];

    svrUtil.trimStringProperties(this);
  }

}
