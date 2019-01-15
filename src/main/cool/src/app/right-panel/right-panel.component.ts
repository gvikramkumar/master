import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCollaboratorService } from '../services/search-collaborator.service';
import { AddEditCollaborator } from '../create-offer-cool/add-edit-collaborator';
import { StakeHolder } from '../models/stakeholder';
import { StakeHolderDTO } from '../models/stakeholderdto';
import { Collaborators } from '../models/collaborator';
import { OfferPhaseService } from '../services/offer-phase.service';
import { MonetizationModelService } from '../services/monetization-model.service';
import { SharedService } from '../shared-service.service';

const searchOptions = ['Option1', 'Option2', 'Option3', 'Option4'];
@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css']
})
export class RightPanelComponent implements OnInit {
  notiFication: Boolean = false;
  @Input() portfolioFlag: Boolean = false;
  @Input() stakeData: Object;
  @Output() updateStakeData = new EventEmitter<string>();
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

  search = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term.length < 0 ? []
          : searchOptions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      );

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private createOfferService: CreateOfferService,
    private searchCollaboratorService: SearchCollaboratorService,
    private offerPhaseService: OfferPhaseService,
    private monetizationModelService: MonetizationModelService,
    private sharedService: SharedService) {
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

    this.monetizationModelService.getOfferBuilderData(this.currentOfferId).subscribe(data => {
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
      console.log(data);
      let businessEntities = <any>data;
      let beArry = [];
      businessEntities.forEach(element => {
        if (element.BE !== null) {
          beArry.push(element.BE);
        }
      });
      this.entityList = beArry;
      console.log(this.entityList);
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
        this.OfferOwners = this.offerData.offerObj.owners;
        this.approvars = this.offerData.offerObj.approvars;

        this.phaseTaskMap = this.offerData.phaseTaskList;

        this.phaseList = Object.keys(this.phaseTaskMap);

        Object.keys(this.phaseTaskMap).forEach(phase => {
          // console.log(phase);
        });

        if (this.OfferOwners) {
          this.OfferOwners.forEach(item => {
            item.caption = "";
            item.caption = item.firstName.charAt(0) + "" + item.lastName.charAt(0)
          })
        }
        if (this.approvars) {
          this.approvars.forEach(item => {
            item.caption = "";
            item.caption = item.firstName.charAt(0) + "" + item.lastName.charAt(0)
          })
        }
      })
    }

    this.eventsSubscription = this.events.subscribe((data) => this.storeOwnerId(data))
  }

  /**
   * Method to store offer owner id in an aray
   * @param data offer Owner Id
   */
  storeOwnerId(data) {
    this.alreayAddedStakeHolders.push(data);
  }

  ngOnDestroy() {
    if (this.eventsSubscription)
      this.eventsSubscription.unsubscribe()
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

  onHide() {
    this.display = false;
    this.collaboratorsList = [];
    this.addEditCollaboratorsForm.reset();
  }

  closeDailog() {
    this.display = false;
    this.collaboratorsList = [];
    this.addEditCollaboratorsForm.reset();
  }

  closeOfferPhaseDailog() {
    this.displayOfferPhase = false;
  }

  onSearch() {
    let tempCollaboratorList: Collaborators[] = [];

    const tempVar = this.addEditCollaboratorsForm.controls['name'].value;
    const userName = this.addEditCollaboratorsForm.controls['name'].value;
    const businessEntity = this.addEditCollaboratorsForm.controls['businessEntity'].value;
    const functionalRole = this.addEditCollaboratorsForm.controls['functionName'].value;

    const payLoad = {
    };

    if (userName !== undefined && userName != null && userName.includes('@')) {
      payLoad['emailId'] = userName;
    } else {
      payLoad['userName'] = userName
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
    console.log(res);
    let keyUsers = res['stakeholders'];
    keyUsers.forEach(user => {
      if (this.stakeData[user['offerRole']] == null) {
        this.stakeData[user['offerRole']] = [];
      }
      if (this.alreayAddedStakeHolders.findIndex(k => k == user['_id']) == -1) {
        console.log(user['_id']);
        this.stakeData[user['offerRole']].push(
          {
            userName: user['userName'],
            emailId: user['email'],
            _id: user['_id'],
            userMappings: [{
              appRoleList: [user['offerRole']],
              businessEntity: user['businessEntity'],
              functionalRole: user['functionalRole']
            }
            ],
            stakeholderDefaults: false
          });
        this.alreayAddedStakeHolders.push(user['_id']);
      }
    })

    console.log(this.stakeData);
  }

  getUserIdFromEmail(email): any {
    var arrayOfStrings = email.split('@');
    return arrayOfStrings[0];
  }

  addCollaborator() {
    const listOfStakeHolders: StakeHolder[] = [];
    const stakeHolderDto = new StakeHolderDTO();
    console.log(this.selectedCollabs);
    this.selectedCollabs.forEach(element => {
      console.log(element);
      let stakeHolder = new StakeHolder();
      stakeHolder.businessEntity = element.businessEntity;
      stakeHolder.functionalRole = element.functionalRole;
      stakeHolder.offerRole = element.offerRole;
      stakeHolder._id = this.getUserIdFromEmail(element.email);
      stakeHolder.email = element.email;
      stakeHolder.userName = element.name;
      listOfStakeHolders.push(stakeHolder);
    });
    this.selectedCollabs = [];
    stakeHolderDto.offerId = this.currentOfferId;
    stakeHolderDto.stakeholders = listOfStakeHolders;
    console.log(stakeHolderDto);

    let that = this;
    //this.searchCollaboratorService.addCollaborators(stakeHolderDto).subscribe(data => {
    // update stakeData from data posted response
    that.addToStakeData(stakeHolderDto);
    //});
    this.updateStakeData.next("");
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

    if (this.offerData.offerObj.mmMapperStatus == 'Not Aligned') {

      alert('Status is \'Not Aligned\'!. You cannot proceed with stakeholder identification.');

    } else {

      document.location.href = "http://owb1-stage.cloudapps.cisco.com/owb/owb/showHome#/manageOffer/editPlanReview/" + this.currentOfferId;

    }
  }

  getInitialChar(name) {
    if (name == null) return ""
    let names = name.split(' ');
    let initials = "";
    initials += names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[1].charAt(0).toUpperCase();
    }
    return initials;
  }

  arrToOptions(arr) {
    let res = [];
    arr.forEach(a => {
      res.push({ 'label': a, 'value': a });
    })
    return res;
  }
}
