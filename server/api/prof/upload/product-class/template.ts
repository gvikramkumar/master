import {svrUtil} from '../../../../lib/common/svr-util';

export default class ProductClassUploadTemplate {
  submeasureName: string;
  splitCategory: string;
  splitPercentage: number;

  constructor(row) {
    this.submeasureName = String(row[0]);
    this.splitCategory = String(row[1]);
    this.splitPercentage = Number(row[2]);

    svrUtil.trimStringProperties(this);
  }

}
