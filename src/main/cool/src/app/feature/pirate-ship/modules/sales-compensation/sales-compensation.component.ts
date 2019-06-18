import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoaderService } from '@app/core/services/loader.service';
import { EnvironmentService } from '@env/environment.service';
import { ConfigurationService } from '@app/core/services/configuration.service';

import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
// import { TcMappingService } from '@app/services/tc-mapping.service';
import { TreeNode } from 'primeng/api';

import * as _ from 'lodash';

import { Subscription } from 'rxjs';
import {ConfirmationService} from 'primeng/api';
import { SalesCompensationService } from '../../../../services/sales-compensation.service';


@Component({
  selector: 'app-sales-compensation',
  templateUrl: './sales-compensation.component.html',
  styleUrls: ['./sales-compensation.component.css']
})
export class SalesCompensationComponent implements OnInit, OnDestroy {

  caseId: string;
  planId: string;
  offerId: string;
  offerName: string;
  offerOwner: string;
  functionalRole: Array<String>;

  primaryBE: string;
  derivedMM: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;

  stakeholders: any;
  stakeHolderData: any;

  pirateShipModuleName: string;
  isPirateShipSubModule: boolean;

  salesCompensationColumns: any[];
  salesCompensationItemListColumnHeaders: any[];
  selectedProductNodes: TreeNode[]; //selectedNodes3

  selectedAto: any;
  atoNames: string[] = [];
  atoList: any;
  selectedObjectAto: any;
  productDetails: any;
  selectedIndex: any;

  paramsSubscription: Subscription;

  constructor(
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private rightPanelService: RightPanelService,
    private environmentService: EnvironmentService,
    private configurationService: ConfigurationService,
    private stakeholderfullService: StakeholderfullService,
    private salesCompensationService : SalesCompensationService,
    private confirmationService: ConfirmationService
  ) { 
    this.atoNames = ['Overall Offer'];
    this.selectedIndex = 0;
    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.caseId = params['caseId'];
      this.offerId = params['offerId'];
      this.selectedAto = params['selectedAto'];
    });

    // this.loaderService.startLoading();

    // Initialize TaskBar Params
    this.isPirateShipSubModule = true;
    this.pirateShipModuleName = ' Sales Compensation';
  }

  ngOnInit() {

    this.salesCompensationColumns = [
      { field: 'offerStarted',header: 'OFFER STARTED', value: '04-Aug-2019'},
      { field: 'newOfferType',header: 'NEW OFFER TYPE', value: 'Yes' },
      { field: 'webexOffer',header: 'WEBEX OFFER', value: 'No' },
      { field: 'chargeType',header: 'CHARGE TYPE', value: 'Usage in Arrears w/ pre-commit,Periodic in Arrears' },
      { field: 'offerType',header: 'OFFER TYPE', value: 'STORM' },
      { field: 'bookingRecognitionType',header: 'BOOKING RECOGNITION TYPE', value: 'Revenue Recurring, Revenue Other' } 
    ]
    this.salesCompensationItemListColumnHeaders = [
      { field: 'products',header: 'PRODUCTS', value: 'VEDGE-1000-AC-K9' },
      { field: 'iccType',header: 'ICC TYPE', value: 'Xaas' },
      { field: 'offerType',header: 'OFFER TYPE', value: 'Webex' },
      { field: 'bookingRecognitionType',header: 'BOOKING RECOGNITION TYPE', value: 'Revenue Recurring' },
      { field: 'approvalStatus',header: 'APPROVAL STATUS', value: 'N/A' },
    ]
    this.atoList = [];
    this.productDetails = [
      {data: {products: 'VEDGE-1000-AC-K9', iccType: 'Xaas', offerType: 'Webex', bookingRecognitionType: 'Revenue Recurring', approvalStatus: 'N/A'}},
      {data: {products: 'VEDGE-1000-AC-45', iccType: 'Billing', offerType: 'Webex', bookingRecognitionType: 'Revenue offer', approvalStatus: 'N/A'}},
      {data: {products: 'VEDGE-1000-AC-K9', iccType: 'Xaas', offerType: 'Webex', bookingRecognitionType: 'Revenue Recurring', approvalStatus: 'N/A'}},
    ];
    this.salesCompensationService.getTncMapping(this.offerId).subscribe(atoList => {
      this.atoNames = ['Overall Offer'];
      this.selectedIndex = 0;
      this.atoList = atoList.data;
      for (let i = 0; i < this.atoList.length; i++) {
        this.atoNames.push(this.atoList[i].itemName);
        if (!this.atoList[i].hasOwnProperty('itemStatus') && this.atoList[i].hasOwnProperty('mappingStatus')) {
          this.atoList[i].itemStatus = this.atoList[i].mappingStatus;
        }
      }
      for (let j = 0; j < this.atoNames.length; j++) {
        if (this.atoNames[j] === this.selectedAto) {
          this.selectedIndex = j;
        }
      }
    }, error => {
      console.log('error in atolist', error);
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  reject() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
          //Actual logic to perform a confirmation
      }
    });
  }

}
