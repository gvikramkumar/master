import {svrUtil} from '../../../../lib/common/svr-util';

export default class DeptUploadImport {
  submeasureName: string;
  nodeValue: string;
  glAccount: string;
  temp: string;

  constructor(submeasureName, nodeValue, temp, glAccount?) {
    this.submeasureName = submeasureName;
    this.nodeValue = nodeValue;
    this.temp = temp;
    this.glAccount = glAccount;

    svrUtil.trimStringProperties(this);
  }

}
