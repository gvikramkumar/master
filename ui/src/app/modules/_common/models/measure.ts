
export class Measure {
  id?: string;
  measureId?: number;
  moduleId?: number;
  name: string;
  typeCode: string;
  sources: number[] = [];
  hierarchies: string[] = [];
  approvalRequired?: boolean;
  reportingLevel1?: string;
  reportingLevel2?: string;
  reportingLevel3?: string;
  reportingLevel1Enabled?: boolean;
  reportingLevel2Enabled?: boolean;
  reportingLevel3Enabled?: boolean;
  status = 'I';
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}
