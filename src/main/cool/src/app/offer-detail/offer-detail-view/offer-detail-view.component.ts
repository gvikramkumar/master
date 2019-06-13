import { Component, OnInit, Input } from '@angular/core';
import { OfferDetailViewService } from '@app/services/offer-detail-view.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StakeHolder } from '@app/models/stakeholder';
import { Location } from '@angular/common';
import { OfferCharacteristics } from '@app/models/OfferCharacteristics';
import { StrategyReviewService } from '@app/services/strategy-review.service';
import { MonetizationModelService } from '@app/services/monetization-model.service';
import { ExitCriteriaValidationService } from '@app/services/exit-criteria-validation.service';


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
  offerDimensionsCharacteristics = {};
  solutioningDetailsCharacteristics = {};
  offerComponentCharacterestics = {};

  offerCoOwnerList: StakeHolder[] = [];
  offerStakeHolderList: StakeHolder[] = [];
  offerCharacteristicsList: OfferCharacteristics[] = [];
  packagingList: OfferCharacteristics[] = [];
  supportList: OfferCharacteristics[] = [];
  pricingList: OfferCharacteristics[] = [];
  billingAndCompList: OfferCharacteristics[] = [];
  programList: OfferCharacteristics[] = [];
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
  designReviewList;
  offerOverviewDetailsList;
  offerOwnerCount: any = 1;
  coOwnerTotalCount: any = 0;
  stakeHolderTotalCount: any = 0;

  constructor(private activatedRoute: ActivatedRoute,
    private monetizationModelService: MonetizationModelService,
    private _route: Router,
    private offerDetailViewService: OfferDetailViewService,
    private strategyReviewService: StrategyReviewService,
    private exitCriteriaValidationService: ExitCriteriaValidationService,
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
    this.getDesignReviewInfo();
    // this.getofferDimensions();
  }

  getStrategyReviewInfo() {
    this.strategyReviewService.getStrategyReview(this.caseId).subscribe(data => {
      this.strategyReviewList = data;
    });
  }

  getDesignReviewInfo() {
    this.exitCriteriaValidationService.getDesignReview(this.caseId).subscribe(data => {
      this.designReviewList = data;
    });
  }

  getOfferOverviewDetails() {

    this.offerDetailViewService.retrieveOfferDetails(this.currentOfferId)
      .subscribe(data => {

        this.offerViewData = data;
        let stakeholdersInfo = null;
        this.offerName = data.offerName;
        this.derivedMM = data.derivedMM;
        this.offerOwnerId = data.offerOwner;
        this.allignedStatus = data.overallStatus;

        if (Array.isArray(this.offerViewData.stakeholders) && this.offerViewData.stakeholders.length) {

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
        }

        let offerCharacteristics = null;
        let packaging = null;
        let support = null;
        let pricing = null;
        let billingAndComp = null;
        let program = null;
        if (Array.isArray(this.offerViewData.selectedCharacteristics) && this.offerViewData.selectedCharacteristics.length) {
          this.offerViewData.selectedCharacteristics.forEach(element => {
            offerCharacteristics = new OfferCharacteristics();
            offerCharacteristics.subgroup = element.subgroup;
            offerCharacteristics.characteristics = element.characteristics;
            if (element.group === 'Offer Characteristics') {
              this.offerCharacteristicsList.push(offerCharacteristics);
            }
          });
        }

        // Creating Data for Offer Solutioning Details 
        if (Array.isArray(this.offerViewData.solutioningDetails) && this.offerViewData.solutioningDetails.length) {
          this.offerViewData.solutioningDetails.forEach(element => {
            if (!(element.dimensionGroup in this.solutioningDetailsCharacteristics) && element.dimensionGroup != 'Offer Characteristics') {
              this.solutioningDetailsCharacteristics[element.dimensionGroup] = {};
              this.solutioningDetailsCharacteristics[element.dimensionGroup]['dimensionSubgroup'] = [];
              this.solutioningDetailsCharacteristics[element.dimensionGroup]['dimensionAttribute'] = [];
              this.solutioningDetailsCharacteristics[element.dimensionGroup]['details'] = [];
              this.solutioningDetailsCharacteristics[element.dimensionGroup]['dimensionSubgroup'].push(element.dimensionSubgroup);
              this.solutioningDetailsCharacteristics[element.dimensionGroup]['dimensionAttribute'].push(element.dimensionAttribute);
              this.solutioningDetailsCharacteristics[element.dimensionGroup]['dimensionAttribute'] = Array.from(new Set([].concat
                .apply([], this.solutioningDetailsCharacteristics[element.dimensionGroup]['dimensionAttribute'])));
              let temp = this.solutioningDetailsCharacteristics;
              if (element.Details.length) {
                element.Details.forEach(subelement => {
                  let temp_dict = {};
                  Object.keys(subelement).forEach(function (key) {
                    if (key == 'solutioninQuestion' && subelement['solutioningAnswer']) {
                      temp_dict[subelement[key]] = subelement['solutioningAnswer'];
                      temp[element.dimensionGroup]['details'].push(temp_dict);
                    }
                  });
                });
                this.solutioningDetailsCharacteristics = temp;
              }

            } else if ((element.dimensionGroup in this.solutioningDetailsCharacteristics)
              && element.dimensionGroup != 'Offer Characteristics') {
              this.solutioningDetailsCharacteristics[element.dimensionGroup]['dimensionSubgroup'].push(element.dimensionSubgroup);
              this.solutioningDetailsCharacteristics[element.dimensionGroup]['dimensionAttribute'].push(element.dimensionAttribute);
              this.solutioningDetailsCharacteristics[element.dimensionGroup]['dimensionAttribute'] = Array.from(new Set([].concat
                .apply([], this.solutioningDetailsCharacteristics[element.dimensionGroup]['dimensionAttribute'])));
              let temp = this.solutioningDetailsCharacteristics;
              if (element.Details.length) {
                element.Details.forEach(subelement => {
                  const temp_dict = {};
                  Object.keys(subelement).forEach(function (key) {
                    if (key == 'solutioninQuestion' && subelement['solutioningAnswer']) {
                      temp_dict[subelement[key]] = subelement['solutioningAnswer'];
                      temp[element.dimensionGroup]['details'].push(temp_dict);
                    }
                  });
                });
                this.solutioningDetailsCharacteristics = temp;
              }

            }
          });
        }


        if (Array.isArray(this.offerViewData.constructDetails) && this.offerViewData.constructDetails.length) {
          this.offerComponentCharacterestics = this.offerViewData.constructDetails;
        }

        if (Array.isArray(this.offerViewData.additionalCharacteristics) && this.offerViewData.additionalCharacteristics.length) {
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
            if (element.group === 'Billing & Comp') {
              this.billingAndCompList.push(billingAndComp);
            }
            program = new OfferCharacteristics();
            program.subgroup = element.subgroup;
            program.characteristics = element.characteristics;
            if (element.group === 'Program') {
              this.programList.push(program);
            }

            if (!(element.group in this.offerDimensionsCharacteristics) && element.group != 'Offer Characteristics'
              && element.group !== 'Always Ask') {
              this.offerDimensionsCharacteristics[element.group] = {};
              this.offerDimensionsCharacteristics[element.group]['subGroup'] = [];
              this.offerDimensionsCharacteristics[element.group]['selected'] = [];
              this.offerDimensionsCharacteristics[element.group]['chocies'] = [];
              this.offerDimensionsCharacteristics[element.group]['listGrpQuestions'] = [];
              this.offerDimensionsCharacteristics[element.group]['subGroup'].push(element.subgroup);
              this.offerDimensionsCharacteristics[element.group]['selected'].push(element.characteristics);
            }
            else if ((element.group in this.offerDimensionsCharacteristics) && element.group !== 'Offer Characteristics'
              && element.group !== 'Always Ask') {
              this.offerDimensionsCharacteristics[element.group]['subGroup'].push(element.subgroup);
              this.offerDimensionsCharacteristics[element.group]['selected'].push(element.characteristics);
            }

          });
        }
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
    this.monetizationModelService.downloadOfferDetailsPdf(this.currentOfferId).subscribe(data => {
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
