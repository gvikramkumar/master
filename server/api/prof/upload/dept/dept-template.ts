import {svrUtil} from '../../../../lib/common/svr-util';

export default class DeptUploadDeptTemplate {
  submeasureName: string;
  nodeValue: string;

  constructor(row) {
    this.submeasureName = row[0];
    this.nodeValue = row[1];

    svrUtil.trimStringProperties(this);
  }

}
