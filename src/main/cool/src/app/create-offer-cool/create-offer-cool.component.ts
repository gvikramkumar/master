import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CreateOfferService } from '../services/create-offer.service';
import { NgForm } from '@angular/forms';
import { CreateOffer } from './create-offer';
import { SelectItem } from 'primeng/api';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';
import { Status } from './status';
import { OfferDetailViewService } from '../services/offer-detail-view.service';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';

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
  isIdpIdValid = false;
  enableOfferbuild = true;
  userSelectedAllUnits;
  idpidValid = false;
  idpidInvalid = false;
  idpvalue;
  secondaryBUbackup: any;


  constructor(private createOfferService: CreateOfferService,
    private offerDetailViewService: OfferDetailViewService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private localStorage: LocalStorageService) {
    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['id'];
      if (this.offerId) {
        this.offerDetailViewService.offerDetailView(this.offerId).subscribe(offerDetailRes => {
          this.caseId = offerDetailRes.caseId;
          this.offerNameValue = offerDetailRes.offerName;
          this.offerDescValue = offerDetailRes.offerDesc;
          this.primaryBusinessUnitsValue = offerDetailRes.primaryBUList;
          this.getPrimaryBusinessEntityPromise(offerDetailRes.primaryBUList)
            .then(() => {
              this.primaryBusinessEntitiesValue = offerDetailRes.primaryBEList.toString();
            });
          this.secondaryBusinessUnitsValue = offerDetailRes.secondaryBUList;
          this.getSecondaryBusinessEntityPromise(offerDetailRes.secondaryBUList)
            .then(() => {
              this.secondaryBusinessEntitiesValue = offerDetailRes.secondaryBEList;
            });
          this.strategyReviewDateValue = moment(offerDetailRes.strategyReviewDate).format('MM/DD/YYYY');
          this.designReviewDateValue = moment(offerDetailRes.designReviewDate).format('MM/DD/YYYY');
          this.readinessReviewDateValue = moment(offerDetailRes.readinessReviewDate).format('MM/DD/YYYY');
          this.expectedLaunchDateValue = moment(offerDetailRes.expectedLaunchDate).format('MM/DD/YYYY');
          this.idpvalue = offerDetailRes.iDPId;
        });
      }
    });

  
    this.createOfferService.getDistinctBE().subscribe(data => {
      const primaryBeArry = [];
      const dataArray = data as Array<any>;
      dataArray.forEach(element => {
        if (element['BE'] !== null) {
          primaryBeArry.push({ label: element['BE'], value: element['BE'] });
        }
      });

      this.primaryBusinessEntities = primaryBeArry;
      this.secondaryBusinessEntities = primaryBeArry;
    });


  
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
    return new Promise((resolve, reject) => {
      this.createOfferService.getSecondaryBusinessEntity(event.toString())
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
      this.secondaryBusinessUnitsValue = null;
      this.secondaryBusinessUnitsFiltered = tmpBusinessUnites;
    }
  }

  
  getPrimaryBusinessUnitBasedOnPrimaryBE(event) {
    this.primaryBusinessUnitsValue = null;
    this.secondaryBusinessEntitiesValue = null;
    this.secondaryBusinessUnitsValue = null;
    this.getPrimaryBusinessUnitPromise(event);
  }

  getPrimaryBusinessUnitPromise(event) {
    return new Promise((resolve, reject) => {
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

    return new Promise((resolve, reject) => {
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

    return new Promise((resolve, reject) => {
      this.createOfferService.getPrimaryBusinessEntity(event.toString())
        .subscribe(data => {
          const primaryBeArry = [];
          // When primary business unit is selected as 'All'
          // then entities are displayed as 'all
          if (data.length === 0 && this.userSelectedAllUnits) {
            primaryBeArry.push({ label: 'All', value: 'All' });
          }

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
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });

    this.mmMapperUserChoice = 'DO';
    this.minDate = new Date();
  }

  goBack() {
    this._location.back();
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

    const offerCreationDate = new Date().toISOString();
    const selectedPrimaryBe= [];
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
    if (!this.offerId) {
      this.createOffer(createoffer);
    } else {
      this.updateOffer(createoffer);
    }
  }

  createOffer(createoffer) {

    this.createOfferService.registerOffer(createoffer).subscribe((data) => {
      this.offerId = data.offerId;
      this.caseId = data.caseId;
      this.localStorage.store('currentOfferName', this.offerNameValue);
      this.router.navigate(['/mmassesment', this.offerId, this.caseId]);
    },
      (err) => {
        console.log(err);
      });
  }

  getidptoken(event) {
   // this.createOfferService.getIdpid().subscribe(data => {
    //  this.idpid = data;
      this.iDPId = event.target.value;
     // let header = `${this.idpid['token_type']} ${this.idpid['access_token']}`;
      this.createOfferService.validateIdpid( this.iDPId).subscribe(data => {
        this.isIdpIdValid = true;
        if (this.offerCreateForm.valid == true && this.isIdpIdValid == true) {
          this.enableOfferbuild = false;
        }
        this.idpidValid = true;
        this.idpidInvalid = false;
      },
        error => {
          this.idpidValid = false;
          this.idpidInvalid = true;
          this.enableOfferbuild = true;
        })
   // })

  }



  updateOffer(createoffer) {
    createoffer.offerId = this.offerId;
    createoffer.caseId = this.caseId;
    this.createOfferService.updateOffer(createoffer).subscribe((data) => {
      this.router.navigate(['/mmassesment', this.offerId, this.caseId]);
    },
      (err) => {
        console.log(err);
      });

  }

}
