
export class OpenPeriod {
  moduleId: number;
  fiscalMonth: number;
  openFlag: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;

  constructor(moduleId?, fiscalMonth?) {
    this.moduleId = moduleId;
    this.fiscalMonth = fiscalMonth;
    this.openFlag = 'Y';
  }
}

