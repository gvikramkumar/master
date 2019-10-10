import {svrUtil} from '../../../../lib/common/svr-util';

export default class Distisl3ToDirectsl2UploadTemplate {
  driverSl2: string;
  sourceSl3: string;
  externalTheater: string;

  constructor(row) {
    this.driverSl2 = row[0] && String(row[0]);
    this.sourceSl3 = row[1] && String(row[1]);
    this.externalTheater = row[2] && String(row[2]);

    svrUtil.trimStringProperties(this);
  }

}
