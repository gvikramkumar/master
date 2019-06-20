import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgForm } from '@angular/forms';
import { CreateOffer } from './create-offer';
import { SelectItem } from 'primeng/api';
import { Location } from '@angular/common';
import { Status } from './status';
import { OfferDetailViewService } from '@app/services/offer-detail-view.service';
import * as moment from 'moment';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { HeaderService, UserService, ConfigurationService } from '@app/core/services';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { LoaderService } from '@app/core/services/loader.service';
import { CreateOfferService } from '@shared/services';


@Component({
  selector: 'app-create-offer-cool',
  templateUrl: './create-offer-cool.component.html',
  styleUrls: ['./create-offer-cool.component.css'],
  providers: [UserService]
})
export class CreateOfferCoolComponent implements OnInit {
  @ViewChild('offerCreateForm') offerCreateForm: NgForm;
  Obj;
  primaryBusinessUnitList;
  secondaryBusinessUnitList;
  secondaryBusinessEntityList;
  primaryBuList: string[] = [];
  primaryBeList: string[] = [];
  offerId: string;
  offerName: string;
  expectedLaunchDate: Date;
  offerDesc: string;
  mmMapperUserChoice: string;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  secondaryBusinessUnits: SelectItem[];
  secondaryBusinessEntities: SelectItem[];
  secondaryBusinessEntitiesFiltered: SelectItem[];
  secondaryBusinessUnitsFiltered: SelectItem[];
  minDate: Date;
  primaryBusinessUnits: SelectItem[] = [];
  primaryBusinessEntities: SelectItem[];
  offerNameValue: string;
  offerDescValue: string;
  primaryBusinessUnitsValue: string[] = [];
  primaryBusinessEntitiesValue: string;
  secondaryBusinessUnitsValue: string[] = [];
  secondaryBusinessEntitiesValue: string[] = [];
  strategyReviewDateValue: string;
  designReviewDateValue: string;
  readinessReviewDateValue: string;
  expectedLaunchDateValue: string;
  caseId: string;
  idpid;
  iDPId: string;
  readOnly = false;
  isIdpIdValid = false;
  enableOfferbuild = true;
  disablePrimaryBEList: boolean;
  userSelectedAllUnits;
  idpidValid = false;
  idpidInvalid = false;
  idpvalue;
  secondaryBUbackup: any;
  proceedButtonStatusValid = false;
  backbuttonStatusValid = true;


  derivedMM;
  firstData: Object;
  public data = [];
  escalateVisibleAvailable: Boolean = false;
  currentUser;
  approvalButtonsVisibleAvailable: Boolean = true;
  managerName;

  message = {};
  stakeData = {};
  stakeholders = {};
  stakeHolderInfo: any;

  offerDetailRes;
  offerDescValueTrim: string = '';
  offerNameValueTrim: string = '';

  subject: Subject<any> = new Subject();
  validFlag: boolean = true;
  disabledIDPID: boolean = false;

  constructor(
    private createOfferService: CreateOfferService,
    private configurationService: ConfigurationService,
    private offerDetailViewService: OfferDetailViewService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private loaderService: LoaderService,
    private stakeholderfullService: StakeholderfullService,
    private rightPanelService: RightPanelService,
    private _location: Location) {
    this.disablePrimaryBEList = createOfferService.disablePrBEList;
    this.activatedRoute.params.subscribe(params => {

      this.offerId = params['offerId'];

      if (this.offerId) {
        this.loaderService.startLoading();
        this.offerDetailViewService.retrieveOfferDetails(this.offerId).subscribe(offerDetailRes => {
          this.offerDetailRes = offerDetailRes;
          this.caseId = offerDetailRes.caseId;
          this.offerNameValue = offerDetailRes.offerName;
          this.offerDescValue = offerDetailRes.offerDesc;
          this.primaryBusinessUnitsValue = offerDetailRes.primaryBUList;
          this.secondaryBusinessEntitiesValue = offerDetailRes.secondaryBEList;
          this.strategyReviewDateValue = moment(offerDetailRes.strategyReviewDate).format('MM/DD/YYYY');
          this.designReviewDateValue = moment(offerDetailRes.designReviewDate).format('MM/DD/YYYY');
          this.readinessReviewDateValue = moment(offerDetailRes.readinessReviewDate).format('MM/DD/YYYY');
          this.expectedLaunchDateValue = moment(offerDetailRes.expectedLaunchDate).format('MM/DD/YYYY');
          this.idpvalue = offerDetailRes.iDPId;
          this.loadPrimaryBe();
          /* Enable 'Proceed to Offer Builder' button */
          this.enableOfferbuild = false;
          this.validFlag = false;
          this.disablePrimaryBEList = true;
        });

        // if (this.offerCreateForm.valid == true && this.idpvalue !== "") {
        //   this.enableOfferbuild = false;
        //  }

        if (this.primaryBusinessUnitsValue) {
          this.enableOfferbuild = false;
        }

        //disable IDP ID if offer id is prsent
        this.disabledIDPID = true;
      }
    });  
  } // constructor ends

