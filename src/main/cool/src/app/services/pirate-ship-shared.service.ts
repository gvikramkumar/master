import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PirateShipSharedService {
  private caseId: string;
  private offerId: string;
  constructor() { }
   setOfferIdandcaseId(data) {
      this.caseId = data.caseId;
      this.offerId = data.offerId;
   }
  getOfferIdandcaseId () {
      return {
        caseId: this.caseId,
        offerId: this.offerId
      };
  }
}
