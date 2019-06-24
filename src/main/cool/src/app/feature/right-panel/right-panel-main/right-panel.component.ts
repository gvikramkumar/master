import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { OfferPhaseService } from '@app/services/offer-phase.service';
import { RightPanelService } from '@app/services/right-panel.service';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import * as _ from 'lodash';
import { LeadTime } from '../models/lead-time';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css']
})
export class RightPanelComponent implements OnInit {

  caseId;
  entityList;
  currentOfferId;
  funcionalRoleList;
  offerPhaseDetailsList;

  planCount = 0;
  ideateCount: any = 0;
  planCompletedCount = 0;
  ideateCompletedCount = 0;
  setupCount = 0;
  setupCompletedCount = 0;
  navigateHash: Object = {};
  phaseProcessingCompleted = false;

  mileStoneStatus: any[] = [];
  mStoneCntInAllPhases: any[] = ['ideate', 'plan', 'setup', 'launch'];

  ddOwner1 = 'Select Owner';
  flagOwner1 = false;

  ddOwner2 = 'Select Owner';
  flagOwner2 = false;

  ddOwner3 = 'Select Owner';
  flagOwner3 = false;

  mmModel: string;
  leadTime: LeadTime;
  leadTimeYear: number;
  progressBarWidth: number;
  averageWeekCount: string;
  expectedLaunchDate: string;
  weekDifferenceCount: string;
  displayLeadTimeButton: Boolean = false;

  launchDate: string;
  designReviewDate: string;
  strategyReviewDate: string;
  readinessReviewDate: string;

  Math = Math;
  isNaN = isNaN;

  average = 'Average';
  tenthPercentile = '10th Percentile';
  nintyPercentile = '90th Percentile';

  @Input() offerName: string;
  @Input() stakeData: Object;
  @Input() derivedMM: string;
  @Input() primaryBE: string;
  @Input() noOfWeeksDifference: string;
  @Input() displayLeadTime: Boolean = false;

  @Input() events: Observable<string>;
  @Output() updateStakeData = new EventEmitter<string>();
  editIdeateTargetDate: Boolean = false;
  editPlanTargetDate: Boolean = false;
  editSetUpTargetDate: Boolean = false;
  editLanchTargetDate: Boolean = false;

  minDate: Date;
  showAlert: Boolean = false;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();


  averageOverall = 0;
  averageOfTopTenPercentile = 0;
  averageOfRemainingNinetyPercentile = 0;

  overallWeeksCompare;
  averageOverallWeeks;
  averageOfTopTenPercentileWeeks;
  averageOfRemainingNinetyPercentileWeeks;

  countOfHundredPercentile;
  topTenPercentileWeeksCompare;
  remainingNinetyPercentileCompare;

  loadingLeadTime = true;
  addStakeHolder: Boolean = false;
  displayOfferPhase: Boolean = false;
  public isOfferPhaseBlank = true;
  listOfCompletedPhases: string[] = [];

