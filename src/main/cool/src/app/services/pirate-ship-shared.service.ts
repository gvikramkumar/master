import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PirateShipSharedService {
  private caseId: string;
  private offerId: string;
  private _role: string;
  private userName: string;
  private userId: string;
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

  getRole(): string {
    return this._role;
  }

  setRole(value: string) {
    this._role = value;
  }
  getUserName() {
    return this.userName;
  }

  setUserName(userName: string) {
    this.userName = userName;
  }

  getUserId() {
    return this.userId;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }
}
