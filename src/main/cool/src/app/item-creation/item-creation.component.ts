import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ItemCreationService } from '@app/services/item-creation.service';
import { OfferConstructService } from '@app/services/offer-construct.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { LoaderService } from '@app/core/services/loader.service';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.component.html',
  styleUrls: ['./item-creation.component.scss']
})
export class ItemCreationComponent implements OnInit {
  productColumns: any[];
  productDetails: TreeNode[];
  selectedCars: any[];
  selectedProductNodes: TreeNode[]; //selectedNodes3
  selectedProductNames: string;
  offerDropdownValues: any;
  offerId: string;
  caseId: string;
  selectedOffer: string;
  display: Boolean = false;
  
  offerName: string;
  offerOwner: string;

  primaryBE: string;
  derivedMM: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;

  stakeholders: any;
  stakeHolderData: any;
  constructor(private router: Router, private itemCreationService: ItemCreationService,
    private activatedRoute: ActivatedRoute, private offerConstructService: OfferConstructService, 
    private stakeholderfullService: StakeholderfullService, private rightPanelService: RightPanelService,
    private loaderService: LoaderService) {
    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['offerId'];
      this.caseId = params['caseId'];
      this.selectedOffer = params['selectedAto'];
    });
  }

  ngOnInit() {
    this.displaySelectedOffer(this.selectedOffer);
    this.productColumns = [
      { field: 'product', header: 'PRODUCTS' },
      { field: 'iccType', header: 'ICC TYPE' },
      { field: 'productFamily', header: 'PRODUCT FAMILY' },
      { field: 'basePrice', header: 'BASE PRICE' },
      { field: 'newItemStatus', header: 'NEW ITEM STATUS' },
      { field: 'moduleStatus', header: 'ATO LEVEL STATUS' }
    ]

    // this.itemCreationService.getItemDetails(this.offerId, 'ALL').subscribe(response => {
    //   console.log('data contains '+JSON.stringify(this.offerId));
    //   this.productDetails = response.data; 
    // })

    this.itemCreationService.getOfferDropdownValues(this.offerId).subscribe(data => {
      this.offerDropdownValues = data;
    });

    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {

      this.derivedMM = offerDetails['derivedMM'];
      this.offerName = offerDetails['offerName'];
      this.primaryBE = offerDetails['primaryBEList'][0];
      this.stakeHolderData = offerDetails['stakeholders'];
      this.processStakeHolderInfo();
      this.getLeadTimeCalculation();
    });

  }

  displaySelectedOffer(dropdownValue: string) {
    this.selectedOffer = dropdownValue;
    if (dropdownValue == 'Overall Offer') {
      dropdownValue = 'ALL';
    }
    this.itemCreationService.getItemDetails(this.offerId, dropdownValue).subscribe(response => {
      this.productDetails = response.data;
    })
  }

  removeProductDetails() {
    // this.selectedProductNodes.forEach(nodeList => {
    //   if (nodeList.data.product !== undefined) {
    //     this.selectedProductNames += nodeList.data.product + ',';
    //   }
    // });
    // this.itemCreationService.removeItemDetails(this.offerId, this.selectedProductNames).subscribe(response => {
    // });
    this.productDetails = [];
  }

  goBackToOfferSetup() {
    this.router.navigate(['/offerSetup', this.offerId, this.caseId, this.selectedOffer]);
  }
  showReviewEdit() {
    /* const offerInfo = this.offerConstructService.singleMultipleFormInfo;
    const majorOfferInfo = [];
    const minorOfferInfo = [];

    const majorLength = {};
    const minorLength = {};
    majorOfferInfo.forEach((element) => {
      const name: any = Object.keys(element);
      majorLength[name] = false;
      if ((element[name].productInfo).length > 0) {
        majorLength[name] = true;
      }
    });
    minorOfferInfo.forEach(element => {
      const name: any = Object.keys(element);
      minorLength[name] = false;
      if ((element[name].productInfo).length > 0) {
        minorLength[name] = true;
      }
    });

    this.offerConstructService.itemlengthList = { major: majorLength, minor: minorLength }; */

    this.display = true;
    this.offerConstructService.closeAddDetails = true;
  }

  private processStakeHolderInfo() {

    this.stakeholders = {};

    for (let i = 0; i <= this.stakeHolderData.length - 1; i++) {
      if (this.stakeholders[this.stakeHolderData[i]['offerRole']] == null) {
        this.stakeholders[this.stakeHolderData[i]['offerRole']] = [];
      }
      this.stakeholders[this.stakeHolderData[i]['offerRole']].push({
        userName: this.stakeHolderData[i]['name'],
        emailId: this.stakeHolderData[i]['_id'] + '@cisco.com',
        _id: this.stakeHolderData[i]['_id'],
        businessEntity: this.stakeHolderData[i]['businessEntity'],
        functionalRole: this.stakeHolderData[i]['functionalRole'],
        offerRole: this.stakeHolderData[i]['offerRole'],
        stakeholderDefaults: this.stakeHolderData[i]['stakeholderDefaults']
      });
    }

  }

  private getLeadTimeCalculation() {
    this.rightPanelService.displayAverageWeeks(this.primaryBE, this.derivedMM).subscribe((leadTime) => {
      this.noOfWeeksDifference = Number(leadTime['averageOverall']).toFixed(1);
      this.loaderService.stopLoading();
      this.displayLeadTime = true;
    }, () => {
      this.noOfWeeksDifference = 'N/A';
      this.loaderService.stopLoading();
    });
  }
}
