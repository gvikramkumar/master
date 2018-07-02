
export class Submeasure {
  id?: string;
  name: string;
  description: string;
  source: string;
  measureName: string;
  startFiscalMonth: string;
  endFiscalMonth: string;
  processingTime: string;
  pnlnodeGrouping: string;
  inputFilterLevel = new InputFilterLevel();
  manualMapping = new InputFilterLevel();
  reportingLevels: string[] = [];
  indicators = new Indicators();
  rules: string[] = [];

}

class InputFilterLevel {
  productLevel: string;
  salesLevel: string;
  scmsLevel: string;
  internalBElevel: string;
  entityLevel: string;
}

class Indicators {
  dollarUploadFlag: string;
  approveFlag: string;
  status: string;
  manualMapping: string;
  expenseSSOT: string;
  manualMix: string;
}
