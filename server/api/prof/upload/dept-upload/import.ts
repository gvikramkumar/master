import util from '../../../../lib/common/util';

export default class DeptUploadImport {
  submeasureName: string;
  nodeValue: string;
  glAccount: string;

  constructor(submeasureName, nodeValue, glAccount?) {
    this.submeasureName = submeasureName;
    this.nodeValue = nodeValue;
    this.glAccount = glAccount;

    util.trimStringProperties(this);
  }

}
