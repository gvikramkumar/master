
export class AllocationRule {
  id?: string;
  moduleId?: number;
  name: string;
  desc?: string;
  period: string;
  driverName: string;
  salesMatch?: string;
  productMatch?: string;
  scmsMatch?: string;
  legalEntityMatch?: string;
  beMatch?: string;
  countryMatch?: string;
  extTheaterMatch?: string;
  sl1Select?: string;
  sl2Select?: string;
  sl3Select?: string;
  prodPFSelect?: string;
  prodBUSelect?: string;
  prodTGSelect?: string;
  scmsSelect?: string;
  beSelect?: string;
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
