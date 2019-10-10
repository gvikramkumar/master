
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
  beIpMatch?: string;
  legalEntityMatch?: string;
  countryMatch?: string;
  // countryIpMatch?: string;
  extTheaterMatch?: string;
  // extTheaterIpMatch?: string;
  glSegmentsMatch: string[] = [];
  glSegmentsIpMatch: string[] = [];
  sl1Select?: string;
  sl2Select?: string;
  sl3Select?: string;
  sl1IpCond?: string;
  sl2IpCond?: string;
  sl3IpCond?: string;
  prodTGSelect?: string;
  prodTGIpSelect?: string;
  prodBUSelect?: string;
  prodPFSelect?: string;
  scmsSelect?: string;
  scmsIpSelect?: string;
  beSelect?: string;
  beIpSelect?: string;
  salesSL1CritCond?: string;
  salesSL2CritCond?: string;
  salesSL3CritCond?: string;
  salesSL1IpCritCond?: string;
  salesSL2IpCritCond?: string;
  salesSL3IpCritCond?: string;
  prodPFCritCond?: string;
  prodBUCritCond?: string;
  prodTGCritCond?: string;
  prodTGIpCritCond?: string;
  scmsCritCond?: string;
  scmsIpCritCond?: string;
  sl1IpCritiriaSelect?: string;
  sl2IpCritiriaSelect?: string;
  sl3IpCritiriaSelect?: string;
  countryIpCritCond?: string;
  countryIpCritChoices?: string[] = [];
  externalTheaterIpCritCond?:string;
  externalTheaterIpCritChoices?: string[] = [];
  beCritCond?: string;
  beIpCritCond?: string;
  salesSL1CritChoices?: string[] = [];
  salesSL2CritChoices?: string[] = [];
  salesSL3CritChoices?: string[] = [];
  salesSL1IpCritChoices?: string[] = [];
  salesSL2IpCritChoices?: string[] = [];
  salesSL3IpCritChoices?: string[] = [];
  prodPFCritChoices?: string[] = [];
  prodBUCritChoices?: string[] = [];
  prodTGCritChoices?: string[] = [];
  prodTGIpCritChoices?: string[] = [];
  scmsCritChoices?: string[] = [];
  scmsIpCritChoices?: string[] = [];
  beCritChoices?: string[] = [];
  beIpCritChoices?: string[] = [];
  countrySelect?: string;
  countryIpSelect?: string;
  externalTheaterSelect?:string;
  externalTheaterIpSelect?:string;
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
