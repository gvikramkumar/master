import * as _ from 'lodash';

export class Source {
  id?: number;
  sourceId?: number;
  name: string;
  typeCode: string;
  desc: string;
  status = 'I';
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;

  constructor(status?) {
    this.status = status || 'I';
  }
}


