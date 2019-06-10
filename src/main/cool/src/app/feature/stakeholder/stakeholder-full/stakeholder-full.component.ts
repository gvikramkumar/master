import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCollaboratorService } from '@app/services/search-collaborator.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { OfferPhaseService } from '@app/services/offer-phase.service';
import { ConfigurationService, UserService } from '@app/core/services';

@Component({
  selector: 'app-stakeholder-full',
  templateUrl: './stakeholder-full.component.html',
  styleUrls: ['./stakeholder-full.component.css']
})
export class StakeholderFullComponent implements OnInit {

  message = {};
  stakeholderForm: FormGroup;

  caseId: string;
  offerName: string;
  currentOfferId: string;

  backbuttonStatusValid = true;
  proceedButtonStatusValid = true;

  stakeHolderData: any[];
  stakeHolderMapInfo = {};
  stakeHolderListInfo: any[] = [];

  selectedStakeHolders;
  searchStakeHolderInput;
  searchStakeHolderResults: String[];
  sentEmailNotification;

  cols = [
    { field: 'name', header: 'NAME' },
    { field: 'email', header: 'EMAIL' },
    { field: 'functionalRole', header: 'FUNCTION' }
  ];

  // ---------------------------------------------------------------------------------------------

  constructor(private stakeholderfullService: StakeholderfullService,
    private searchCollaboratorService: SearchCollaboratorService,
    private activatedRoute: ActivatedRoute,
    private router: Router, private offerPhaseService: OfferPhaseService,
    private configurationService: ConfigurationService,
    private userService: UserService) {

    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
    });

  }

  // ---------------------------------------------------------------------------------------------

  ngOnInit() {

    this.message = {
      color: 'black',
      contentHead: '',
      content: 'Stakeholders message.'
    };

    this.stakeholderForm = new FormGroup({
      userName: new FormControl(null, Validators.required)
    });

    this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
      this.offerName = data['offerName'];
      this.stakeHolderData = data['stakeholders'];
      this.processStakeHolderData(data['stakeholders']);
    });

    this.stakeholderfullService.getUniqueEmailNotification(this.currentOfferId).subscribe(emailData => {
      this.sentEmailNotification = emailData['proceedToStrategyReview'];
    });

  }

  // ---------------------------------------------------------------------------------------------

  processStakeHolderData(stakeHolderData: any) {

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

        if (adminRole.some(user => currentUserRole.includes(user))) {
          this.searchStakeHolderResults = collaboratorsResponseList;
        } else {
          this.searchStakeHolderResults = collaboratorsResponseList
            .filter(collaborator => collaborator.userMappings[0]['functionalRole'] === currentUserFunctionalRole);
        }

      });
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
        'caseId': this.caseId,
        'offerId': this.currentOfferId,
        'taskName': 'Stake Holders',
        'action': '',
        'comment': ''
      };
      this.offerPhaseService.createSolutioningActions(proceedPayload).subscribe(result => {
        if (!this.sentEmailNotification) {
          this.stakeholderfullService.sendEmailNotification(this.currentOfferId).subscribe(data => {
            this.router.navigate(['/strategyReview', this.currentOfferId, this.caseId]);
            this.stakeholderfullService.uniqueEmailNotification(this.currentOfferId).subscribe(resData => {
            });
          }, (error) => {
          });
        } else {
          this.router.navigate(['/strategyReview', this.currentOfferId, this.caseId]);
        }
      });
    },
      (error) => {
      });
  }

  // ---------------------------------------------------------------------------------------------

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

    const currentUserId = this.userService.getUserId();
    const currentUserFunctions = this.configurationService.startupData.functionalRole.toString();
    const readOnly = this.configurationService.startupData.readOnly;
    return (!stakeholder.stakeholderDefaults && stakeholder['_id'] !== currentUserId && (!readOnly || stakeholder.functionalRole===currentUserFunctions) );

  }

  // ---------------------------------------------------------------------------------------------

  getKeys(obj) {
    if (typeof obj === 'object') {
      return Object.keys(obj);
    } else {
      return [];
    }
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

  getInitialChar(name: string) {
    if (name == null) { return '' }
    const names = name.split(' ');
    let initials = '';
    initials += names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[1].charAt(0).toUpperCase();
    }
    return initials;
  }

  getUserIdFromEmail(email: string): any {
    const arrayOfStrings = email.split('@');
    return arrayOfStrings[0];
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
