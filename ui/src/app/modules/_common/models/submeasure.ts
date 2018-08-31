
export class Submeasure {
  id?: string;
  submeasureId: number;
  name: string;
  desc: string;
  sourceId: number;
  measureId: number;
  startFiscalMonth: string;
  endFiscalMonth: string;
  processingTime: string;
  pnlnodeGrouping: string;
  categoryType = 'HW';
  inputFilterLevel = new InputFilterLevel();
  manualMapping = new InputFilterLevel();
  reportingLevels: string[] = [undefined, undefined, undefined];
  indicators = new Indicators();
  rules: string[] = [];
  groupingSubmeasureId: number;
  status = 'I';
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
  dollarUploadFlag = 'N';
  approveFlag = 'N';
  manualMapping = 'N';
  expenseSSOT = 'N';
  manualMix = 'N';
  groupFlag = 'N';
  retainedEarnings = 'N';
  transition = 'N';
  corpRevenue = 'Y';
  dualGaap = 'N';
  twoTier = 'N';
  service = 'N';
}
