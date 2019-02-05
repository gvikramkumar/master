import { ConstructDetail } from './ConstructDetail';

export class ConstructDetails {
  offerId: string;
  constructDetails: ConstructDetail[];

  constructor(offerId: string, constructDetails:ConstructDetail[]) {
    this.offerId = offerId;
    this.constructDetails = constructDetails;
  }
}
