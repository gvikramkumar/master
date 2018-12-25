import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import { Subscription } from 'rxjs/Subscription';
import { CreateOfferService } from '../services/create-offer.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCollaboratorService } from '../services/search-collaborator.service';
import { AddEditCollaborator } from '../create-offer-cool/add-edit-collaborator';
import { StakeHolder } from '../models/stakeholder';
import { StakeHolderDTO } from '../models/stakeholderdto';
import { Collaborators } from '../models/collaborator';
import { MonetizationModelService } from '../services/monetization-model.service'
// import { Hash } from 'crypto';

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
  @Input() offerOwner: String;
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
  ddFunction = 'Select Function';
  flagFunction = false;

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

  ideatePhaseDetailsList = [
    {
      ideate: 'Offer Registration',
      status: 'Completed',
      targetDate: '06-Dec-2018',
      completionDate: '06-Dec-2018'
    },
    {
      ideate: 'Offer Model Evalution',
      status: 'Completed',
      targetDate: '06-Dec-2018',
      completionDate: '06-Dec-2018'
    },
    {
      ideate: 'Stakeholder Identification',
      status: 'Completed',
      targetDate: '06-Dec-2018',
      completionDate: '06-Dec-2018'
    },
    {
      ideate: 'Strategy Review',
      status: 'Completed',
      targetDate: '06-Dec-2018',
      completionDate: '06-Dec-2018'
    }
  ];

  planPhaseDetailsList = [
    {
      plan: 'Offer Completion',
      status: 'Completed',
      targetDate: '06-Dec-2018',
      completionDate: '06-Dec-2018'
    },
    {
      plan: 'Offer Solutioning',
      status: 'In Progress',
      targetDate: '06-Dec-2018',
      completionDate: '06-Dec-2018'
    },
    {
      plan: 'Offer Construct',
      status: 'Dependency',
      targetDate: '06-Dec-2018',
      completionDate: '06-Dec-2018'
    },
    {
      plan: 'Offer Construct Details',
      status: 'Not Available',
      targetDate: '06-Dec-2018',
      completionDate: '06-Dec-2018'
    },
    {
      plan: 'Design Review',
      status: 'Not Available',
      targetDate: '06-Dec-2018',
      completionDate: '06-Dec-2018'
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
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 0 ? []
        : searchOptions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private createOfferService: CreateOfferService,
    private searchCollaboratorService: SearchCollaboratorService,
    private monetizationModelService: MonetizationModelService,
    ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
    });
    if (!this.currentOfferId) {
      this.currentOfferId = this.createOfferService.coolOffer.offerId;
    }
  }

  ngOnInit() {
    this.createOfferService.getPrimaryBusinessUnits()
      .subscribe(data => {
        this.entityList = data.primaryBE;
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
        console.log(this.offerData);
        this.OfferOwners = this.offerData.offerObj.owners;
        this.approvars = this.offerData.offerObj.approvars;

        this.phaseTaskMap = this.offerData.phaseTaskList;

        this.phaseList = Object.keys(this.phaseTaskMap);

        Object.keys(this.phaseTaskMap).forEach(phase => {
          console.log(phase);
        });

        if (this.OfferOwners) {
          this.OfferOwners.forEach(item => {
            item.caption = '';
            item.caption = item.firstName.charAt(0) + '' + item.lastName.charAt(0)
          })
        }
        if (this.approvars) {
          this.approvars.forEach(item => {
            item.caption = '';
            item.caption = item.firstName.charAt(0) + '' + item.lastName.charAt(0)
          });
        }
      });
    }
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
    const tempCollaboratorList: Collaborators[] = [];
    const searchCollaborator: AddEditCollaborator = new AddEditCollaborator(
      this.addEditCollaboratorsForm.controls['name'].value,
      this.addEditCollaboratorsForm.controls['businessEntity'].value,
      this.addEditCollaboratorsForm.controls['functionName'].value);
    this.searchCollaboratorService.searchCollaborator(searchCollaborator)
      .subscribe(data => {
        data.forEach(element => {
          const collaborator = new Collaborators();
          collaborator.applicationRole = element.applicationRole;
          collaborator.businessEntity = element.businessEntity;
          collaborator.email = element.email;
          collaborator.functionalRole = element.functionalRole;
          collaborator.name = element.name;
          collaborator.offerRole = element.applicationRole[0]; 
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
    return Object.keys(obj);
  }

  addToStakeData(res) {
    console.log(res);
    const keyUsers = res['stakeholders'];
    keyUsers.forEach(user => {
      if (this.stakeData[user['offerRole']] == null) {
        this.stakeData[user['offerRole']] = [];
      }
      this.stakeData[user['offerRole']].push({ name: user['_id'], email: 'sample@sample.com' });
    });
  }

  getUserIdFromEmail(email): any {
    const arrayOfStrings = email.split('@');
    return arrayOfStrings[0];
  }

  addCollaborator() {
    // debugger
    const listOfStakeHolders: StakeHolder[] = [];
    const stakeHolderDto = new StakeHolderDTO();

    this.selectedCollabs.forEach(element => {
      const stakeHolder = new StakeHolder();
      stakeHolder.businessEntity = element.businessEntity;
      stakeHolder.functionalRole = element.functionalRole;
      stakeHolder.offerRole = element.offerRole;
      stakeHolder._id = this.getUserIdFromEmail(element.email);
      // stakeHolder.email = element.email; //add email for post
      listOfStakeHolders.push(stakeHolder);
    });

    stakeHolderDto.offerId = this.currentOfferId;
    stakeHolderDto.stakeholders = listOfStakeHolders;
    console.log(stakeHolderDto);
    console.log('before service call');
    const that = this;
    this.searchCollaboratorService.addCollaborators(stakeHolderDto).subscribe(data => {
      // update stakeData from data posted response
      that.addToStakeData(data);
    });
    // this.updateStakeData.next("");
    this.display  = false;

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

    if (this.offerData.offerObj.mmMapperStatus === 'Not Aligned') {
      alert('Status is \'Not Aligned\'!. You cannot proceed with stakeholder identification.');
    } else {
      document.location.href = 'http://owb1-stage.cloudapps.cisco.com/owb/owb/showHome#/manageOffer/editPlanReview/' + this.currentOfferId;
    }
  }

  getInitialChar(name) {
    if (name == null) {
      return '' ;
    }
    const names = name.split(' ');
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
}
