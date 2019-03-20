import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCollaboratorService } from '../services/search-collaborator.service';
import { StakeHolder } from '../models/stakeholder';
import { StakeHolderDTO } from '../models/stakeholderdto';
import { Collaborators } from '../models/collaborator';
import { OfferPhaseService } from '../services/offer-phase.service';
import { MonetizationModelService } from '../services/monetization-model.service';
import { SharedService } from '../shared-service.service';
import { RightPanelService } from '../services/right-panel.service';
import { LeadTime } from './lead-time';
import * as moment from 'moment';
import { async } from '@angular/core/testing';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CreateOfferService } from '@shared/services';

const searchOptions = ['Option1', 'Option2', 'Option3', 'Option4'];
@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css']
})
export class RightPanelComponent implements OnInit, OnDestroy {
  notiFication: Boolean = false;
  Math = Math;
  isNaN = isNaN;

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
  // error = '';

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private createOfferService: CreateOfferService,
    private searchCollaboratorService: SearchCollaboratorService,
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

        this.createOfferService.subscribeMMAssessment(data);
        this.offerData = data;
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

          Object.keys(this.phaseTaskMap).forEach(phase => {
            // console.log(phase);
          });
        }
      });
    }

    if (this.events !== undefined) {
      this.eventsSubscription = this.events.subscribe((data) => this.storeOwnerId(data));
    }




  }

  /**
   * Method to store offer owner id in an aray
   * @param data offer Owner Id
   */
  storeOwnerId(data) {
    this.alreayAddedStakeHolders.push(data);
  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

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

  showDialog() {
    this.display = true;
  }

  showOfferPhaseDailog() {
    this.displayOfferPhase = true;
  }



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


  onHide() {
    this.display = false;
    // this.collaboratorsList = [];
    this.addEditCollaboratorsForm.reset();
  }

  closeDailog() {
    this.display = false;
    // this.collaboratorsList = [];
    this.addEditCollaboratorsForm.reset();
  }

  closeOfferPhaseDailog() {
    this.displayOfferPhase = false;
  }


  /**
   * Edit the tagetdate
   * @param phase
   */
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

  /**
   * validate target dates.
   * @param stratReviewDate
   * @param designReviewDate
   * @param executeReviewDate
   * @param launchReviewDate
   */
  validateTargetDates(stratReviewDate, designReviewDate, executeReviewDate, launchReviewDate): boolean {

    const srDate = moment(stratReviewDate).format('MM-DD-YYYY');
    const drDate = moment(designReviewDate).format('MM-DD-YYYY');
    // const erDate = moment(executeReviewDate).format('MM-DD-YYYY');
    // const lrDate = moment(launchReviewDate).format('MM-DD-YYYY');

    if (srDate < drDate) {
      return true;
    }
  }

  /**
   * Target date for the phase is updated.
   * @param phase
   * @param value
   */
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

  removeAlert() {
    this.showAlert = false;
  }

  onSearch() {

    const tempCollaboratorList: Collaborators[] = [];
    const tempVar = this.addEditCollaboratorsForm.controls['name'].value;
    const userName = this.addEditCollaboratorsForm.controls['name'].value;
    const businessEntity = this.addEditCollaboratorsForm.controls['businessEntity'].value;
    const functionalRole = this.addEditCollaboratorsForm.controls['functionName'].value;

    const payLoad = {
    };

    if (userName !== undefined && userName != null && userName.includes('@')) {
      payLoad['emailId'] = userName;
    } else {
      payLoad['userName'] = userName;
    }

    if (businessEntity !== undefined && businessEntity != null) {
      payLoad['userMappings'] = [{
        'businessEntity': businessEntity
      }];
    }

    if (functionalRole !== undefined && functionalRole != null) {
      payLoad['userMappings'] = [{
        'functionalRole': functionalRole
      }];
    }


    if ((businessEntity !== undefined && businessEntity != null) &&
      (functionalRole !== undefined && functionalRole != null)) {
      payLoad['userMappings'] = [{
        'businessEntity': businessEntity,
        'functionalRole': functionalRole
      }];
    }

    this.searchCollaboratorService.searchCollaborator(payLoad)
      .subscribe(data => {
        this.selectedCollabs = [];
        data.forEach(element => {

          const collaborator = new Collaborators();
          collaborator.email = element.emailId;
          collaborator.name = element.userName;
          collaborator.functionalRole = element.userMappings[0].functionalRole;
          collaborator.businessEntity = element.userMappings[0].businessEntity;

          element.userMappings[0].appRoleList.forEach(appRole => {
            collaborator.applicationRole.push(appRole);
          });
          collaborator.offerRole = collaborator.applicationRole[0];

          tempCollaboratorList.push(collaborator);
        });
        this.collaboratorsList = tempCollaboratorList;
      },
        error => {
          console.log('error occured');
          alert('Sorry, but something went wrong.');
          this.collaboratorsList = [];
        });
  }

  getKeys(obj) {
    if (typeof obj === 'object') {
      return Object.keys(obj);
    } else {
      return [];
    }
  }

  addToStakeData(res) {
    const keyUsers = res['stakeholders'];
    keyUsers.forEach(user => {
      if (this.stakeData[user['functionalRole']] == null) {
        this.stakeData[user['functionalRole']] = [];
      }
      if (this.alreayAddedStakeHolders.findIndex(k => k === user['_id']) === -1) {
        this.stakeData[user['functionalRole']].push(
          {
            userName: user['userName'],
            emailId: user['email'],
            _id: user['_id'],
            userMappings: [{
              appRoleList: [user['functionalRole']],
              businessEntity: user['businessEntity'],
              functionalRole: user['functionalRole']
            }
            ],
            stakeholderDefaults: false
          });
        this.alreayAddedStakeHolders.push(user['_id']);
      }
    });

    console.log(this.stakeData);
  }

  getUserIdFromEmail(email): any {
    var arrayOfStrings = email.split('@');
    return arrayOfStrings[0];
  }

  addCollaborator() {

    const listOfStakeHolders: StakeHolder[] = [];
    const stakeHolderDto = new StakeHolderDTO();

    this.selectedCollabs.forEach(element => {
      const stakeHolder = new StakeHolder();
      stakeHolder.businessEntity = element.businessEntity;
      stakeHolder.functionalRole = element.functionalRole;
      stakeHolder.offerRole = element.functionalRole;
      stakeHolder._id = this.getUserIdFromEmail(element.email);
      stakeHolder.email = element.email;
      stakeHolder.userName = element.name;
      listOfStakeHolders.push(stakeHolder);
    });


    this.selectedCollabs = [];
    stakeHolderDto.offerId = this.currentOfferId;
    stakeHolderDto.stakeholders = listOfStakeHolders;

    this.addToStakeData(stakeHolderDto);
    this.updateStakeData.next('');
    this.display = false;

  }

  show_deliveryDesc() {
    this.backdropCustom = true;
  }

  onSaveClick() {
    this.backdropCustom = false;
    this.notiFication = true;
    setTimeout(() => {
      this.notiFication = false;
    }, 3000);
  }

  onCancelClick() {
    this.backdropCustom = false;
  }

  onOfferClick() {
    this.portfolioFlag = true;
    this.router.navigate(['/coolOffer']);

  }

  onProceedBtnClicked() {
    this.createOfferService._coolOfferSubscriber.subscribe(data => {
      this.offerData = data;
    });

    if (this.offerData.offerObj && this.offerData.offerObj.mmMapperStatus === 'Not Aligned') {

      alert('Status is \'Not Aligned\'!. You cannot proceed with stakeholder identification.');

    } else {

      document.location.href = 'http://owb1-stage.cloudapps.cisco.com/owb/owb/showHome#/manageOffer/editPlanReview/' + this.currentOfferId;

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

  arrToOptions(arr) {
    const res = [];
    arr.forEach(a => {
      res.push({ 'label': a, 'value': a });
    });
    return res;
  }

  navigate(name) {
    if (this.navigateHash[name] !== null) {
      this.router.navigate(this.navigateHash[name]);
    }
  }

  goScalabilityIndex() {
    this.router.navigate(['/oas']);
  }

}

