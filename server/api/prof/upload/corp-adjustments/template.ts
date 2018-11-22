import {svrUtil} from '../../../../lib/common/svr-util';


export default class CorpAdjustmentsUploadTemplate {
  salesCountryName: string;
  salesTerritoryCode: string;
  scmsValue: string;

  constructor(row) {
    this.salesCountryName = row[0] && String(row[0]);
    this.salesTerritoryCode = row[1] && String(row[1]);
    this.scmsValue = row[2] && String(row[2]);

    svrUtil.trimStringProperties(this);
  }

}