  loadPrimaryBe() {
    // Get Primary BE (hard code 'all')
    this.createOfferService.getDistinctBE().subscribe(data => {
       //const primaryBeArry = [{ label: 'All', value: 'All' }];
       const primaryBeArry = [];
       const secondaryBeArry = [];
      const dataArray = data as Array<any>;
      dataArray.forEach(element => {
        if (element['BE'] !== null) {
          primaryBeArry.push({ label: element['BE'], value: element['BE'] });
        }
      });

      // for secondaryBusinessEntities 
      dataArray.forEach(element => {
        if (element['BE'] !== null) {
          secondaryBeArry.push({ label: element['BE'], value: element['BE'] });
        }
      });

      this.primaryBusinessEntities = primaryBeArry;
      this.secondaryBusinessEntities = secondaryBeArry;
      this.loaderService.stopLoading();
      // This if condition executes only when user moves back from mm page to offer creation page.
      if (this.offerId !== undefined) {
        this.primaryBusinessEntitiesValue = this.offerDetailRes.primaryBEList[0];
        this.getPrimaryBusinessUnitPromise(this.offerDetailRes.primaryBEList[0]);
        this.getSecondaryBusinessUnitsBasedOnSencondaryBE();
        this.secondaryBusinessUnitsValue = this.offerDetailRes.secondaryBUList ? this.offerDetailRes.secondaryBUList.slice() : null;
      }
    });
  }

  loadSecondaryBu() {
    // Get distinct BU for primary BU list
    this.createOfferService.getDistincBU().subscribe(data => {
      const secondaryBuArry = [];
      const dataArray = data as Array<any>;
      dataArray.forEach(element => {
        if (element['BUSINESS_UNIT'] !== null) {
          secondaryBuArry.push({ label: element['BUSINESS_UNIT'], value: element['BUSINESS_UNIT'] });
        }
      });
      this.secondaryBusinessUnits = secondaryBuArry;
    });
  }

