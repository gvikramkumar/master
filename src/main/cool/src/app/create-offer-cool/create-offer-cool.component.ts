import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CreateOfferService } from '../services/create-offer.service';
import { NgForm } from '@angular/forms';
import { CreateOffer } from './create-offer';
import { SelectItem } from 'primeng/api';
import { SearchCollaboratorService } from '../services/search-collaborator.service';
import { UserService } from '../services/user.service';

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
  minDate: Date;
  primaryBusinessUnits: SelectItem[];
  primaryBusinessEntities: SelectItem[];
  offerNameValue: string;
  offerDescValue: string;
  primaryBusinessUnitsValue: string;
  primaryBusinessEntitiesValue: string;
  secondaryBusinessUnitsValue: string;
  secondaryBusinessEntitiesValue: string;
  strategyReviewDateValue: string;
  designReviewDateValue: string;
  readinessReviewDateValue: string;
  expectedLaunchDateValue: string;
  caseId:string;
  userSelectedAllUnits;

  constructor(private createOfferService: CreateOfferService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchCollaboratorService: SearchCollaboratorService,
    private userService: UserService) {

    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      this.primaryBusinessUnitList = <any>data;
      const primaryBuArry = [];
      this.primaryBusinessUnitList.businessUnits.forEach(element => {
        primaryBuArry.push({ label: element, value: element });
      });
      this.primaryBusinessUnits = primaryBuArry;
    });

    this.createOfferService.getSecondaryBusinessUnit().subscribe(data => {
      this.secondaryBusinessUnitList = <any>data;
      const secondaryBuArry = [];
      this.secondaryBusinessUnitList.forEach(element => {
        secondaryBuArry.push({ label: element.BUSINESS_UNIT, value: element.BUSINESS_UNIT });
      });
      this.secondaryBusinessUnits = secondaryBuArry;
    });

    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['id'];
    });
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  getSecondaryBusinessEntity(event) {
    this.createOfferService.getSecondaryBusinessEntity(event.toString())
      .subscribe(data => {
        this.secondaryBusinessEntityList = <any>data;
        const secondaryBeArry = [];
        this.secondaryBusinessEntityList.forEach(element => {
          secondaryBeArry.push({ label: element.BE, value: element.BE });
        });
        this.secondaryBusinessEntities = this.removeDuplicates(secondaryBeArry, 'label');
      });
  }

  getPrimaryBusinessEntity(event) {
    if( event.toString() === 'All') {
      this.userSelectedAllUnits = true;
    }
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

  createOffer() {
    const loggedInUserId = '';
    const offerOwner = '';
    const offerCreatedBy = '';
    // this.primaryBuList.push(this.primaryBusinessUnit);
    // this.primaryBeList.push(this.primaryBusinessEntitiy);
    const offerCreationDate = new Date().toDateString();
    const createoffer: CreateOffer = new CreateOffer(
      loggedInUserId,
      offerOwner,
      this.offerNameValue,
      this.offerDescValue,
      this.primaryBusinessUnitsValue,
      this.primaryBusinessEntitiesValue,
      this.secondaryBusinessUnitsValue,
      this.secondaryBusinessEntitiesValue,
      this.strategyReviewDateValue,
      this.designReviewDateValue,
      this.readinessReviewDateValue,
      this.expectedLaunchDateValue,
      offerCreatedBy,
      offerCreationDate);
      console.log(createoffer);
    this.createOfferService.registerOffer(createoffer).subscribe((data) => {
      this.offerId = data.offerId;
      this.caseId = data['case-ID'];
      this.router.navigate(['/mmassesment', this.offerId, this.caseId]);
    },
      (err) => {
        console.log(err);
      });
  }
}
