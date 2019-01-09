
export class Submeasure {
  id?: string;
  submeasureId: number;
  submeasureKey: number;
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
  reportingLevels: string[] = [undefined, undefined, undefined];
  indicators = new Indicators();
  rules: string[] = [];
  groupingSubmeasureId: number;
  sourceSystemAdjTypeId: number;
  manualMixHw: number;
  manualMixSw: number;
  activeStatus = 'I';
  status = 'D';
  approvedOnce = 'N';
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
  // UI Only settings:
  approveRejectMessage?: string;
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
  manualMapping = 'N';
  groupFlag = 'N';
  retainedEarnings = 'N';
  transition = 'N';
  corpRevenue = 'Y';
  dualGaap = 'N';
  twoTier = 'N';
  service = 'N';
  deptAcct = 'N';
}
