import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCollaboratorService } from '../services/search-collaborator.service';
import { StakeholderfullService } from '../services/stakeholderfull.service';
import { OfferPhaseService } from '../services/offer-phase.service';
import { ConfigurationService, UserService, CreateOfferService } from '@shared/services';

@Component({
  selector: 'app-stakeholder-full',
  templateUrl: './stakeholder-full.component.html',
  styleUrls: ['./stakeholder-full.component.css']
})
export class StakeholderFullComponent implements OnInit {

  @Input() stakeData: Object;
  @Input() offerOwner: String;
  @Input() portfolioFlag: Boolean = false;
  @Output() updateStakeData = new EventEmitter<String>();



  stakeholderForm: FormGroup;

  offerName;
  message = {};
  currentOfferId;


  selectedCollabs;
  deleteCollabs: any[];
  newDatastring: String;


  showDelete = false;
  backbuttonStatusValid = true;
  proceedButtonStatusValid = true;


  finalCollabs: any[];
  temporaryselectedCollabs: any[];

  caseId: any;

  stakeHolderData: any[];
  stakeHolderMapInfo = {};
  stakeHolderListInfo: any[] = [];

  selectedStakeHolders;
  searchStakeHolderInput;
  searchStakeHolderResults: String[];

  text: String;

  cols = [
    { field: 'name', header: 'NAME' },
    { field: 'email', header: 'EMAIL' },
    { field: 'functionalRole', header: 'FUNCTION' }
  ];

