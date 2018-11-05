
export class AllocationRule {
  id?: string;
  moduleId?: number;
  name: string;
  period: string;
  driverName: string;
  salesMatch?: string;
  productMatch?: string;
  scmsMatch?: string;
  legalEntityMatch?: string;
  beMatch?: string;
  sl1Select?: string;
  salesSL1CritCond?: string;
  salesSL1CritChoices: string[] = [];
  salesSL2CritCond?: string;
  salesSL2CritChoices: string[] = [];
  salesSL3CritCond?: string;
  salesSL3CritChoices: string[] = [];
  prodPFSelect?: string;
  prodPFCritCond?: string;
  prodPFCritChoices: string[] = [];
  prodBUSelect?: string;
  prodBUCritCond?: string;
  prodBUCritChoices: string[] = [];
  prodTGSelect?: string;
  prodTGCritCond?: string;
  prodTGCritChoices: string[] = [];
  scmsSelect?: string;
  scmsCritCond?: string;
  scmsCritChoices: string[] = [];
  beSelect?: string;
  beCritCond?: string;
  beCritChoices: string[] = [];
  activeStatus = 'I';
  status = 'D';
  approvedOnce = 'N';
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
  // UI Only settings:
  approveRejectMessage = '';
}
