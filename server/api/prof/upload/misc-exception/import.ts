import {svrUtil} from '../../../../lib/common/svr-util';
import {shUtil} from '../../../../../shared/misc/shared-util';

export default class MiscExceptionUploadImport {
  
  salesNodeLevel2Code: string;
  scmsValue: string;
  salesTerritoryCode: string;
  fiscalMonth: number;
  
  constructor(row, fiscalMonth) {
    this.salesNodeLevel2Code = row[0] && String(row[0]);
    this.scmsValue = row[1] && String(row[1]);
    this.salesTerritoryCode = row[2] && String(row[2]);
    this.fiscalMonth = fiscalMonth;

    svrUtil.trimStringProperties(this);
  }

}
