import {ModelBase} from '../../../store/models/model-base';

export class Reports extends ModelBase {
  name: string;
  typeCode: string;
  statusFlag: string;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}
