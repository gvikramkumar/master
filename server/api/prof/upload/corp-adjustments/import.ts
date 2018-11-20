import {svrUtil} from '../../../../lib/common/svr-util';

export default class CorpAdjustmentsUploadImport {
  actualSl2Code: string;
  corpAdjustmentsCode: string;
  alternateCountryName: string;
  fiscalMonth: number;

  constructor(row, fiscalMonth) {
    this.actualSl2Code = String(row[0]);
    this.corpAdjustmentsCode = String(row[1]);
    this.alternateCountryName = String(row[2]);
    this.fiscalMonth = fiscalMonth;

    svrUtil.trimStringProperties(this);
  }

}
