import util from '../../../../lib/common/util';

export default class ProductClassUploadImport {
  submeasureName: string;
  splitCategory: string;
  splitPercentage: number;
  fiscalMonth: number;

  constructor(row, fiscalMonth) {
    this.submeasureName = String(row[0]);
    this.splitCategory = String(row[1]);
    this.splitPercentage = Number(row[2]);
    this.fiscalMonth = fiscalMonth;

    util.trimStringProperties(this);
  }

}