  autoSelectBE() {
    // Fetch Primary BE's assigned through admin page.
    // Show this BE's as selected in Primary BE multiselect list in the offer creation page.
    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {

      const primaryBeArray: any[] = [];
      data.userMappings.forEach(element => {
        primaryBeArray.push(element.businessEntity);
      });
      this.primaryBusinessEntitiesValue = primaryBeArray[0];

      // Load primary business units when business entities are selected.
      this.getPrimaryBusinessUnitBasedOnPrimaryBE(this.primaryBusinessEntitiesValue);

    });
  }


  populateStakeHoldersData() {

    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {

      this.stakeholders = [
        {
          _id: data._id,
          offerRole: 'Owner',
          name: data.userName,
          stakeholderDefaults: true,
          businessEntity: data.userMappings[0]['businessEntity'],
          functionalRole: data.userMappings[0]['functionalRole'],
        }];

    });

  }

  skipSelectedBusinessEntities(selectedPbe) {
    const tmpBusinessEntities = this.secondaryBusinessEntities;
    this.secondaryBusinessEntitiesFiltered = tmpBusinessEntities.filter((obj) => obj.value !== selectedPbe);
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  // GET SECOND BE
  getSecondaryBusinessEntity(event) {
    this.getSecondaryBusinessEntityPromise(event);
  }

  getSecondaryBusinessEntityPromise(event) {
    return new Promise((resolve) => {
      this.createOfferService.getSecondaryBusinessEntity(event)
        .subscribe(data => {
          this.secondaryBusinessEntityList = <any>data;
          const secondaryBeArry = [];
          this.secondaryBusinessEntityList.forEach(element => {
            secondaryBeArry.push({ label: element.BE, value: element.BE });
          });
          this.secondaryBusinessEntities = this.removeDuplicates(secondaryBeArry, 'label');
          resolve();
        });
    });
  }

  getSecondaryBusinessUnitsFiltered() {
    if (this.primaryBusinessUnitsValue != null && this.secondaryBUbackup != null
      && this.secondaryBUbackup.length > 0) {
      const tmpBusinessUnites = [...this.secondaryBUbackup];
      this.primaryBusinessUnitsValue.forEach(selectedBU => {
        const index = tmpBusinessUnites.findIndex(o => o.value === selectedBU);
        if (index !== -1) {
          tmpBusinessUnites.splice(index, 1);
        }
      });
      // this.secondaryBusinessUnitsValue = null;
      this.secondaryBusinessUnitsFiltered = tmpBusinessUnites;
    }
  }


  getPrimaryBusinessUnitBasedOnPrimaryBE(event) {
    this.primaryBusinessUnitsValue = null;
    this.secondaryBusinessEntitiesValue = null;
    this.secondaryBusinessUnitsValue = null;
    this.getPrimaryBusinessUnitPromise(event);
    if (this.primaryBusinessUnitsValue) {
      this.enableOfferbuild = false;
    }
    if (this.primaryBusinessUnitsValue === null) {
      this.enableOfferbuild = true;
    }
  }

  getPrimaryBusinessUnitPromise(event) {
    if (event === 'All') {
      // Get distinct BU for primary BU list
      this.createOfferService.getDistincBU().subscribe(data => {
        const secondaryBuArry = [];
        const dataArray = data as Array<any>;
        dataArray.forEach(element => {
          if (element['BUSINESS_UNIT'] !== null) {
            secondaryBuArry.push({ label: element['BUSINESS_UNIT'], value: element['BUSINESS_UNIT'] });
          }
        });
        this.primaryBusinessUnits = this.removeDuplicates(secondaryBuArry, 'label');
      });
    } else {
      return new Promise((resolve) => {
        this.createOfferService.getPrimaryBuBasedOnBe(event.toString())
          .subscribe(data => {
            const primaryBuArry = [];
            const dataArray = data as Array<any>;
            dataArray.forEach(element => {
              if (element.BUSINESS_UNIT !== null) {
                primaryBuArry.push({ label: element.BUSINESS_UNIT, value: element.BUSINESS_UNIT });
              }
            });
            this.primaryBusinessUnits = this.removeDuplicates(primaryBuArry, 'label');
            this.skipSelectedBusinessEntities(event);
            resolve();
          });
      });
    }
  }

  /**
     * Function call to load secondary BU's based on Secondary BE.
     * @param selectedBEs
     */
  getSecondaryBusinessUnitsBasedOnSencondaryBE() {

    this.secondaryBusinessUnitsValue = null;
    if (this.secondaryBusinessEntitiesValue != null) {
      this.getSecondaryBusinessUnitPromise(this.secondaryBusinessEntitiesValue);
    }
  }

  /**
   * Function call to load secondary BU's based on Secondary BE.
   * @param selectedBEs
   */
  getSecondaryBusinessUnitPromise(event) {

    return new Promise((resolve) => {
      this.createOfferService.getPrimaryBuBasedOnBe(event.toString())
        .subscribe(data => {
          const primaryBuArry = [];
          const dataArray = data as Array<any>;
          dataArray.forEach(element => {
            if (element.BUSINESS_UNIT !== null) {
              primaryBuArry.push({ label: element.BUSINESS_UNIT, value: element.BUSINESS_UNIT });
            }
          });
          this.secondaryBusinessUnitsFiltered = this.removeDuplicates(primaryBuArry, 'label');
          this.secondaryBUbackup = this.secondaryBusinessUnitsFiltered;
          this.getSecondaryBusinessUnitsFiltered();
          resolve();
        });
    });
  }

  // GET PRIMARY BE
  getPrimaryBusinessEntity(event) {
    if (event.toString() === 'All') {
      this.userSelectedAllUnits = true;
    }
    this.getPrimaryBusinessEntityPromise(event);

  }

  getPrimaryBusinessEntityPromise(event) {

    return new Promise((resolve) => {
      this.createOfferService.getPrimaryBusinessEntity(event.toString())
        .subscribe(data => {
          //const primaryBeArry = [{ label: 'All', value: 'All' }];
          const primaryBeArry = [];
          // When primary business unit is selected as 'All'
          // then entities are displayed as 'all
          // if (data.length === 0 && this.userSelectedAllUnits) {
          //   primaryBeArry.push({ label: 'All', value: 'All' });
          // }

          data.forEach(element => {
            primaryBeArry.push({ label: element.BE, value: element.BE });
          });
          this.primaryBusinessEntities = this.removeDuplicates(primaryBeArry, 'label');
          resolve();
        });
    });
  }

  mModelAssesment() {
    this.router.navigate(['/mmassesment', this.offerId]);
  }


  ngOnInit() {
    this.subject.pipe(debounceTime(1000)).subscribe(() => {
      this.getValidData();
    })
    const canEscalateUsers = [];
    const canApproveUsers = [];
    this.data = [];
    this.populateStakeHoldersData();

    if (this.offerId === undefined) {
      this.loadPrimaryBe();
      this.loadSecondaryBu();
      this.autoSelectBE();
    }

    this.readOnly = this.configurationService.startupData.readOnly;
    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(data => {
      this.firstData = data;
      this.derivedMM = this.firstData['derivedMM'];
      this.data = this.firstData['stakeholders'];
      this.offerName = this.firstData['offerName'];
      this.stakeHolderInfo = {};
      // this.processStakeHolderData(this.data);
      if (this.data) {
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
      }
      this.stakeData = this.stakeHolderInfo;

      for (const auth in this.stakeData) {
        if (auth === 'Co-Owner' || auth === 'Owner') {
          this.stakeData[auth].forEach(owners => {
            canEscalateUsers.push(owners['_id']);
            canApproveUsers.push(owners['_id']);
          });
        }
      }
      this.headerService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
        if (canEscalateUsers.includes(user)) {
          this.escalateVisibleAvailable = true;
        }
        if (canApproveUsers.includes(user)) {
          this.approvalButtonsVisibleAvailable = false;
        }
        this.headerService.getUserInfo(this.currentUser).subscribe(userData => {
          this.managerName = userData[0].manager;
        });
      });
    });
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });

    this.mmMapperUserChoice = 'DO';
    this.minDate = new Date();
  }

  goBack() {
    this._location.back();
  }

  proceedCheckBu() {
    if (this.offerCreateForm.valid == true && this.idpvalue !== "") {
      this.enableOfferbuild = false;
    }
  }

  proceedCheck(event) {
    let inputText = event.target.value;
    let inputValue = inputText.trim();
    if (this.offerDescValue !== undefined) { this.offerDescValueTrim = this.offerDescValue.trim(); }
    this.offerNameValueTrim = this.offerNameValue.trim();

    if (inputValue === "" || inputValue === null) {
      this.enableOfferbuild = true;
    }
    else if (this.offerDescValueTrim !== "" && this.offerNameValueTrim !== "" && this.offerCreateForm.valid == true && this.idpvalue !== "") {
      this.enableOfferbuild = false;
    }
  }


  proceedCheckDate(event) {
    if (!event) {
      this.enableOfferbuild = true;
    }
    else if (this.offerNameValueTrim !== "" && this.offerNameValueTrim !== "" && this.offerCreateForm.valid == true && this.idpvalue !== "") {
      this.enableOfferbuild = false;
    }
  }

  proceedToOfferBuilder() {

    const loggedInUserId = '';
    const offerOwner = '';
    const offerCreatedBy = '';
    // Set the status for offer creation
    const status = new Status();
    status.offerPhase = 'PreLaunch';
    status.offerMilestone = 'Launch In Progress';
    status.phaseMilestone = 'Ideate';
    status.subMilestone = 'Offer Creation';

    const offerCreationDate = moment(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })).format();
    const selectedPrimaryBe = [];
    selectedPrimaryBe.push(this.primaryBusinessEntitiesValue);
    const createoffer: CreateOffer = new CreateOffer(
      loggedInUserId,
      offerOwner,
      this.offerNameValue,
      this.offerDescValue,
      this.primaryBusinessUnitsValue,
      selectedPrimaryBe,
      this.secondaryBusinessUnitsValue,
      this.secondaryBusinessEntitiesValue,
      this.strategyReviewDateValue,
      this.designReviewDateValue,
      this.readinessReviewDateValue,
      this.expectedLaunchDateValue,
      this.iDPId,
      offerCreatedBy,
      offerCreationDate,
      status);
    this.disablePrimaryBEList = true;
    this.createOfferService.disablePrBEList = true;
    this.strategyReviewDateValue = moment(this.strategyReviewDateValue).toISOString();
    this.designReviewDateValue = moment(this.designReviewDateValue).toISOString();
    this.readinessReviewDateValue = moment(this.readinessReviewDateValue).toISOString();
    this.expectedLaunchDateValue = moment(this.expectedLaunchDateValue).toISOString();
    const updateoffer: CreateOffer = new CreateOffer(
      loggedInUserId,
      offerOwner,
      this.offerNameValue,
      this.offerDescValue,
      this.primaryBusinessUnitsValue,
      selectedPrimaryBe,
      this.secondaryBusinessUnitsValue,
      this.secondaryBusinessEntitiesValue,
      this.strategyReviewDateValue,
      this.designReviewDateValue,
      this.readinessReviewDateValue,
      this.expectedLaunchDateValue,
      this.iDPId,
      offerCreatedBy,
      offerCreationDate,
      status
    );
    if (!this.offerId) {
      this.createOffer(createoffer);
    } else {
      this.updateOffer(updateoffer);
      // this.router.navigate(['/mmassesment', this.offerId, this.caseId]);
    }
  }

  createOffer(createoffer) {

    this.createOfferService.registerOffer(createoffer).subscribe((data) => {
      this.offerId = data.offerId;
      this.caseId = data.caseId;
      this.router.navigate(['/mmassesment', this.offerId, this.caseId]);
    },
      (err) => {
        console.log(err);
      });
  }


  getidptoken(event) {
    if (event.target.value.length === 9) {
      this.validFlag = false;
    } else {
      this.validFlag = true;
    }
    this.subject.next();
    // this.createOfferService.getIdpid().subscribe(data => {
    //  this.idpid = data;
    this.iDPId = event.target.value;
    // let header = `${this.idpid['token_type']} ${this.idpid['access_token']}`;

    // })

  }

  getValidData() {
    this.createOfferService.validateIdpid(this.iDPId).subscribe(() => {
      this.isIdpIdValid = true;
      if (this.offerCreateForm.valid == true && this.isIdpIdValid == true) {
        this.enableOfferbuild = false;
      }
      this.idpidValid = true;
      this.idpidInvalid = false;
    },
      () => {
        this.idpidValid = false;
        this.idpidInvalid = true;
        this.enableOfferbuild = true;
      })
  }

  updateMessage(message) {

    if (message != null && message !== '') {
      if (message === 'hold') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = { contentHead: '', content: 'The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.', color: 'black' };
      } else if (message === 'cancel') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = { contentHead: '', content: 'The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.', color: 'black' };
      }
    }
  }

  updateOffer(updateoffer) {
    updateoffer.offerId = this.offerId;
    updateoffer.caseId = this.caseId;
    const payLoad = {
      caseId: this.caseId,
      strategyReviewDate: this.strategyReviewDateValue,
      designReviewDate: this.designReviewDateValue,
      launchDate: this.expectedLaunchDateValue,
      readinessReviewDate: this.readinessReviewDateValue,
    };
    this.createOfferService.updateOffer(updateoffer).subscribe(() => {
      this.rightPanelService.updatePhaseTargetDate(payLoad).subscribe(() => {
        this.router.navigate(['/mmassesment', this.offerId, this.caseId]);
      })
    },
      (err) => {
        console.log(err);
      });

  }


}