import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCollaboratorService } from '../services/search-collaborator.service';
import { StakeHolder } from '../models/stakeholder';
import { Collaborators } from '../models/collaborator';
import { StakeholderfullService } from '../services/stakeholderfull.service';
import { OfferPhaseService } from '../services/offer-phase.service';
import { SharedService } from '../shared-service.service';

@Component({
  selector: 'app-stakeholder-full',
  templateUrl: './stakeholder-full.component.html',
  styleUrls: ['./stakeholder-full.component.css']
})
export class StakeholderFullComponent implements OnInit {
  entityList;
  notiFication: boolean = false;
  @Input() portfolioFlag: boolean = false;
  @Input() stakeData: Object;
  @Input() offerOwner: String;
  @Output() updateStakeData = new EventEmitter<string>();
  stakeholderForm: FormGroup;
  collaboratorsList;
  selectedCollabs;
  currentOfferId;
  offerName;
  temporaryList;
  lists;
  message = {};
  proceedButtonStatusValid = true;
  backbuttonStatusValid = true;
  public offerBuilderdata;
  public newData: any[];
  //new update
  public showDelete = false;
  public tempcoll: any[];
  public lstcoll: any[];
  public showtemp: boolean;
  public showdel: boolean;
  public tempvalue: boolean;
  public lastvalue: boolean;
  public coll: any[];
  public selectedColl: any[];
  public firstData: any
  public data: any[];
  test: any;
  duplicateList: any;
  displayData: any;
  funcionalRoleList: string[];
  temporaryselectedCollabs: any[];
  finalCollabs: any[];
  newDatastring: string;
  deleteCollabs: any[];
  caseId: any;
  getRole: any;
  stakeHolderInfo = {};
  Stakeholders: any[] = [];
  val;
  selectedSh;
  alreayAddedStakeHolders;
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
    private sharedService: SharedService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
    });
    if (!this.currentOfferId) {
      this.currentOfferId = this.createOfferService.coolOffer.offerId
    }
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
  }

  ngOnInit() {
    this.message = {
      contentHead: '',
      content: 'Stakeholders message.',
      color: 'black'
    };
    this.newData = [];
    this.temporaryselectedCollabs = [];
    this.deleteCollabs = [];


    this.sharedService.getFunctionalRoles().subscribe(data => {

      this.funcionalRoleList = data;
    });

    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {

      this.firstData = data;
      this.data = this.firstData.stakeholders;
      this.offerName = this.firstData['offerName'];
      this.processStakeHolderData(this.data);
    });

    this.createOfferService.getPrimaryBusinessUnits()
      .subscribe(data => {
        console.log("create offer Service " + data);
        this.entityList = ['Security', 'IOT', 'Data Center', 'Enterprise'];
        console.log("create offer service" + this.entityList);
      });

    this.stakeholderfullService.getOfferrole().subscribe(data => {
      this.getRole = data;
    })

    this.stakeholderForm = new FormGroup({
      userName: new FormControl(null, Validators.required)
    });

    this.stakeholderfullService.getOfferBuilderData(this.currentOfferId).subscribe(data => {
      this.offerBuilderdata = data;
      console.log("offerOwner", this.offerBuilderdata);
    });


    this.showtemp = false;
    this.tempcoll = [];
    this.lstcoll = [];
    this.lastvalue = false;
    this.tempvalue = true;
  }

  text: string;

  results: string[];

  search(event) {
    this.searchCollaboratorService.searchCollaborator({ 'userName': event.query })
      .subscribe(data => {
        console.log(data);
        this.results = data;

      });
  }
  selectedUser;
  selectUser(stakes: any) {
    console.log(stakes);
    this.selectUser = stakes;
  }

  getKeys(obj) {
    if (typeof obj === 'object') {
      return Object.keys(obj);
    } else {
      return [];
    }
  }


  processStakeHolderData(stakeHolderData) {

    stakeHolderData.forEach(stakeHolder => {

      if (this.stakeHolderInfo[stakeHolder['offerRole']] == null) {
        this.stakeHolderInfo[stakeHolder['offerRole']] = [];
      }

      this.stakeHolderInfo[stakeHolder['offerRole']].push(
        {
          name: stakeHolder['name'],
          email: stakeHolder['_id'] + '@cisco.com',
          _id: stakeHolder['_id'],
          businessEntity: stakeHolder['businessEntity'],
          functionalRole: stakeHolder['functionalRole'],
          offerRole: stakeHolder['offerRole'],
          stakeholderDefaults: stakeHolder['stakeholderDefaults']
        });

      this.Stakeholders.push(
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

  getUserIdFromEmail(email): any {
    var arrayOfStrings = email.split('@');
    return arrayOfStrings[0];
  }

  gotoOfferviewDetails() {
    this.router.navigate(['/offerDetailView', this.currentOfferId, this.caseId]);
  }

  updateMessage(message) {
    if (message != null && message !== "") {
      if (message == 'hold') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = { contentHead: "", content: "The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.", color: "black" };
      } else if (message == 'cancel') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = { contentHead: "", content: "The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.", color: "black" };
      }
    }
  }

  onAdd() {

    console.log('onAdd() called');
    let tempCollaboratorList: Collaborators[] = [];
    const obj = {
      name: this.val['userName'],
      email: this.val['_id'] + '@cisco.com',
      _id: this.val['_id'],
      businessEntity: this.val['userMappings'][0]['businessEntity'],
      functionalRole: this.val['userMappings'][0]['functionalRole'],
      offerRole: this.val['userMappings'][0]['functionalRole'],
      stakeholderDefaults: false
    };

    if (this.Stakeholders.findIndex(k => k._id === this.val['_id']) == -1) {
      this.Stakeholders.push(obj);
      if (this.stakeHolderInfo[obj['offerRole']] == null) {
        this.stakeHolderInfo[obj['offerRole']] = [];
      }

      this.stakeHolderInfo[obj['offerRole']].push(obj);
    }

    let stakeholdersPayLoad = {
      offerId: this.currentOfferId,
      caseId: this.caseId,
      stakeholders: []
    }


    const keys: any[] = Object.keys(this.stakeHolderInfo);

    keys.forEach(key => {
      this.stakeHolderInfo[key].forEach(element => {
        let obj = {
          "_id": element._id,
          "businessEntity": element.businessEntity,
          "functionalRole": element.functionalRole,
          "stakeholderDefaults": element.stakeholderDefaults === true ? true : false,
          "offerRole": element.offerRole,
          "name": element.name
        }
        stakeholdersPayLoad['stakeholders'].push(obj);
      })
    });

    this.stakeholderfullService.proceedToStrageyReview(stakeholdersPayLoad).subscribe(data => {
      let proceedPayload = {
        "taskId": "",
        "userId": this.offerBuilderdata['offerOwner'],
        "caseId": this.caseId,
        "offerId": this.currentOfferId,
        "taskName": "Stake Holders",
        "action": "",
        "comment": ""
      }
    });

    this.stakeholderForm.reset();
  }

  addToStakeData(res) {
    console.log(res);
    let keyUsers = res['stakeholders'];
    keyUsers.forEach(user => {
      if (this.stakeData[user['offerRole']] == null) {
        this.stakeData[user['offerRole']] = [];
      }
      this.stakeData[user['offerRole']].push({ name: user['_id'], email: "sample@sample.com" });
    })
  }

  addCollaborator() {

    console.log("finalcolabrattiondata::::::", this.data);
    const listOfStakeHolders: StakeHolder[] = [];
    let stakeholdersPayLoad = {
      offerId: this.currentOfferId,
      caseId: this.caseId,
      stakeholders: []
    }

    const keys: any[] = Object.keys(this.stakeHolderInfo);

    keys.forEach(key => {
      this.stakeHolderInfo[key].forEach(element => {
        let obj = {
          "_id": element._id,
          "businessEntity": element.businessEntity,
          "functionalRole": element.functionalRole,
          "stakeholderDefaults": element.stakeholderDefaults === true ? true : false,
          "offerRole": element.offerRole,
          "name": element.name
        }
        stakeholdersPayLoad['stakeholders'].push(obj);
      })
    });

    this.stakeholderfullService.proceedToStrageyReview(stakeholdersPayLoad).subscribe(data => {
      let proceedPayload = {
        "taskId": "",
        "userId": this.offerBuilderdata['offerOwner'],
        "caseId": this.caseId,
        "offerId": this.currentOfferId,
        "taskName": "Stake Holders",
        "action": "",
        "comment": ""
      };
      this.offerPhaseService.proceedToStakeHolders(proceedPayload).subscribe(result => {
        this.stakeholderfullService.sendEmailNotification(this.currentOfferId).subscribe(data => {
          this.router.navigate(['/strategyReview', this.currentOfferId, this.caseId]);
        }, (error) => {
          console.log(error);
        });
      });
    },
      (error) => {
        console.log(error);
      })
  }

  goBack() {
    this.router.navigate(['/mmassesment', this.currentOfferId, this.caseId]);
  }

  onDelete(user) {

    if (this.data.length == 1) {
      this.data.splice(0, 1);
    }
    for (let i = 0; i <= this.data.length - 1; i++) {
      if (this.data[i]._id === user._id) {
        this.data.splice(i, 1);
      }
    }
    this.finalCollabs = this.data;
    console.log("finaldata", this.data);

  }

  onEvent(event, value) {
    this.showDelete = true;

  }

  onOut(event, value) {
    this.showDelete = false;
  }

  selectlist(event) {
    if (this.selectedCollabs.length < 1) {
      this.temporaryselectedCollabs.push(this.selectedCollabs);
    }

    if (this.selectedCollabs.length > 0 && this.data.length > 0) {
      this.selectedCollabs.forEach(element => {
        if (this.data.includes(element)) {
          alert("User already selected -- select ok to delete the user");
          this.selectedCollabs.pop();
          this.deleteCollabs.push(element);
        } else {

          this.temporaryselectedCollabs.push(element);
        }
      });
    }
  }

  addselectedCollabs() {
    if (this.temporaryselectedCollabs.length > 0 && this.newData.length > 0) {
      //  this.newData = this.newData.concat(this.temporaryselectedCollabs);
      this.data = this.data.concat(this.temporaryselectedCollabs);
      console.log("newdatsa", this.data);
      this.finalCollabs = this.newData;
      console.log("newdata", typeof (this.newData));
    }
    if (this.temporaryselectedCollabs.length > 0 && this.newData.length < 1) {
      this.newData = this.temporaryselectedCollabs;
      this.finalCollabs = this.newData;
      this.data = this.data.concat(this.newData);
      console.log("newdatsa:::::", this.data);
      console.log("newdata", typeof (this.newData));
      this.newDatastring = JSON.stringify(this.newData);
    }
    if (this.temporaryselectedCollabs.length < 1) {
      alert("select atleast one");
    }

    console.log("newDatalist", this.newData[0]);

    this.temporaryselectedCollabs = [];
    this.selectedCollabs = [];

  }

  multideleteCollaborator() {
    if (this.deleteCollabs.length < 1) {
      alert("select atleast one");
    }

    if (this.deleteCollabs.length > 0) {
      this.data = this.data.filter(val => !this.deleteCollabs.includes(val));
    }

    this.finalCollabs = this.data;
    this.deleteCollabs = [];
    this.selectedCollabs = [];
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

  /**
   * Delete Stake Holders when user selected check boxes
   */
  delteSelectedStakeHolders() {
    this.selectedSh.forEach(shs => {
      if (!shs.stakeholderDefaults) {
        this.deleteStakeHolder(shs._id);
      }
    });
  }

  deleteStakeHolder(stakeHolderId) {
    console.log(stakeHolderId);
    this.Stakeholders.splice(this.Stakeholders.findIndex(matchesEl), 1);
    function matchesEl(el) {
      return el._id === stakeHolderId
    }

    const keys: any[] = Object.keys(this.stakeHolderInfo);

    keys.forEach(key => {
      let tmp = this.stakeHolderInfo[key];

      if (tmp.length > 0) {
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i]._id === stakeHolderId) {
            tmp.splice(i, 1);
          }
        }
      }

      this.stakeHolderInfo[key] = tmp;
      if (tmp.length === 0) {
        delete this.stakeHolderInfo[key];
      }
    });
  }
}
