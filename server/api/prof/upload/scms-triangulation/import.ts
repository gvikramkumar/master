import {svrUtil} from '../../../../lib/common/svr-util';
import {shUtil} from '../../../../../shared/misc/shared-util';

export default class ScmsTriangulationUploadImport {
  fiscalYear: number;
  salesTerritoryCode: string;
  salesNodeLevel3Code: string;
  extTheaterName: string;
  salesCountryName: string;
  productFamily: string;
  splitPercentage: number;

  constructor(row, fiscalYear) {
    this.fiscalYear = fiscalYear;
    this.salesTerritoryCode = row[0] && String(row[0]);
    this.salesNodeLevel3Code = row[1] && String(row[1]);
    this.extTheaterName = row[2] && String(row[2]);
    this.salesCountryName = row[3] && String(row[3]);
    this.productFamily = (row[4] && String(row[4])) || 'TRAINING';
    this.splitPercentage = row[5] && Number(row[5]);

    svrUtil.trimStringProperties(this);
  }

}
