import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCollaboratorService } from '../services/search-collaborator.service';
import { OfferPhaseService } from '../services/offer-phase.service';
import { MonetizationModelService } from '../services/monetization-model.service';
import { SharedService } from '../shared-service.service';
import { RightPanelService } from '../services/right-panel.service';
import { LeadTime } from './lead-time';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CreateOfferService } from '@shared/services';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css']
})
export class RightPanelComponent implements OnInit, OnDestroy {


  @Input() portfolioFlag: Boolean = false;
  @Output() updateStakeData = new EventEmitter<string>();

  navigateHash: Object = {};
  backdropCustom: Boolean = false;
  proceedFlag: boolean;
  subscription: Subscription;
  aligned: boolean;
  currentOfferId;
  phaseTaskMap: object;
  phaseList: string[];
  display: Boolean = false;
  displayOfferPhase: Boolean = false;
  collaboratorsList;
  addEditCollaboratorsForm: FormGroup;
  selectedCollabs;
  entityList;
  funcionalRoleList;
  caseId;
  offerPhaseDetailsList;
  ideateCount: any = 0;
  ideateCompletedCount = 0;
  planCount = 0;
  planCompletedCount = 0;
  mStoneCntInAllPhases: any[] = ['ideate', 'plan', 'execute', 'launch'];
  mileStoneStatus: any[] = [];
  phaseProcessingCompleted = false;
  offerName;
  alreayAddedStakeHolders: any[] = [];
  ddFunction = 'Select Function';
  flagFunction = false;
  private eventsSubscription: any;
  @Input() events: Observable<string>;

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

  @Input() offerId: string;
  @Input() stakeData: Object;
  @Input() derivedMM: string;
  @Input() primaryBE: string;
  @Input() offerBuilderdata: Object;
  @Input() noOfWeeksDifference: string;
  @Input() displayLeadTime: Boolean = false;

  addStakeHolder: Boolean = false;

  offerData;
  dotBox = [
    {
      status: 'Completed',
      statuscontent: 'Initial MM Assesment'
    },
    {
      status: 'Completed',
      statuscontent: 'Initial offer Dimension'
    }
    ,
    {
      status: 'In Progress',
      statuscontent: 'Stakeholders Identified'
    },
    {
      status: 'Completed',
      statuscontent: 'Offer Portfolio'
    },
    {
      status: 'In Progress',
      statuscontent: 'Strategy Review Completion'
    },
    {
      status: 'Pending',
      statuscontent: 'Offer Construct Details'
    }
  ];

  OfferOwners;
  approvars;


  userPanels = {
    'panel1': false,
    'panel2': true
  };

  editIdeateTargetDate: Boolean = false;
  editPlanTargetDate: Boolean = false;
  editExecuteTargetDate: Boolean = false;
  editLanchTargetDate: Boolean = false;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  minDate: Date;
  showAlert: Boolean = false;

  averageOfRemainingNinetyPercentileWeeks;
  averageOfTopTenPercentileWeeks;
  averageOverallWeeks;
  averageOfRemainingNinetyPercentile = 0;
  averageOfTopTenPercentile = 0;
  averageOverall = 0;
  countOfHundredPercentile;
  remainingNinetyPercentileCompare;
  topTenPercentileWeeksCompare;
  overallWeeksCompare;

  loadingLeadTime = true;

  // ----------------------------------------------------------------------------------------

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private createOfferService: CreateOfferService,
    private offerPhaseService: OfferPhaseService,
    private monetizationModelService: MonetizationModelService,
    private sharedService: SharedService,
    private rightPanelService: RightPanelService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
    if (!this.currentOfferId) {
      this.currentOfferId = this.createOfferService.coolOffer.offerId;
    }
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

    this.ideateCount = this.offerPhaseDetailsList['ideate'].length;
    this.planCount = this.offerPhaseDetailsList['plan'].length;

    this.offerPhaseDetailsList.ideate.forEach(element => {
      if (element.status === 'Completed') {
        this.ideateCompletedCount = this.ideateCompletedCount + 1;
      }
    });

    this.offerPhaseDetailsList.plan.forEach(element => {
      if (element.status === 'Completed') {
        this.planCompletedCount = this.ideateCompletedCount + 1;
      }
    });

