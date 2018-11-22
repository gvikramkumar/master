import {svrUtil} from '../../../../lib/common/svr-util';

export default class AlternateSl2UploadTemplate {
  actualSl2Code: string;
  alternateSl2Code: string;
  alternateCountryName: string;

  constructor(row) {
    this.actualSl2Code = row[0] && String(row[0]);
    this.alternateSl2Code = row[1] && String(row[1]);
    this.alternateCountryName = row[2] && String(row[2]);

    svrUtil.trimStringProperties(this);
  }

}
