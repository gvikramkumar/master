import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OfferconstructPIDService {
  pidErrormessage: any;
  constructor(private httpClient: HttpClient) { }

  majorMinorLineRule(result) {
    let Item_owner_status = false;
    let Item_status = false;
    let Workflow_Status = false;

    //check stackholder present or not
    Item_owner_status = this.isStackHolderPresent(result, `currentStackHolder`);

    if (result['Item Status'] === `NON ORD`) {
      Item_status = true;
    }

    if (result['WorkFlow Status'] === 'PENDING APPROVAL BUC' ||
      result['WorkFlow Status'] === 'PENDING APPROVAL BUC' ||
      result['WorkFlow Status'] === 'PENDING APPROVAL BUC') {
      Workflow_Status = true;
    }

    if ((Item_owner_status) && (Item_status) && Workflow_Status) {
      return true;
    } else {
      if (!Item_owner_status && !Item_status && !Workflow_Status) {
        this.pidErrormessage = `Major Line can only be added in the NPI process if the Status is "NONORD," the Workflow Status is at least
                                "Pending BUC Approval" and one of the item owners is a part of the offer.`;
        return false;
      }
      if (!Item_status && !Workflow_Status && Item_owner_status) {
        this.pidErrormessage = `Major Line can only be added in the NPI process if the Status is "NONORD"
                                and the item's Workflow Status is at least "Pending BUC Approval."`;
        return false;
      }
      if (!Item_owner_status && !Workflow_Status && Item_status) {
        this.pidErrormessage = `Please ensure that one of the owners of this item is a part of the offer and that the
                                item's Workflow Status is at least "Pending BUC Approval." `;
        return false;
      }
      if (!Item_owner_status && !Item_status && Workflow_Status) {
        this.pidErrormessage = `Major Line can only be added in the NPI process if the Status is "NONORD" and one of the
                                owners of the item must be a part of the offer.`;
        return false;
      }
      if (!Item_owner_status) {
        this.pidErrormessage = `Please ensure that one of the owners of this item is a part of the offer.`;
        return false;
      }
      if (!Item_status) {
        this.pidErrormessage = `Major Line can only be added in the NPI process if the Status is "NONORD."`;
        return false;
      }
      if (!Workflow_Status) {
        this.pidErrormessage = `Major Line can only be added in the NPI process if the item's
                                Workflow Status is at least Pending BUC Approval.`;
        return false;
      }
    }
  }

  // check stakeHolder is present or not
  isStackHolderPresent(result, currentStackHolder) {
    return true;
  }
}
