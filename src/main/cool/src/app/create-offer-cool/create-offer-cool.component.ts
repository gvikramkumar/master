import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CreateOfferService } from '../services/create-offer.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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
  @ViewChild('createOfferForm') offerForm: NgForm;
  offerCreateForm: FormGroup;
  Obj;
  secondaryBusinessUnitList;
  secondaryBusinessEntityList;
  primaryBuList: string[] = [];
  primaryBeList: string[] = [];
  offerId: number;
  offerName: string;
  expectedLaunchDate: Date;
  offerDesc: string;
  mmMapperUserChoice: string;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  secondaryBusinessUnits: SelectItem[];
  secondaryBusinessEntities: SelectItem[];
  minDate: Date;
  isOffrBldrbtnDisabled: Boolean = true;
  primaryBusinessUnit: string;
  primaryBusinessEntitiy: string;
  constructor(private createOfferService: CreateOfferService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchCollaboratorService: SearchCollaboratorService,
    private userService: UserService) {

    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      this.primaryBusinessUnit = data.primaryBU[0];
      this.getPrimaryBusinessEntity(data.primaryBU[0]);
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
    this.createOfferService.getPrimaryBusinessEntity(event.toString())
      .subscribe(data => {
        this.primaryBusinessEntitiy = data[0].BE;
      });
  }

  mModelAssesment() {
    this.router.navigate(['/mmassesment', this.offerId]);
  }

  ngOnInit() {
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
    this.offerCreateForm = new FormGroup({
      offerName: new FormControl('', Validators.required),
      offerDesc: new FormControl('', Validators.required),
      primaryBUList: new FormControl(null, Validators.required),
      primaryBEList: new FormControl(null, Validators.required),
      BUSINESS_UNIT: new FormControl(null, Validators.required),
      BE: new FormControl(null, Validators.required),
      secondaryBUList: new FormControl(null, Validators.required),
      secondaryBEList: new FormControl(null, Validators.required),
      strategyReviewDate: new FormControl('', Validators.required),
      designReviewDate: new FormControl('', Validators.required),
      readinessReviewDate: new FormControl('', Validators.required),
      expectedLaunchDate: new FormControl('', Validators.required)
    });
    this.mmMapperUserChoice = 'DO';
    this.minDate = new Date();
  }

  createOffer() {
    const loggedInUserId = '';
    const offerOwner = '';
    const offerCreatedBy = '';
    this.primaryBuList.push(this.offerCreateForm.controls['primaryBUList'].value);
    this.primaryBeList.push(this.offerCreateForm.controls['primaryBEList'].value);
    const offerCreationDate = new Date().toDateString();
    const createoffer: CreateOffer = new CreateOffer(
      loggedInUserId,
      offerOwner,
      this.offerCreateForm.controls['offerName'].value,
      this.offerCreateForm.controls['offerDesc'].value,
      this.primaryBuList,
      this.primaryBeList,
      this.offerCreateForm.controls['BUSINESS_UNIT'].value,
      this.offerCreateForm.controls['BE'].value,
      this.offerCreateForm.controls['secondaryBUList'].value,
      this.offerCreateForm.controls['secondaryBEList'].value,
      this.offerCreateForm.controls['strategyReviewDate'].value,
      this.offerCreateForm.controls['designReviewDate'].value,
      this.offerCreateForm.controls['readinessReviewDate'].value,
      this.offerCreateForm.controls['expectedLaunchDate'].value,
      offerCreatedBy,
      offerCreationDate);
    this.createOfferService.registerOffer(createoffer).subscribe((data) => {
      this.isOffrBldrbtnDisabled = false;
      this.offerId = data;
    },
      (err) => {
        console.log(err);
      });
  }
}