    this.monetizationModelService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
      this.offerName = data['offerName'];
    });

    this.offerPhaseService.getCurrentOfferPhaseInfo(this.caseId).subscribe(data => {
      this.processCurrentPhaseInfo(data);
    });

    // Get Functional Roles
    this.sharedService.getFunctionalRoles().subscribe(data => {
      this.funcionalRoleList = data;
    });

    // Get Business Entities
    this.sharedService.getBusinessEntity().subscribe(data => {
      const businessEntities = <any>data;
      const beArry = [];
      businessEntities.forEach(element => {
        if (element.BE !== null) {
          beArry.push(element.BE);
        }
      });
      this.entityList = beArry;
    });

    this.addEditCollaboratorsForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      businessEntity: new FormControl(null, Validators.required),
      functionName: new FormControl(null, Validators.required)
    });

    if (this.currentOfferId) {

      this.createOfferService.getMMMapperById(this.currentOfferId).subscribe(data => {

        this.offerData = data;
        this.createOfferService.subscribeMMAssessment(data);

        if (this.offerData.offerObj) {
          this.OfferOwners = this.offerData.offerObj.owners;
          this.approvars = this.offerData.offerObj.approvars;

          if (this.OfferOwners) {
            this.OfferOwners.forEach(item => {
              item.caption = '';
              item.caption = item.firstName.charAt(0) + '' + item.lastName.charAt(0);
            });
          }
          if (this.approvars) {
            this.approvars.forEach(item => {
              item.caption = '';
              item.caption = item.firstName.charAt(0) + '' + item.lastName.charAt(0);
            });
          }

        }
        if (this.offerData.phaseTaskList) {
          this.phaseTaskMap = this.offerData.phaseTaskList;

          this.phaseList = Object.keys(this.phaseTaskMap);

        }
      });
    }


  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
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

  showDialog() {
    this.display = true;
  }

  closeDailog() {
    this.display = false;
    // this.collaboratorsList = [];
    this.addEditCollaboratorsForm.reset();
  }

  // ----------------------------------------------------------------------------------------

  processCurrentPhaseInfo(phaseInfo) {
    this.mStoneCntInAllPhases.forEach(element => {
      const obj = {};
      let count = 0;
      const phase = phaseInfo[element];
      if (phase !== undefined) {
        phase.forEach(element => {
          if (element.status === 'Completed') {
            count = count + 1;
          }
        });
        obj['phase'] = element;
        if (count > 0 && count < 4) {
          obj['status'] = 'active';
        } else if (count === 4) {
          obj['status'] = 'visited';
        } else if (count === 0) {
          obj['status'] = '';
        }
      } else {
        obj['phase'] = element;
        obj['status'] = '';
      }
      this.mileStoneStatus.push(obj);
    });
    this.phaseProcessingCompleted = true;
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
      case 'execute': {
        this.editExecuteTargetDate = true;
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

    // execute review date
    // const executereviewdate = this.offerPhaseDetailsList['execute'][3].targetDate;

    // readiness review date
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
      case 'execute': {
        this.editExecuteTargetDate = false;
        payLoad['launchDate'] = value.toISOString();
        break;
      }
      case 'launch': {
        this.editLanchTargetDate = false;
        payLoad['readinessReviewDate'] = value.toISOString();
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
        updateDBpayLoad['designReviewDate'] = value.toISOString();
        if (!this.validateTargetDates(stratReviewDate, value, null, null)) {
          updateDate = false;
          this.showAlert = true;
        } else {
          this.showAlert = false;
        }
        break;
      }
      case 'execute': {
        this.editExecuteTargetDate = false;
        updateDBpayLoad['launchDate'] = value.toISOString();
        break;
      }
      case 'launch': {
        this.editLanchTargetDate = false;
        updateDBpayLoad['readinessReviewDate'] = value.toISOString();
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
        } else if (phase === 'execute') {
          this.offerPhaseDetailsList['execute'][3].targetDate = value;
        } else if (phase === 'launch') {
          this.offerPhaseDetailsList['launch'][3].targetDate = value;
        }
        this.rightPanelService.updatePhaseTargetDateInDB(updateDBpayLoad).subscribe((data) => {
          console.log(updateDBpayLoad);
        })
      },
        (error) => {
        });
    }
  }

  validateTargetDates(stratReviewDate, designReviewDate, executeReviewDate, launchReviewDate): boolean {

    const srDate = moment(stratReviewDate).format('MM-DD-YYYY');
    const drDate = moment(designReviewDate).format('MM-DD-YYYY');
    // const erDate = moment(executeReviewDate).format('MM-DD-YYYY');
    // const lrDate = moment(launchReviewDate).format('MM-DD-YYYY');

    if (srDate < drDate) {
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
        const expectedLaunchDateObject = await this.rightPanelService.displayLaunchDate(this.offerId).toPromise();
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
    let names = name.split(' ');
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

  showStakeHolderInfo() {
    this.addStakeHolder = true;
  }

  // ----------------------------------------------------------------------------------------


}

