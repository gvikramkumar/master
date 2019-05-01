import { ItemDetail } from './ItemDetail';

export class ConstructDetail {
  constructItem: string;
  constructItemName: string;
  constructType: string;
  productFamily: string;
  itemDetails: ItemDetail[] = [];
  constructNodeId: string;
  constructParentId: string;
  groupNode: boolean;
  eGenieFlag: boolean;
  constructor() {}
}
