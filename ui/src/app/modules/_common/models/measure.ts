
export class Measure {
  id?: string;
  measureId?: number;
  moduleId?: number;
  name: string;
  typeCode: string;
  sources: number[] = [];
  hierarchies: string[] = [];
  reportingLevels: string[] = [];
  reportingLevelEnableds: boolean[] = [];
  reportingLevel3SetToSubmeasureName?: boolean;
  status = 'I';
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}
