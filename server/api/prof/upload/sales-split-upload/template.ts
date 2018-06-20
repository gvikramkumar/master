import util from '../../../../lib/common/util';

export default class SalesSplitUploadTemplate {
  accountId: string;
  companyCode: string;
  salesTerritoryCode: string;
  splitPercentage: number;

  constructor(row) {
    this.accountId = row[0];
    this.companyCode = row[1];
    this.salesTerritoryCode = String(row[2]);
    this.splitPercentage = Number(row[3]);

    util.trimStringProperties(this);
  }

}
