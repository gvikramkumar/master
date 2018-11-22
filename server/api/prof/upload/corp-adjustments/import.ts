import {svrUtil} from '../../../../lib/common/svr-util';

export default class CorpAdjustmentsUploadImport {
  salesCountryName: string;
  salesTerritoryCode: string;
  scmsValue: string;
  fiscalMonth: number;

  constructor(row, fiscalMonth) {
    this.salesCountryName = row[0] && String(row[0]);
    this.salesTerritoryCode = row[1] && String(row[1]);
    this.scmsValue = row[2] && String(row[2]);
    this.fiscalMonth = fiscalMonth;

    svrUtil.trimStringProperties(this);
  }

}
