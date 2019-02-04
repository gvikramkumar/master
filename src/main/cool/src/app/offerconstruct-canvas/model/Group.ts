import { SubGroup } from './SubGroup';

export class Group {
  groupName: string;
  subGroup: SubGroup[] = [];

  constructor(groupName, subGroup:SubGroup[]) {
    this.groupName = groupName;
    this.subGroup = subGroup;
  }
}
