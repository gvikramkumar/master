import {svrUtil} from '../../../../lib/common/svr-util';

export default class DistiDirectUploadImport {
  groupId: number;
  nodeType: string;
  salesFinanceHierarchy: string;
  nodeCode: string;
  fiscalMonth: number;

  constructor(row, fiscalMonth) {
    this.groupId = row[0] && Number(row[0]);
    this.nodeType = row[1] && String(row[1]);
    this.salesFinanceHierarchy = row[2] && String(row[2]);
    this.nodeCode = row[3] && String(row[3]);
    this.fiscalMonth = fiscalMonth;

    if (this.nodeType.toLowerCase() === 'disti sl3') {
      this.nodeType = 'Disti SL3';
    } else if (this.nodeType.toLowerCase() === 'direct sl2') {
      this.nodeType = 'Direct SL2';

    if (this.salesFinanceHierarchy.toLowerCase() === 'sales fin hierarchy') {
      this.salesFinanceHierarchy = 'Sales Fin Hierarchy';
    }

    svrUtil.trimStringProperties(this);
  }

}
