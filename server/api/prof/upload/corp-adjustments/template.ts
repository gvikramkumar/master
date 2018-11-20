import {svrUtil} from '../../../../lib/common/svr-util';

export default class CorpAdjustmentsUploadTemplate {
  actualSl2Code: string;
  corpAdjustmentsCode: string;
  alternateCountryName: string;

  constructor(row) {
    this.actualSl2Code = String(row[0]);
    this.corpAdjustmentsCode = String(row[1]);
    this.alternateCountryName = String(row[2]);

    svrUtil.trimStringProperties(this);
  }

}
