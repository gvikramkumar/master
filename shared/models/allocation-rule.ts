
export class AllocationRule {
  id?: string;
  name: string;
  period: string;
  driverName: string;
  salesMatch?: string;
  productMatch?: string;
  scmsMatch?: string;
  legalEntityMatch?: string;
  beMatch?: string;
  sl1Select?: string;
  salesCritCond?: string;
  salesCritChoices?: string[];
  prodSelect?: string;
  prodCritCond?: string;
  prodCritChoices?: string[];
  scmsSelect?: string;
  scmsCritCond?: string;
  scmsCritChoices?: string[];
  leSelect?: string;
  leCritCond?: string;
  leCritChoices?: string[];
  beSelect?: string;
  beCritCond?: string;
  beCritChoices?: string[];
  status = 'I';
}

