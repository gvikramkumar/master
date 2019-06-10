import { Group } from './Group';

export class MMItems {
  type: string;
  offerId: string;
  mmModel: string;
  groups: Group[] = [];

  constructor(type, offerId, mmModel, groups) {
    this.type = type;
    this.offerId = offerId;
    this.mmModel = mmModel;
    this.groups = groups;
  }
}
