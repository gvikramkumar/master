import { Component, OnInit, Input } from '@angular/core';
import { OfferDetailViewService } from '../services/offer-detail-view.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StakeHolder } from '../models/stakeholder';
import { Location } from '@angular/common';
import { OfferCharacteristics } from '../models/OfferCharacteristics';
import { StrategyReviewService } from '../services/strategy-review.service';
import { MonetizationModelService } from '../services/monetization-model.service';
import { OfferDimensions } from '../models/OfferDimensions';


@Component({
  selector: 'app-offer-detail-view',
  templateUrl: './offer-detail-view.component.html',
  styleUrls: ['./offer-detail-view.component.css']
})
export class OfferDetailViewComponent implements OnInit {

  offerRole: string;
  offerName: string;
  offerOwnerId: string;
  offerOwnerName: string;
  currentOfferId: string;

  offerCoOwnerList: StakeHolder[] = [];
  offerStakeHolderList: StakeHolder[] = [];
  offerCharacteristicsList: OfferCharacteristics[] = [];
  packagingList: OfferCharacteristics[] = [];
  supportList: OfferCharacteristics[] = [];
  pricingList: OfferCharacteristics[] = [];
  billingAndCompList: OfferCharacteristics[] = [];
  programList: OfferCharacteristics[] = [];
  diOfferCharacteristicsList: OfferDimensions[] = [];
  diPackagingList: OfferDimensions[] = [];
  diSupportList: OfferDimensions[] = [];
  diPricingList: OfferDimensions[] = [];
  diBillingAndCompList: OfferDimensions[] = [];
  diProgramList: OfferDimensions[] = [];
  diDetailedOfferAttributesList: OfferDimensions[] = [];
  diBillingAndCompensationList: OfferDimensions[] = [];
  diOfferReplacementList: OfferDimensions[] = [];
  diComplianceList: OfferDimensions[] = [];
  diCSDLList: OfferDimensions[] = [];
  diSWOEList: OfferDimensions[] = [];
  diRevenueAttributesList: OfferDimensions[] = [];
  diProgramInfoList: OfferDimensions[] = [];
  dimensionSubGroupList = [];
  dimensionGroupList = [];
  offerConstructDetailsList;
  stakeName;
  email;
  functionalRole;
  caseId;
  obj = {
  };

  offerViewData;
  derivedMM: string;
  allignedStatus: string;

  strategyReviewList;
  offerOverviewDetailsList;
  offerOwnerCount: any = 1;
  coOwnerTotalCount: any = 0;
  stakeHolderTotalCount: any = 0;

