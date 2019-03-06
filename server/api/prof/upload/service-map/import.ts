import {svrUtil} from '../../../../lib/common/svr-util';

export default class ServiceMapUploadImport {
  fiscalMonth: number;
  salesTerritoryCode: string;
  salesNodeLevel1Code: string;
  salesNodeLevel2Code: string;
  salesNodeLevel3Code: string;
  salesNodeLevel4Code: string;
  salesNodeLevel5Code: string;
  salesNodeLevel6Code: string;
  businessEntity: string;
  technologyGroup: string;
  businessUnit: string;
  productFamily: string;
  splitPercentage: number;

  constructor(row, fiscalMonth) {
    this.fiscalMonth = fiscalMonth;
    this.salesTerritoryCode = row[0] && String(row[0]);
    this.salesNodeLevel1Code = row[1] && String(row[1]);
    this.salesNodeLevel2Code = row[2] && String(row[2]);
    this.salesNodeLevel3Code = row[3] && String(row[3]);
    this.salesNodeLevel4Code = row[4] && String(row[4]);
    this.salesNodeLevel5Code = row[5] && String(row[5]);
    this.salesNodeLevel6Code = row[6] && String(row[6]);
    this.businessEntity = row[7] && String(row[7])
    this.technologyGroup = row[8] && String(row[8])
    this.businessUnit = row[9] && String(row[9])
    this.productFamily = row[10] && String(row[10])
    this.splitPercentage = row[11] && Number(row[11])

    svrUtil.trimStringProperties(this);
  }

}
