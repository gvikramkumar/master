import {svrUtil} from '../../../../lib/common/svr-util';

export default class DeptUploadImport {
  submeasureName: string;
  nodeValue: string;
  glAccount: string;

  constructor(submeasureName, nodeValue, glAccount?) {
    this.submeasureName = submeasureName;
    this.nodeValue = nodeValue;
    this.glAccount = glAccount;

    svrUtil.trimStringProperties(this);
  }

}
