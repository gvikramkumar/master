
export class SubmeasureInputFilterLevel {
  productLevel: string;
  salesLevel: string;
  scmsLevel: string;
  internalBELevel: string;
  entityLevel: string;
  glSegLevel: string[] = [];
}

export class SubmeasureIndicators {
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
  allocationRequired = 'N';
  passThrough = 'N';
}

export class Submeasure {
  id?: string;
  moduleId?: number;
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
  inputFilterLevel = new SubmeasureInputFilterLevel();
  manualMapping = new SubmeasureInputFilterLevel();
  reportingLevels: string[] = [undefined, undefined, undefined];
  indicators = new SubmeasureIndicators();
  rules: string[] = [];
  groupingSubmeasureId: number;
  sourceSystemAdjTypeId: number;
  manualMixHw: number;
  manualMixSw: number;
  inputProductFamily: string;
  allocProductFamily: string;
  activeStatus = 'I';
  status = 'D';
  approvedOnce = 'N';
  approvalUrl?: string;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
  // UI Only settings:
  approveRejectMessage?: string;
}

