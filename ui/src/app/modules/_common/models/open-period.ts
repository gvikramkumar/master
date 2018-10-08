
export class OpenPeriod {
  id?: string;
  moduleId: number;
  fiscalMonth: number;
  openFlag = 'Y';
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;

  constructor(moduleId?, fiscalMonth?) {
    this.moduleId = moduleId;
    this.fiscalMonth = fiscalMonth;
  }
}

