import * as _ from 'lodash';

export class Source {
  id?: number;
  sourceId?: number;
  name: string;
  description: string;
  status: string;
  get active() {
    return this.status === 'A';
  }
  set active(val) {
    this.status = val ? 'A' : 'I';
    console.log(val, this.status);
  }

  constructor(source?: Source) {
    if (source) {
      Object.assign(this, _.cloneDeep(source));
    }
  }
}


