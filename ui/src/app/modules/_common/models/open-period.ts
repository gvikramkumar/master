
export class OpenPeriod {
  constructor(moduleId?, fiscalMonth?) {
    this.moduleId = moduleId;
    this.fiscalMonth = fiscalMonth;
    this.openFlag = 'Y';
  }
  moduleId: number;
  fiscalMonth: number;
  openFlag: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

