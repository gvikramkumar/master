import {svrUtil} from '../../../../lib/common/svr-util';

export default class Distisl3ToDirectsl2UploadImport {
  driverSl2: string;
  sourceSl2: string;
  externalTheater: number;
  fiscalMonth: number;

  constructor(row, fiscalMonth) {
    this.driverSl2 = row[0] && String(row[0]);
    this.sourceSl2 = row[1] && String(row[1]);
    this.externalTheater = row[2] && Number(row[2]);
    this.fiscalMonth = fiscalMonth;

    svrUtil.trimStringProperties(this);
  }

}
