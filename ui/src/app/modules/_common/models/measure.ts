
export class Measure {
  id?: string;
  measureId?: number;
  moduleId?: number;
  name: string;
  typeCode: string;
  sources: number[] = [];
  hierarchies: string[] = [];
  reportingLevels: string[] = [];
  reportingLevelEnableds: boolean[] = [false, false, false];
  reportingLevel3SetToSubmeasureName = false;
  status = 'I';
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}
