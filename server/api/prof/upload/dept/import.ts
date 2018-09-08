import {svrUtil} from '../../../../lib/common/svr-util';

export default class DeptUploadImport {
  fiscalMonth: number;
  submeasureName: string;
  nodeValue: string;
  glAccount: string;

  constructor(fiscalMonth, submeasureName, nodeValue, glAccount?) {
    this.fiscalMonth = fiscalMonth;
    this.submeasureName = submeasureName;
    this.nodeValue = nodeValue;
    this.glAccount = glAccount;

    svrUtil.trimStringProperties(this);
  }

}
