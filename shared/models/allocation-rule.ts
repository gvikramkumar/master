
export class AllocationRule {
  id?: string;
  moduleId?: number;
  name: string;
  oldName?: string;
  desc?: string;
  descQ?: string;
  period: string;
  driverName: string;
  salesMatch?: string;
  productMatch?: string;
  scmsMatch?: string;
  beMatch?: string;
  legalEntityMatch?: string;
  countryMatch?: string;
  extTheaterMatch?: string;
  glSegmentsMatch: string[] = [];
  sl1Select?: string;
  sl2Select?: string;
  sl3Select?: string;
  prodTGSelect?: string;
  prodBUSelect?: string;
  prodPFSelect?: string;
  scmsSelect?: string;
  beSelect?: string;
  salesSL1CritCond?: string;
  salesSL2CritCond?: string;
  salesSL3CritCond?: string;
  prodPFCritCond?: string;
  prodBUCritCond?: string;
  prodTGCritCond?: string;
  scmsCritCond?: string;
  // countryCritCond?: string;
  // countryCritChoices?: string[] = [];
  // externalTheaterCritCond?:string;
  // externalTheaterCritChoices?: string[] = [];
  beCritCond?: string;
  salesSL1CritChoices?: string[] = [];
  salesSL2CritChoices?: string[] = [];
  salesSL3CritChoices?: string[] = [];
  prodPFCritChoices?: string[] = [];
  prodBUCritChoices?: string[] = [];
  prodTGCritChoices?: string[] = [];
  scmsCritChoices?: string[] = [];
  beCritChoices?: string[] = [];
  countrySelect?: string;
  externalTheaterSelect?:string;
  activeStatus = 'I';
  status = 'D';
  approvedOnce = 'N';
  approvalUrl?: string;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
  // UI Only settings:
  approveRejectMessage = '';
}
