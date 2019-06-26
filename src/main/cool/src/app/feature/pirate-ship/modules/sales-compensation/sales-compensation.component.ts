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
import { OverlayPanel } from 'primeng/overlaypanel';
import { SalesCompensationService } from '../../../../services/sales-compensation.service';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { ItemCreationService } from '@app/services/item-creation.service';

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
  offerProductNodes: TreeNode[];

  selectedAto: any;
  selectedATO: any = [];
  atoNames: string[] = [];
  atoList: any;
  selectedObjectAto: any;
  productDetails: any;
  selectedIndex: any;
  offerDetails: TreeNode[];
  public newComment: string;
  displayCommentsDialog:boolean = false;
  commentsHaeder:string = "";
  viewOnlypermission:boolean = true;
  offerDropdownValues: any;
  paramsSubscription: Subscription;
  lastATOStatus: string = "Rejected";
  selectAllATOObj:any = ["All"];
  pendingATOs:number;
  selectedProductDetailsReqObj:any;

  constructor(
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private rightPanelService: RightPanelService,
    private environmentService: EnvironmentService,
    private configurationService: ConfigurationService,
    private stakeholderfullService: StakeholderfullService,
    private salesCompensationService : SalesCompensationService,
    private confirmationService: ConfirmationService,
    private itemCreationService: ItemCreationService,
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
    this.itemCreationService.getOfferDropdownValues(this.offerId).subscribe(data => {
      this.offerDropdownValues = data;
    });
    this.loadOfferDetails();    
    console.log("ato list : "+ this.atoNames);
    this.functionalRole = this.configurationService.startupData.functionalRole;
    if (this.functionalRole.includes('BUPM') || this.functionalRole.includes('SOE') || this.functionalRole.includes('OLE')) {
      this.viewOnlypermission = true;
    }
    else{
      this.viewOnlypermission = true;
    }
    console.log("functionalRole : "+ this.functionalRole);
    this.newComment = '';
    this.salesCompensationColumns = [
      { field: 'OFFER_CREATED',header: 'OFFER STARTED', value: '04-Aug-2019', width:'15%'},
      { field: 'OFFER_NEW',header: 'NEW OFFER TYPE', value: 'Yes', width:'15%' },
      { field: 'OFFER_WEBEX',header: 'WEBEX OFFER', value: 'No', width:'13%' },
      { field: 'CHARGE_TYPE',header: 'CHARGE TYPE', value: 'Usage in Arrears w/ pre-commit,Periodic in Arrears', width:'20%' },
      { field: 'OFFER_TYPE',header: 'OFFER TYPE', value: 'STORM', width:'13%' },
      { field: 'BRT',header: 'BOOKING RECOGNITION TYPE', value: 'Revenue Recurring, Revenue Other', width:'24%' } 
    ]
    this.salesCompensationItemListColumnHeaders = [
      { field: 'Id',header: '', value: '1', width:'5%' },
      { field: 'products',header: 'PRODUCTS', value: 'VEDGE-1000-AC-K9', width:'23%' },
      { field: 'iccType',header: 'ICC TYPE', value: 'Xaas', width:'15%' },
      { field: 'offerType',header: 'OFFER TYPE', value: 'Webex', width:'15%' },
      { field: 'bookingRecognitionType',header: 'BOOKING RECOGNITION TYPE', value: 'Revenue Recurring' , width:'25%'},
      { field: 'approvalStatus',header: 'APPROVAL STATUS', value: 'N/A', width:'17%' }
    ]
    this.atoList = [];
    // this.offerDetails = [
    //   {data: {offerStarted:'04-Aug-2019', newOfferType: 'Yes', webexOffer: 'No', chargeType: 'Paid Upfront', offerType: 'STORM', bookingRecognitionType: 'Other'}}
    // ];
    this.productDetails = [
      {data: {Id:'1',products: 'VEDGE-1000-AC-K9', iccType: 'Xaas', offerType: 'Webex', bookingRecognitionType: 'Revenue Recurring', approvalStatus: 'Approved', "selectable":true}, "selectable":true},
      {data: {Id:'2',products: 'VEDGE-1000-AC-45', iccType: 'Billing', offerType: 'Webex', bookingRecognitionType: 'Revenue offer', approvalStatus: 'Pending', "selectable":true}, "selectable":true},
      {data: {Id:'3',products: 'VEDGE-1000-AC-K9', iccType: 'Xaas', offerType: 'Webex', bookingRecognitionType: 'Revenue Recurring', approvalStatus: 'Pending', "selectable":false}, "selectable":false},
      {data: {Id:'4',products: 'VEDGE-1010-AC-K10', iccType: 'Billing', offerType: 'IP Phone', bookingRecognitionType: 'Revenue Offer', approvalStatus: 'N/A', "selectable":false}, "selectable":false},
    ];
    this.calculatePendingATOs(this.productDetails);
    this.salesCompensationService.getTncMapping(this.offerId).subscribe(atoList => {
      this.atoNames = ['Overall Offer'];
      this.selectedIndex = 0;
      this.atoList = atoList.data;
      if (this.atoList) {
        for (let i = 0; i < this.atoList.length; i++) {
          this.atoNames.push(this.atoList[i].itemName);
          if (!this.atoList[i].hasOwnProperty('itemStatus') && this.atoList[i].hasOwnProperty('mappingStatus')) {
            this.atoList[i].itemStatus = this.atoList[i].mappingStatus;
          }
        }
      }
      for (let j = 0; j < this.atoNames.length; j++) {
        if (this.atoNames[j] === this.selectedAto) {
          this.selectedIndex = j;
        }
      }
      this.salesCompensationService.getOfferDetails(this.offerId).subscribe(offerdetails => {
        console.log('offerdetails', offerdetails);
      });
    }, error => {
      console.log('error in atolist', error);
    });
  }
  loadOfferDetails(){
    this.salesCompensationService.getOfferDetails(this.offerId).subscribe(data => {
      this.offerDetails = this.formatOfferDetailsObj(data);
    });
  }
  validateComment(event) {
    const value = event.target.value;
    this.newComment = value;
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }


  reject(event, overlaypanel: OverlayPanel) {
    
    overlaypanel.toggle(event);
  }

  removeComment(overlaypanel: OverlayPanel) {
    this.newComment = '';
    overlaypanel.hide()
  }

  updateComment(overlaypanel: OverlayPanel) {
    overlaypanel.hide()
  }

  approve() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to approve?',
      accept: () => {
          //Actual logic to perform a confirmation
      }
    });
  }

  showCommentsDialog($e, status){
    this.displayCommentsDialog = true;
    this.commentsHaeder = status;
  }
  closeCommentsDailog(){
    this.displayCommentsDialog = false;
    this.newComment = '';
  }
  nodeSelect(event) {
    // this.messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.data.name});

    console.log("node selected..");
  }

  nodeUnselect(event) {
      // this.messageService.add({severity: 'info', summary: 'Node Unselected', detail: event.node.data.name});
      console.log("Node unselected..")
  }
  showSelectedAtoView(event){
    console.log("ato view called..")
  }
  formatOfferDetailsObj(data){
    let formattedObj = []
    data.forEach((Obj)=>{
      formattedObj.push({"data":Obj});
    })
    return formattedObj;
  }
  toggleChecks($e){
    this.selectedATO = [];
    if($e){
      for(let i=0; i<this.productDetails.length; i++){
        if(this.productDetails[i]['data']['approvalStatus'] === 'Pending'){
          this.selectedATO.push(this.productDetails[i]['data']['Id']);
        }
      }
    }
  }
  calculatePendingATOs(prodDetails){
    this.pendingATOs = 0;
    prodDetails.forEach((Obj)=>{
      if(Obj['data']['approvalStatus'] === 'Pending'){
        this.pendingATOs++;
      }
    });
  }

  checkSelectedATOCount($e){
    if($e && this.selectedATO.length === this.pendingATOs){
      this.selectAllATOObj = ["selectAllATO"];
    }
    else{
      this.selectAllATOObj = [];
    }
  }
  actOnATO(){
    this.closeCommentsDailog();
    console.log("new comments :" + this.newComment.trim());
    this.salesCompensationService.approveRejectOffer
    this.salesCompensationService.approveRejectOffer(this.selectedProductDetailsReqObj).subscribe(response => {
      this.loadOfferDetails();
    });
  }

}