  // ----------------------------------------------------------------------------------------

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private offerPhaseService: OfferPhaseService,
    private rightPanelService: RightPanelService,
    private stakeHolderService: StakeholderfullService
    ) {

    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
    });


    this.offerPhaseDetailsList = this.activatedRoute.snapshot.data['offerData'];

  }

  // ----------------------------------------------------------------------------------------

  ngOnInit() {

    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
    this.minDate = new Date();

    this.navigateHash['Offer Creation'] = ['/coolOffer', this.currentOfferId, this.caseId];
    this.navigateHash['Offer Model Evaluation'] = ['/mmassesment', this.currentOfferId, this.caseId];
    this.navigateHash['Stakeholder Identification'] = ['/stakeholderFull', this.currentOfferId, this.caseId];
    this.navigateHash['Strategy Review'] = ['/strategyReview', this.currentOfferId, this.caseId];

    this.navigateHash['Offer Dimension'] = ['/offerDimension', this.currentOfferId, this.caseId];
    this.navigateHash['Offer Solutioning'] = ['/offerSolutioning', this.currentOfferId, this.caseId];
    this.navigateHash['Offer Components'] = ['/offerConstruct', this.currentOfferId, this.caseId];
    this.navigateHash['Design Review'] = ['/designReview', this.currentOfferId, this.caseId];
    this.navigateHash['Offer Setup Workflow'] = ['/offerSetup', this.currentOfferId, this.caseId];

    this.offerPhaseService.getOfferPhase(this.caseId).subscribe(resOfferPhases => {
      if (resOfferPhases) {
        this.offerPhaseDetailsList = resOfferPhases;

        this.ideateCount = resOfferPhases.ideate ? resOfferPhases.ideate.length : 0;
        this.ideateCompletedCount = resOfferPhases.ideate ? resOfferPhases.ideate.filter(
          this.isMilestoneCompletedAndNotApplicable()).length : 0;

        this.planCount = resOfferPhases.plan ? resOfferPhases.plan.length : 0;
        this.planCompletedCount = resOfferPhases.plan ? resOfferPhases.plan.filter(
          this.isMilestoneCompletedAndNotApplicable()).length : 0;

        this.setupCount = resOfferPhases.setup ? resOfferPhases.setup.length : 0;
        this.setupCompletedCount = resOfferPhases.setup ? resOfferPhases.setup.filter(
          this.isMilestoneCompletedAndNotApplicable()).length : 0;

        this.processCurrentPhaseInfo(resOfferPhases);
      }
      this.phaseProcessingCompleted = true;
      this.isOfferPhaseBlank = resOfferPhases === null || Object.keys(resOfferPhases).length === 0;
    });

  }

  // ----------------------------------------------------------------------------------------

  removeAlert() {
    this.showAlert = false;
  }

  showOfferPhaseDailog() {
    this.displayOfferPhase = true;
  }

  closeOfferPhaseDailog() {
    this.displayOfferPhase = false;
  }

  // ----------------------------------------------------------------------------------------

  processCurrentPhaseInfo(offerPhaseInfo) {
    this.mileStoneStatus = this.mStoneCntInAllPhases.reduce((accumulator, phase) => {
      const phaseInfo = {
        phase: phase,
        status: ''
      };
      const offerMilestone = offerPhaseInfo[phase];
      if (offerMilestone) {
        // This loop will executed for ideate phase.       
        offerMilestone.forEach(subMilestones => {
          if (subMilestones.subMilestone === 'Strategy Review') {
            if (subMilestones.status === 'Completed') {
              this.listOfCompletedPhases.push('Strategy Review');
              phaseInfo.status = 'visited';
            } else {
              phaseInfo.status = 'active';
            }
          }
        });

        // This loop will executed for plan phase.
        offerMilestone.forEach(subMilestones => {
          if (subMilestones.subMilestone === 'Design Review') {
            if (subMilestones.status === 'Completed') {
              this.listOfCompletedPhases.push('Design Review');
              phaseInfo.status = 'visited';
            } else {
              if (this.listOfCompletedPhases.includes('Strategy Review')) {
                phaseInfo.status = 'active';
              } else {
                phaseInfo.status = '';
              }
            }
          }
        });

        // This loop will executed for setup phase.
        offerMilestone.forEach(subMilestones => {
          if (subMilestones.subMilestone === 'Orderability') {
            if (subMilestones.status === 'Completed') {
              this.listOfCompletedPhases.push('Orderability');
              phaseInfo.status = 'visited';
            } else {
              if (this.listOfCompletedPhases.includes('Design Review')) {
                phaseInfo.status = 'active';
              } else {
                phaseInfo.status = '';
              }
            }
          }
        });
      }
      
      accumulator.push(phaseInfo);
      return accumulator;
    }, []);
  }

  private isMilestoneNotTouched(): any {
    return milestone => milestone.status && (milestone.status.toLowerCase() === 'Available'
      || milestone.status.toLowerCase() === 'not applicable');
  }

  private isMilestoneActive(): any {
    return milestone => milestone.status && milestone.status.toLowerCase() === 'completed';
  }

  private isMilestoneVisited(): any {
    return milestone => milestone.status && (milestone.status.toLowerCase() === 'completed'
      || milestone.status.toLowerCase() === 'not applicable');
  }

  private isMilestoneCompletedAndNotApplicable(): any {
    return milestone => milestone.status && (milestone.status.toLowerCase() === 'completed'
      || milestone.status.toLowerCase() === 'not applicable');
  }

  // ----------------------------------------------------------------------------------------

  editDate(phase) {
    switch (phase) {
      case 'ideate': {
        this.editIdeateTargetDate = true;
        break;
      }
      case 'plan': {
        this.editPlanTargetDate = true;
        break;
      }
      case 'setup': {
        this.editSetUpTargetDate = true;
        break;
      }
      case 'launch': {
        this.editLanchTargetDate = true;
        break;
      }
      default: {
        break;
      }
    }
  }

  //  Target date for the phase is updated.
  onValueChange(phase, value: Date): void {

    // Strategy review date
    const stratReviewDate = this.offerPhaseDetailsList['ideate'][3].targetDate;

    // Design review date
    const designReviewDate = this.offerPhaseDetailsList['plan'][4].targetDate;

    // readiness review date
     const readinessReviewDate = this.offerPhaseDetailsList['setup'][3].targetDate;

    // launch review date
    // const launchreviewdate = this.offerPhaseDetailsList['launch'][3].targetDate;

    let updateDate = true;

    const payLoad = {
      caseId: this.caseId
    };

    switch (phase) {
      case 'ideate': {
        this.editIdeateTargetDate = false;
        payLoad['strategyReviewDate'] = value.toISOString();
        if (!this.validateTargetDates(value, designReviewDate, null, null)) {
          updateDate = false;
          this.showAlert = true;
        } else {
          this.showAlert = false;
        }
        break;
      }
      case 'plan': {
        this.editPlanTargetDate = false;
        payLoad['designReviewDate'] = value.toISOString();
        if (!this.validateTargetDates(stratReviewDate, value, null, null)) {
          updateDate = false;
          this.showAlert = true;
        } else {
          this.showAlert = false;
        }
        break;
      }
      case 'setup': {
        this.editSetUpTargetDate = false;
        payLoad['readinessReviewDate'] = value.toISOString();
        if (!this.validateTargetDates(readinessReviewDate, value, null, null)) {
          updateDate = false;
          this.showAlert = true;
        } else {
          this.showAlert = false;
        }
        break;
      }
      case 'launch': {
        this.editLanchTargetDate = false;
        payLoad['launchDate'] = value.toISOString();
        break;
      }
      default: {
        break;
      }
    }


    const updateDBpayLoad = {
      offerId: this.currentOfferId
    };

    switch (phase) {
      case 'ideate': {
        this.editIdeateTargetDate = false;
        updateDBpayLoad['strategyReviewDate'] = value.toISOString();
        if (!this.validateTargetDates(value, designReviewDate, readinessReviewDate, null)) {
          updateDate = false;
          this.showAlert = true;
        } else {
          this.showAlert = false;
        }
        break;
      }
      case 'plan': {
        this.editPlanTargetDate = false;
        updateDBpayLoad['designReviewDate'] = value.toISOString();
        if (!this.validateTargetDates(stratReviewDate, value, readinessReviewDate, null)) {
          updateDate = false;
          this.showAlert = true;
        } else {
          this.showAlert = false;
        }
        break;
      }
      case 'setup': {
        this.editSetUpTargetDate = false;
        updateDBpayLoad['readinessReviewDate'] = value.toISOString();
        if (!this.validateTargetDates(stratReviewDate, designReviewDate, value, null)) {
          updateDate = false;
          this.showAlert = true;
        } else {
          this.showAlert = false;
        }
        break;
      }
      case 'launch': {
        this.editLanchTargetDate = false;
        updateDBpayLoad['launchDate'] = value.toISOString();
        break;
      }
      default: {
        break;
      }
    }

    if (updateDate) {
      this.rightPanelService.updatePhaseTargetDate(payLoad).subscribe((data) => {
        if (phase === 'ideate') {
          this.offerPhaseDetailsList['ideate'][3].targetDate = value;
        } else if (phase === 'plan') {
          this.offerPhaseDetailsList['plan'][4].targetDate = value;
        } else if (phase === 'setup') {
          this.offerPhaseDetailsList['setup'][3].targetDate = value;
        } else if (phase === 'launch') {
          this.offerPhaseDetailsList['launch'][3].targetDate = value;
        }
        this.rightPanelService.updatePhaseTargetDateInDB(updateDBpayLoad).subscribe((data) => {
          console.log(updateDBpayLoad);
        });
      },
        (error) => {
        });
    }
  }

  validateTargetDates(stratReviewDate, designReviewDate, setupReviewDate, launchReviewDate): boolean {

    const srDate = moment(stratReviewDate).format('MM-DD-YYYY');
    const drDate = moment(designReviewDate).format('MM-DD-YYYY');
    const erDate = moment(setupReviewDate).format('MM-DD-YYYY');
    // const lrDate = moment(launchReviewDate).format('MM-DD-YYYY');

    if (srDate < drDate) {
      return true;
    }
    if(drDate < erDate){
      return true;
    }
  }

  // ----------------------------------------------------------------------------------------

  async showLeadTimeDailog() {

    // Initialize Params
    const maxWeekDuration = 20;
    this.mmModel = this.derivedMM;
    this.leadTimeYear = new Date().getFullYear() - 1;

    if (this.displayLeadTime) {

      // Compute Offer Dates
      this.rightPanelService.displayOfferDates(this.caseId).subscribe(
        (leadTimeObj) => {
          this.launchDate = moment(leadTimeObj['launchDate']).format('DD-MMM-YYYY');
          this.designReviewDate = moment(leadTimeObj['designReviewDate']).format('DD-MMM-YYYY');
          this.strategyReviewDate = moment(leadTimeObj['strategyReviewDate']).format('DD-MMM-YYYY');
          this.readinessReviewDate = moment(leadTimeObj['readinessReviewDate']).format('DD-MMM-YYYY');
        });

      try {


        // Compute Expected Launch Date
        this.displayLeadTimeButton = true;
        const expectedLaunchDateObject = await this.rightPanelService.displayLaunchDate(this.currentOfferId).toPromise();
        this.expectedLaunchDate = moment(expectedLaunchDateObject['expectedLaunchDate']).format('DD-MMM-YYYY');
        const noOfWeeksDifference = expectedLaunchDateObject['noOfWeeksDifference'];

        // Compute Average Week Count
        const averageWeekCountObject = await this.rightPanelService.displayAverageWeeks(this.primaryBE, this.mmModel).toPromise();
        this.averageOfRemainingNinetyPercentileWeeks = averageWeekCountObject['averageOfRemainingNinetyPercentile'] ? Number(averageWeekCountObject['averageOfRemainingNinetyPercentile']).toFixed(1) : 0;
        this.averageOfTopTenPercentileWeeks = averageWeekCountObject['averageOfTopTenPercentile'] ? Number(averageWeekCountObject['averageOfTopTenPercentile']).toFixed(1) : 0;
        this.averageOverallWeeks = averageWeekCountObject['averageOverall'] ? Number(averageWeekCountObject['averageOverall']).toFixed(1) : 0;
        this.countOfHundredPercentile = averageWeekCountObject['countOfHundredPercentile'] ? Number(averageWeekCountObject['countOfHundredPercentile']).toFixed(1) : 0;

        this.remainingNinetyPercentileCompare = (Number(Number(noOfWeeksDifference) - this.averageOfRemainingNinetyPercentileWeeks)).toFixed(1);
        this.topTenPercentileWeeksCompare = (Number(Number(noOfWeeksDifference) - this.averageOfTopTenPercentileWeeks)).toFixed(1);
        this.overallWeeksCompare = (Number(Number(noOfWeeksDifference) - this.averageOverallWeeks)).toFixed(1);


        this.averageOfRemainingNinetyPercentile = Math.round(100 * this.averageOfRemainingNinetyPercentileWeeks / Number(averageWeekCountObject['countOfHundredPercentile']));
        this.averageOfTopTenPercentile = Math.round(this.averageOfTopTenPercentileWeeks * 100 / Number(averageWeekCountObject['countOfHundredPercentile']));
        this.averageOverall = Math.round(this.averageOverallWeeks * 100 / Number(averageWeekCountObject['countOfHundredPercentile']));


        // Initialize Average Week Count To N/A When Applicable
        if (parseInt(this.averageWeekCount, 2) === 0) {
          this.averageWeekCount = 'N/A';
        }



        // Compute Progree Bar Width
        this.progressBarWidth = Math.floor((Number(this.averageWeekCount) / maxWeekDuration * 100));
      } catch (err) {
        this.averageOfRemainingNinetyPercentileWeeks = 'N/A';
        this.averageOfTopTenPercentileWeeks = 'N/A';
        this.averageOverallWeeks = 'N/A';
        this.countOfHundredPercentile = 'N/A';
        this.remainingNinetyPercentileCompare = 'N/A';
        this.topTenPercentileWeeksCompare = 'N/A';
        this.overallWeeksCompare = 'N/A';
        this.averageOfRemainingNinetyPercentile = 0;
        this.averageOfTopTenPercentile = 0;
        this.averageOverall = 0;
        // this.error = 'No content found!';
      }
      this.loadingLeadTime = false;

    }
  }

  // ----------------------------------------------------------------------------------------

  getKeys(obj) {
    if (typeof obj === 'object') {
      return Object.keys(obj);
    } else {
      return [];
    }
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

  // ----------------------------------------------------------------------------------------

  navigate(name) {
    if (this.navigateHash[name] !== null) {
      this.router.navigate(this.navigateHash[name]);
    }
  }

  // ----------------------------------------------------------------------------------------


  goScalabilityIndex() {
    this.router.navigate(['/oas']);
  }

  // ----------------------------------------------------------------------------------------

  updateStakeHodlerInfo(updatedStakeHolderInfo: any) {
    this.stakeData = updatedStakeHolderInfo;
  }

  showStakeHolderDialog() {
      this.addStakeHolder = true;
  }

  closeStakeHolderDialog() {

    this.addStakeHolder = false;
    const stakeHolderMapInfo = [];

    this.stakeHolderService.retrieveOfferDetails(this.currentOfferId).subscribe(offerDetails => {

      offerDetails['stakeholders'].forEach(stakeHolder => {

        if (stakeHolderMapInfo[stakeHolder['offerRole']] == null) {
          stakeHolderMapInfo[stakeHolder['offerRole']] = [];
        }

        // Stake Holder Info To Display Acc 2 Functional Role On UI
        stakeHolderMapInfo[stakeHolder['offerRole']].push(
          {
            userName: stakeHolder['name'],
            emailId: stakeHolder['_id'] + '@cisco.com',
          });

      });

    });

    // Update Stake Holder Info
    this.stakeData = stakeHolderMapInfo;


  }

  // ----------------------------------------------------------------------------------------


}

