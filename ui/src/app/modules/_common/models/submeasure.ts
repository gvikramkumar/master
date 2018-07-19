
export class Submeasure {
  id?: string;
  name: string;
  desc: string;
  sourceId: number;
  measureId: number;
  startFiscalMonth: string;
  endFiscalMonth: string;
  processingTime: string;
  pnlnodeGrouping: string;
  categoryType: string;
  inputFilterLevel = new InputFilterLevel();
  manualMapping = new InputFilterLevel();
  reportingLevels: string[] = [];
  indicators = new Indicators();
  rules: string[] = [];
  status: string;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}

class InputFilterLevel {
  productLevel: string;
  salesLevel: string;
  scmsLevel: string;
  internalBELevel: string;
  entityLevel: string;
}

class Indicators {
  dollarUploadFlag: string;
  approveFlag: string;
  manualMapping = 'N';
  expenseSSOT: string;
  manualMix: string;
}
