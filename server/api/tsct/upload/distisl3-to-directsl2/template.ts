import {svrUtil} from '../../../../lib/common/svr-util';

export default class Distisl3ToDirectsl2UploadTemplate {
  submeasureName: string;
  splitCategory: string;
  splitPercentage: number;

  constructor(row) {
    this.submeasureName = row[0] && String(row[0]);
    this.splitCategory = row[1] && String(row[1]);
    this.splitPercentage = row[2] && Number(row[2]);

    svrUtil.trimStringProperties(this);
  }

}
