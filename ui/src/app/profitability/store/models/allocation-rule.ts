import {ModelBase} from '../../../store/models/model-base';

export class AllocationRule extends ModelBase {
  name: string;
  period: string;
  driverName: string;
  salesMatch?: string;
  productMatch?: string;
  scmsMatch?: string;
  legalEntityMatch?: string;
  beMatch?: string;
  sl1Select?: string;
  scmsSelect?: string;
  beSelect?: string;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}
