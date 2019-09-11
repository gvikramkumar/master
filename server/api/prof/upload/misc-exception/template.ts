import {svrUtil} from '../../../../lib/common/svr-util';

export default class MiscExceptionUploadTemplate {
  salesNodeLevel2Code: string;
  scmsValue: string;
  salesTerritoryCode: string;

  constructor(row) {
    this.salesNodeLevel2Code = row[0] && String(row[0]);
    this.scmsValue = row[1] && String(row[1]);
    this.salesTerritoryCode = row[2] && String(row[2]);

    svrUtil.trimStringProperties(this);
  }

}
