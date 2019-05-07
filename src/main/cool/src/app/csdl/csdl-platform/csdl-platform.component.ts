import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { DashboardService } from '@shared/services';

@Component({
  selector: 'app-csdl-platform',
  templateUrl: './csdl-platform.component.html',
  styleUrls: ['./csdl-platform.component.scss']
})
export class CsdlPlatformComponent implements OnInit {
  public currentOfferId: any;
  caseId: string;
  selectedOffer: string;
  offerId: string;
  firstData: Object;
  public data = [];
  derivedMM;
  offerName;
  primaryBE: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;
  stakeHolderInfo: any;
  message = {};
  stakeData = {};
  proceedButtonStatusValid = true;
  backbuttonStatusValid = true;
  pirateShipModuleName: string;
  isPirateShipSubModule: boolean;
  stakeHolders = {};

  constructor(private router: Router,
      private activatedRoute: ActivatedRoute,
      private stakeholderfullService: StakeholderfullService,
      private rightPanelService: RightPanelService,
      private dashboardService: DashboardService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
      this.selectedOffer = params['selectedAto'];
    });
    // Initialize TaskBar Params
    this.isPirateShipSubModule = true;
    this.pirateShipModuleName = 'CSDL';
  }

  ngOnInit() {

    this.dashboardService.getMyOffersList()
      .subscribe(resOffers => {
        resOffers.forEach(ele => {
          this.stakeHolders[ele.offerId] = {};
          if (ele.stakeholders != null) {
            ele.stakeholders.forEach(holder => {
              if (this.stakeHolders[ele.offerId][holder.functionalRole] == null) {
                this.stakeHolders[ele.offerId][holder.functionalRole] = [];
              }
              this.stakeHolders[ele.offerId][holder.functionalRole].push(holder['_id']);
            });
          }
        });
    });

    this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
      this.firstData = data;
      this.offerId = this.currentOfferId;
      this.data = this.firstData['stakeholders'];
      this.derivedMM = this.firstData['derivedMM'];
      this.offerName = this.firstData['offerName'];
      if (Array.isArray(this.firstData['primaryBEList']) && this.firstData['primaryBEList'].length) {
        this.primaryBE = this.firstData['primaryBEList'][0];
      }
      this.rightPanelService.displayAverageWeeks(this.primaryBE, this.derivedMM).subscribe(
        (leadTime) => {
          this.noOfWeeksDifference = Number(leadTime['averageOverall']).toFixed(1);
          this.displayLeadTime = true;
        },
        () => {
          this.noOfWeeksDifference = 'N/A';
        }
      );
      this.stakeHolderInfo = {};

      for (let i = 0; i <= this.data.length - 1; i++) {

        if (this.stakeHolderInfo[this.data[i]['offerRole']] == null) {
          this.stakeHolderInfo[this.data[i]['offerRole']] = [];
        }

        this.stakeHolderInfo[this.data[i]['offerRole']].push(
          {
            userName: this.data[i]['name'],
            emailId: this.data[i]['_id'] + '@cisco.com',
            _id: this.data[i]['_id'],
            businessEntity: this.data[i]['businessEntity'],
            functionalRole: this.data[i]['functionalRole'],
            offerRole: this.data[i]['offerRole'],
            stakeholderDefaults: this.data[i]['stakeholderDefaults']
          });

      }
      this.stakeData = this.stakeHolderInfo;
    });
  }

    // --------------------------------------------------------------------------------------------------------------------------------

    updateMessage(message) {
      if (message != null && message !== '') {
        if (message === 'hold') {
          this.proceedButtonStatusValid = false;
          this.backbuttonStatusValid = false;
          this.message = {
            contentHead: '',
            content: 'The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.',
            color: 'black'
          };
        } else if (message === 'cancel') {
          this.proceedButtonStatusValid = false;
          this.backbuttonStatusValid = false;
          this.message = {
            contentHead: '',
            content: 'The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.',
            color: 'black'
          };
        }
      }
    }
  
    // --------------------------------------------------------------------------------------------------------------------------------

  goBackToOfferSetup() {
    this.router.navigate(['/offerSetup', this.currentOfferId, this.caseId]);
  }

}
