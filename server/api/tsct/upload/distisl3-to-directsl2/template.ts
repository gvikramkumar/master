import {svrUtil} from '../../../../lib/common/svr-util';

export default class DistiSl3DirectSl2MapUploadTemplate {
  driverSl2Code: string;
  sourceSl3Code: string;
  externalTheater: string;

  constructor(row) {
    this.driverSl2Code = row[0] && String(row[0]);
    this.sourceSl3Code = row[1] && String(row[1]);
    this.externalTheater = row[2] && String(row[2]);

    svrUtil.trimStringProperties(this);
  }

}
