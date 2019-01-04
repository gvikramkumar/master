import {svrUtil} from '../../../../lib/common/svr-util';

export default class DistiDirectUploadTemplate {
  groupId: number;
  nodeType: string;
  salesFinanceHierarchy: string;
  nodeCode: string;

  constructor(row) {
    this.groupId = row[0] && Number(row[0]);
    this.nodeType = row[1] && String(row[1]);
    this.salesFinanceHierarchy = row[2] && String(row[2]);
    this.nodeCode = row[3] && String(row[3]);

    svrUtil.trimStringProperties(this);
  }

}
