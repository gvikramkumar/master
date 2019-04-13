export class SubGroup {
  subGroupName: string;
  selected: string[] = [];
  failed?: any;
  subGroupStatus?: any;

  constructor(subGroupName, selected) {
    this.subGroupName = subGroupName;
    this.selected = selected;
  }
}


