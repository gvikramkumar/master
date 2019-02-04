import { ItemDetail } from './ItemDetail';

export class ConstructDetail {
  constructItem: string;
  constructItemName: string;
  constructType: string;
  productFamily: string;
  itemDetails: ItemDetail[] = [];
  groupName: string[]=[];

  constructor() {

  }
}
