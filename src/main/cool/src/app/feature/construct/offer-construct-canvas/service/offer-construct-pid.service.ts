import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OfferconstructPIDService {
  pidErrormessage: any;
  constructor(private httpClient: HttpClient) { }

  majorMinorLineRule(result, stackHolber) {

    // result for test only ENABLE-OPT NON ORD
    result = {
      'Accounting Rule': 'Immediate',
      'Base PID': 'ISR4321/K9',
      'Delivery Option': 'PHYSICAL',
      'Fulfilment Restriction': 'No',
      'Image Signing': 'No Image signing (Digital Software Signatures) is not supported',
      'Item Category': 'Hardware',
      'Item Status': 'ENABLE-MAJ',
      'Item Type': 'ATO MODEL',
      'PID Category': 'Hardware',
      'Pid Owner': 'HANGNG,SHANKD',
      'SW% Booking Allocation': '0',
      'Sales Account': '40100',
      'Serviceable Product Flag': 'Y',
      'Smart Account': 'Blank / Not Enabled',
      'Smart Licensing Enabled': 'No',
      'UDI Value': 'Full UDI Compliance',
      'WorkFlow Status': 'APPROVED',
      'WorkFlow Status Requested By': 'BUC',
      'major/minor': 'Major Line'
    };

    let Item_owner_status = false;
    let Item_status = false;
    let Workflow_Status = false;

    // check stackholder present or not
    Item_owner_status = this.isStackHolderPresent(result['Pid Owner'], stackHolber);

    if (result['Item Status'] === `NON ORD`) {
      Item_status = true;
    }

    if (result['WorkFlow Status'] === 'PENDING APPROVAL' ||
      result['WorkFlow Status'] === 'APPROVED' ||
      result['WorkFlow Status'] === 'Pending Product Class') {
      Workflow_Status = true;
    }

    if (result['Requested By'] === 'BUC') {
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
  isStackHolderPresent(currentStackHolder, pidOwners) {
    let currentStackHolderList = currentStackHolder.split(',');

    if (currentStackHolderList.length <= 0) {
      return false;
    }

    currentStackHolderList = currentStackHolderList.map(value => value.trim());

    console.log('str_array', currentStackHolderList);
    console.log('currentStackHolder', currentStackHolder);
    for (const pid of currentStackHolderList) {
      for (const pidOwner of pidOwners) {
        if (pidOwner._id === pid) {
          return true;
        }
      }
    }
  }
}
