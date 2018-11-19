import {svrUtil} from '../../../../lib/common/svr-util';

export default class AlternateSl2UploadImport {
  actualSl2Code: string;
  alternateSl2Code: string;
  alternateCountryName: string;
  fiscalMonth: number;

  constructor(row, fiscalMonth) {
    this.actualSl2Code = String(row[0]);
    this.alternateSl2Code = String(row[1]);
    this.alternateCountryName = String(row[2]);
    this.fiscalMonth = fiscalMonth;

    svrUtil.trimStringProperties(this);
  }

}