  constructor(private stakeholderfullService: StakeholderfullService,
    private createOfferService: CreateOfferService,
    private searchCollaboratorService: SearchCollaboratorService,
    private activatedRoute: ActivatedRoute,
    private router: Router, private offerPhaseService: OfferPhaseService,
    private configurationService: ConfigurationService,
    private userService: UserService) {

    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
    });

    if (!this.currentOfferId) {
      this.currentOfferId = this.createOfferService.coolOffer.offerId;
    }

    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });

  }

  // ---------------------------------------------------------------------------------------------

  ngOnInit() {

    this.message = {
      color: 'black',
      contentHead: '',
      content: 'Stakeholders message.'
    };

    this.deleteCollabs = [];
    this.temporaryselectedCollabs = [];

    this.stakeholderForm = new FormGroup({
      userName: new FormControl(null, Validators.required)
    });

    this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
      this.offerName = data['offerName'];
      this.stakeHolderData = data['stakeholders'];
      this.processStakeHolderData(data['stakeholders']);
    });



  }

  // ---------------------------------------------------------------------------------------------

  processStakeHolderData(stakeHolderData) {

    stakeHolderData.forEach(stakeHolder => {

      if (this.stakeHolderMapInfo[stakeHolder['offerRole']] == null) {
        this.stakeHolderMapInfo[stakeHolder['offerRole']] = [];
      }

      // Stake Holder Info To Display Acc 2 Functional Role On UI
      this.stakeHolderMapInfo[stakeHolder['offerRole']].push(
        {
          name: stakeHolder['name'],
          email: stakeHolder['_id'] + '@cisco.com',
          _id: stakeHolder['_id'],
          businessEntity: stakeHolder['businessEntity'],
          functionalRole: stakeHolder['functionalRole'],
          offerRole: stakeHolder['offerRole'],
          stakeholderDefaults: stakeHolder['stakeholderDefaults']
        });

      // Stake Holder Info To Update Offer Details
      this.stakeHolderListInfo.push(
        {
          name: stakeHolder['name'],
          email: stakeHolder['_id'] + '@cisco.com',
          _id: stakeHolder['_id'],
          businessEntity: stakeHolder['businessEntity'],
          functionalRole: stakeHolder['functionalRole'],
          offerRole: stakeHolder['offerRole'],
          stakeholderDefaults: stakeHolder['stakeholderDefaults']
        });
    });
  }

  // ---------------------------------------------------------------------------------------------

  search(event: any) {

    this.searchCollaboratorService.searchCollaborator({ 'userName': event.query })
      .subscribe(collaboratorsResponseList => {

        const adminRole = ['Owner', 'Co-Owner'];
        const currentUserRole = this.configurationService.startupData.appRoleList;
        const currentUserFunctionalRole = this.configurationService.startupData.functionalRole[0];

        if (adminRole.includes(currentUserRole)) {
          this.searchStakeHolderResults = collaboratorsResponseList;
        } else {
          this.searchStakeHolderResults = collaboratorsResponseList
            .filter(collaborator => collaborator.functionalRole === currentUserFunctionalRole);
        }

      });
  }

  // ---------------------------------------------------------------------------------------------

  getInitialChar(name) {
    if (name == null) { return '' }
    const names = name.split(' ');
    let initials = '';
    initials += names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[1].charAt(0).toUpperCase();
    }
    return initials;
  }

  getUserIdFromEmail(email): any {
    const arrayOfStrings = email.split('@');
    return arrayOfStrings[0];
  }

  // ---------------------------------------------------------------------------------------------

  getKeys(obj) {
    if (typeof obj === 'object') {
      return Object.keys(obj);
    } else {
      return [];
    }
  }

  selectUser(stakes: any) {
    this.selectUser = stakes;
  }

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

  // ---------------------------------------------------------------------------------------------

  onAdd() {

    const obj = {
      name: this.searchStakeHolderInput['userName'],
      email: this.searchStakeHolderInput['_id'] + '@cisco.com',
      _id: this.searchStakeHolderInput['_id'],
      businessEntity: this.searchStakeHolderInput['userMappings'][0]['businessEntity'],
      functionalRole: this.searchStakeHolderInput['userMappings'][0]['functionalRole'],
      offerRole: this.searchStakeHolderInput['userMappings'][0]['functionalRole'],
      stakeholderDefaults: false
    };

    if (this.stakeHolderListInfo.findIndex(k => k._id === this.searchStakeHolderInput['_id']) === -1) {
      this.stakeHolderListInfo.push(obj);
      if (this.stakeHolderMapInfo[obj['offerRole']] == null) {
        this.stakeHolderMapInfo[obj['offerRole']] = [];

      }

      this.stakeHolderMapInfo[obj['offerRole']].push(obj);
    }

    const stakeholdersPayLoad = {
      offerId: this.currentOfferId,
      caseId: this.caseId,
      stakeholders: []
    };


    const keys: any[] = Object.keys(this.stakeHolderMapInfo);

    keys.forEach(key => {

      this.stakeHolderMapInfo[key].forEach(element => {

        stakeholdersPayLoad['stakeholders']
          .push({
            '_id': element._id,
            'businessEntity': element.businessEntity,
            'functionalRole': element.functionalRole,
            'stakeholderDefaults': element.stakeholderDefaults === true ? true : false,
            'offerRole': element.offerRole,
            'name': element.name
          });
      });

    });

    this.stakeholderfullService.updateOfferDetails(stakeholdersPayLoad).subscribe();

    this.stakeholderForm.reset();

  }

  addToStakeData(res) {

    const keyUsers = res['stakeholders'];
    keyUsers.forEach(user => {
      if (this.stakeData[user['offerRole']] == null) {
        this.stakeData[user['offerRole']] = [];
      }
      this.stakeData[user['offerRole']].push({ name: user['_id'], email: 'sample@sample.com' });
    });
  }

  addCollaborator() {

    const stakeholdersPayLoad = {
      offerId: this.currentOfferId,
      caseId: this.caseId,
      stakeholders: []
    };

    const keys: any[] = Object.keys(this.stakeHolderMapInfo);

    keys.forEach(key => {
      this.stakeHolderMapInfo[key].forEach(element => {
        const obj = {
          '_id': element._id,
          'businessEntity': element.businessEntity,
          'functionalRole': element.functionalRole,
          'stakeholderDefaults': element.stakeholderDefaults === true ? true : false,
          'offerRole': element.offerRole,
          'name': element.name
        };
        stakeholdersPayLoad['stakeholders'].push(obj);
      });
    });

    this.stakeholderfullService.updateOfferDetails(stakeholdersPayLoad).subscribe(data => {
      const proceedPayload = {
        'taskId': '',
        'userId': this.offerOwner,
        'caseId': this.caseId,
        'offerId': this.currentOfferId,
        'taskName': 'Stake Holders',
        'action': '',
        'comment': ''
      };
      this.offerPhaseService.proceedToStakeHolders(proceedPayload).subscribe(result => {
        this.stakeholderfullService.sendEmailNotification(this.currentOfferId).subscribe(data => {
          this.router.navigate(['/strategyReview', this.currentOfferId, this.caseId]);
        }, (error) => {
        });
      });
    },
      (error) => {
      })
  }

  // ---------------------------------------------------------------------------------------------

  selectlist(event) {
    if (this.selectedCollabs.length < 1) {
      this.temporaryselectedCollabs.push(this.selectedCollabs);
    }

    if (this.selectedCollabs.length > 0 && this.stakeHolderData.length > 0) {
      this.selectedCollabs.forEach(element => {
        if (this.stakeHolderData.includes(element)) {
          alert('User already selected -- select ok to delete the user');
          this.selectedCollabs.pop();
          this.deleteCollabs.push(element);
        } else {

          this.temporaryselectedCollabs.push(element);
        }
      });
    }
  }

  // addselectedCollabs() {
  //   if (this.temporaryselectedCollabs.length > 0 && this.newData.length > 0) {
  //     this.data = this.data.concat(this.temporaryselectedCollabs);
  //     this.finalCollabs = this.newData;
  //   }
  //   if (this.temporaryselectedCollabs.length > 0 && this.newData.length < 1) {
  //     this.newData = this.temporaryselectedCollabs;
  //     this.finalCollabs = this.newData;
  //     this.data = this.data.concat(this.newData);
  //     this.newDatastring = JSON.stringify(this.newData);
  //   }
  //   if (this.temporaryselectedCollabs.length < 1) {
  //     alert('select atleast one');
  //   }

  //   this.temporaryselectedCollabs = [];
  //   this.selectedCollabs = [];

  // }

  // ---------------------------------------------------------------------------------------------

  onDelete(user) {

    if (this.stakeHolderData.length === 1) {
      this.stakeHolderData.splice(0, 1);
    }
    for (let i = 0; i <= this.stakeHolderData.length - 1; i++) {
      if (this.stakeHolderData[i]._id === user._id) {
        this.stakeHolderData.splice(i, 1);
      }
    }
    this.finalCollabs = this.stakeHolderData;
  }

  multideleteCollaborator() {
    if (this.deleteCollabs.length < 1) {
      alert('select atleast one');
    }

    if (this.deleteCollabs.length > 0) {
      this.stakeHolderData = this.stakeHolderData.filter(val => !this.deleteCollabs.includes(val));
    }

    this.finalCollabs = this.stakeHolderData;
    this.deleteCollabs = [];
    this.selectedCollabs = [];
  }

  delteSelectedStakeHolders() {
    this.selectedStakeHolders.forEach(shs => {
      if (this.canUserDeleteStakeHolder(shs)) {
        this.deleteStakeHolder(shs._id);
      }
    });
  }

  deleteStakeHolder(stakeHolderId) {
    this.stakeHolderListInfo.splice(this.stakeHolderListInfo.findIndex(matchesEl), 1);
    function matchesEl(el) {
      return el._id === stakeHolderId;
    }

    const keys: any[] = Object.keys(this.stakeHolderMapInfo);

    keys.forEach(key => {
      const tmp = this.stakeHolderMapInfo[key];

      if (tmp.length > 0) {
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i]._id === stakeHolderId) {
            tmp.splice(i, 1);
          }
        }
      }

      this.stakeHolderMapInfo[key] = tmp;
      if (tmp.length === 0) {
        delete this.stakeHolderMapInfo[key];
      }
    });
  }

  canUserDeleteStakeHolder(stakeholder) {

    const adminRole = ['Owner', 'Co-Owner'];
    const currentUserId = this.userService.getUserId();
    const currentUserRole = this.configurationService.startupData.appRoleList;
    const currentUserFunctions = this.configurationService.startupData.functionalRole;

    return !stakeholder.stakeholderDefaults && stakeholder['_id'] !== currentUserId
      && (adminRole.includes(currentUserRole) || currentUserFunctions.includes(stakeholder.functionalRole));

  }

  // ---------------------------------------------------------------------------------------------

  onEvent(event, value) {
    this.showDelete = true;
  }

  onOut(event, value) {
    this.showDelete = false;
  }

  // ------------------------------------------------------------------------------------------------

  goBack() {
    this.router.navigate(['/mmassesment', this.currentOfferId, this.caseId]);
  }

  gotoOfferviewDetails() {
    this.router.navigate(['/offerDetailView', this.currentOfferId, this.caseId]);
  }

  // ---------------------------------------------------------------------------------------------

}
