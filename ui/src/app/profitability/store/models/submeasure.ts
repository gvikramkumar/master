import {ModelBase} from '../../../store/models/model-base';

/*export class Submeasure extends ModelBase {
  key: number;
  name: string;
}*/

export class Submeasure extends ModelBase {
  name: string;
  description: string;
  source: string;
  measureName: string;
  startFiscalMonth: string;
  endFiscalMonth: string;
  processingTime: string;
  pnlnodeGrouping: string;
  inputFilterLevel: InputFilterLevel;
  manualMapping: InputFilterLevel;
  reportingLevels: string[];
  indicators: Indicators;
  rules: string[];
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}

class InputFilterLevel {
  productLevel: string;
  salesLevel: string;
  scmsLevel: string;
  internalBElevel: string;
  entityLevel: string;
}

class Indicators {
  dollarUploadFlag: string;
  discountFlag: string;
  approveFlag: string;
  status: string;
  manualMapping: string;
  expenseSSOT: string;
  manualMix: string;
}