  constructor(private activatedRoute: ActivatedRoute,
    private monetizationModelService: MonetizationModelService,
    private _route: Router,
    private offerDetailViewService: OfferDetailViewService,
    private strategyReviewService: StrategyReviewService,
    private _location: Location) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
    this.activatedRoute.data.subscribe((data) => {
    });
    this.offerOverviewDetailsList = this.activatedRoute.snapshot.data['offerData'];
  }

  ngOnInit() {
    this.getOfferOverviewDetails();
    this.getStrategyReviewInfo();
  }

  getStrategyReviewInfo() {
    this.strategyReviewService.getStrategyReview(this.caseId).subscribe(data => {
      this.strategyReviewList = data;
    });
  }

  getOfferOverviewDetails() {

    this.offerDetailViewService.offerDetailView(this.currentOfferId)
      .subscribe(data => {
        this.offerConstructDetailsList = data.constructDetails;
        this.offerViewData = data;
        let stakeholdersInfo = null;
        this.offerName = data.offerName;
        this.derivedMM = data.derivedMM;
        this.offerOwnerId = data.offerOwner;
        this.allignedStatus = data.overallStatus;
        this.offerViewData.stakeholders.forEach(element => {

          stakeholdersInfo = new StakeHolder();
          stakeholdersInfo._id = element._id;
          stakeholdersInfo.name = element.name;
          stakeholdersInfo.offerRole = element.offerRole;
          stakeholdersInfo.email = element.email;
          stakeholdersInfo.functionalRole = element.functionalRole;

          if (element._id === this.offerOwnerId) {
            this.offerOwnerName = element.name;
          }

          if (element.offerRole === 'Co-Owner' && element._id !== this.offerOwnerId) {
            this.offerCoOwnerList.push(stakeholdersInfo);
            this.coOwnerTotalCount = this.offerCoOwnerList.length;
          } else if (element._id !== this.offerOwnerId) {
            this.offerStakeHolderList.push(stakeholdersInfo);
            this.stakeHolderTotalCount = this.offerStakeHolderList.length;
          }
        });

        // this.offerOwner = 
        // this.offerCoOwnerList = this.offerCoOwnerList.reduce(a => a['userName'] !== this.offerOwner);

        let offerCharacteristics = null;
        let packaging = null;
        let support = null;
        let pricing = null;
        let billingAndComp = null;
        let program = null;
        let diOfferCharacteristics = null;
        let diPackaging = null;
        let diSupport = null;
        let diPricing = null;
        let diBillingAndComp = null;
        let diProgram = null;
        let diDetailedOfferAttributes = null;
        let diBillingAndCompensation = null;
        let diOfferReplacement = null;
        let diCompliance = null;
        let diCSDL = null;
        let diSWOE = null;
        let diRevenueAttributes = null;
        let diProgramInfo = null;
        this.offerViewData.selectedCharacteristics.forEach(element => {
          offerCharacteristics = new OfferCharacteristics();
          offerCharacteristics.subgroup = element.subgroup;
          offerCharacteristics.characteristics = element.characteristics;
          if (element.group === 'Offer Characteristics') {
            this.offerCharacteristicsList.push(offerCharacteristics);
          }
        });
        this.offerViewData.additionalCharacteristics.forEach(element => {
          packaging = new OfferCharacteristics();
          packaging.subgroup = element.subgroup;
          packaging.characteristics = element.characteristics;
          if (element.group.toLowerCase() === 'packaging') {
            this.packagingList.push(packaging);
          }
          support = new OfferCharacteristics();
          support.subgroup = element.subgroup;
          support.characteristics = element.characteristics;
          if (element.group === 'Support') {
            this.supportList.push(support);
          }
          pricing = new OfferCharacteristics();
          pricing.subgroup = element.subgroup;
          pricing.characteristics = element.characteristics;
          if (element.group === 'Pricing') {
            this.pricingList.push(pricing);
          }
          billingAndComp = new OfferCharacteristics();
          billingAndComp.subgroup = element.subgroup;
          billingAndComp.characteristics = element.characteristics;
          if (element.group === 'Billing&Comp') {
            this.billingAndCompList.push(billingAndComp);
          }
          program = new OfferCharacteristics();
          program.subgroup = element.subgroup;
          program.characteristics = element.characteristics;
          if (element.group === 'Program') {
            this.programList.push(program);
          }
        });

        this.offerViewData.solutioningDetails.forEach(element => {
          diOfferCharacteristics = new OfferDimensions();
          diOfferCharacteristics.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Offer Characteristics') {
            this.diOfferCharacteristicsList.push(diOfferCharacteristics);
          }
          diPackaging = new OfferDimensions();
          diPackaging.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Packaging') {
            this.diPackagingList.push(diPackaging);
          }
          diSupport = new OfferDimensions();
          diSupport.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Support') {
            this.diSupportList.push(diSupport);
          }
          diPricing  = new OfferDimensions();
          diPricing.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Pricing') {
            this.diPricingList.push(diPricing);
          }
          diBillingAndComp  = new OfferDimensions();
          diBillingAndComp.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Billing&Comp') {
            this.diBillingAndCompList.push(diBillingAndComp);
          }
          diProgram  = new OfferDimensions();
          diProgram.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Program') {
            this.diProgramList.push(diProgram);
          }
          diDetailedOfferAttributes = new OfferDimensions();
          diDetailedOfferAttributes.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Detailed Offer Attributes') {
            this.diDetailedOfferAttributesList.push(diDetailedOfferAttributes );
          }
          diBillingAndCompensation = new OfferDimensions();
          diBillingAndCompensation.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Billing & Compensation') {
            this.diBillingAndCompensationList.push(diBillingAndCompensation);
          }
          diOfferReplacement = new OfferDimensions();
          diOfferReplacement.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Offer Replacement') {
            this.diOfferReplacementList.push(diOfferReplacement);
          }
          diCompliance = new OfferDimensions();
          diCompliance.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Compliance') {
            this.diComplianceList.push(diCompliance);
          }
          diCSDL = new OfferDimensions();
          diCSDL.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'CSDL') {
            this.diCSDLList.push(diCSDL);
          }
          diSWOE = new OfferDimensions();
          diSWOE.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'SWOE') {
            this.diSWOEList.push(diSWOE);
          }
          diRevenueAttributes  = new OfferDimensions();
          diRevenueAttributes.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Revenue Attributes') {
            this.diRevenueAttributesList.push(diRevenueAttributes);
          }
          diProgramInfo  = new OfferDimensions();
          diProgramInfo.dimensionSubgroup = element.dimensionSubgroup;
          if (element.dimensionGroup === 'Program Info') {
            this.diProgramInfoList.push(diProgramInfo);
          }
        });
      this.offerViewData.solutioningDetails.forEach(element => {
        let temp;
        if(temp !== element.dimensionSubgroup) {
          this.dimensionSubGroupList.push(element.dimensionSubgroup);
        }
        temp = element.dimensionGroup;
      });
      this.offerViewData.solutioningDetails.forEach(element => {
        let temp;
        if(temp !== element.dimensionGroup) {
          this.dimensionGroupList.push(element.dimensionGroup);
        }
        temp = element.dimensionGroup;
      });
    });
  }

  getInitialChar(name) {
    if (name == null) {
      return '';
    }
    const names = name.split(' ');
    let initials = '';
    initials += names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[1].charAt(0).toUpperCase();
    }
    return initials;
  }

  goBack() {
    this._location.back();
  }

  onExportPdf() {
    this.monetizationModelService.getPDF(this.currentOfferId).subscribe(data => {
      const nameOfFileToDownload = 'offer-details';
      const blob = new Blob([data], { type: 'application/pdf' });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, nameOfFileToDownload);
      } else {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = nameOfFileToDownload;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }

}
