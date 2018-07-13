import {svrUtil} from '../../../../lib/common/svr-util';

export default class SalesSplitUploadImport {
  accountId: string;
  companyCode: string;
  salesTerritoryCode: string;
  splitPercentage: number;
  subaccountCode: string;
  fiscalMonth: number;

  constructor(sale, subaccountCode, fiscalMonth) {
    this.accountId = sale.accountId;
    this.companyCode = sale.companyCode;
    this.salesTerritoryCode = sale.salesTerritoryCode;
    this.splitPercentage = sale.splitPercentage;
    this.subaccountCode = subaccountCode;
    this.fiscalMonth = fiscalMonth;

    svrUtil.trimStringProperties(this);
  }

}
