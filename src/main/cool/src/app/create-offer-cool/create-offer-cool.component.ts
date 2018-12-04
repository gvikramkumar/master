import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CreateOfferService } from '../services/create-offer.service';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {CreateOffer} from './create-offer';
import {SelectItem} from 'primeng/api';
import {AddEditCollaborator} from './add-edit-collaborator';
import {SearchCollaboratorService} from '../services/search-collaborator.service';
import { UserService } from '../services/user.service';
import { now } from 'moment';

@Component({
  selector: 'app-create-offer-cool',
  templateUrl: './create-offer-cool.component.html',
  styleUrls: ['./create-offer-cool.component.css'],
  providers: [UserService]
})
export class CreateOfferCoolComponent implements OnInit {
  @ViewChild('createOfferForm') offerForm: NgForm;
  offerCreateForm: FormGroup;
  panels = {
    'panel1': true,
    'panel2': true
  }
  Obj;
  disableOfferName;
  questionBox:any[];
  offerBox:any[];
  businessUnitList;
  businessEntityList;
  secondaryBusinessUnitList;
  secondaryBusinessEntityList;
  primaryBusinessUnitList;
  offerId: number;
  offerName: string;
  expectedStrategyReviewDate: Date;
  expectedDesignReviewDate: Date;
  expectedReadinessReviewDate: Date;
  expectedLaunchDate: Date;
  offerDesc:string;
  businessUnit:string;
  businessEntity:string;
  secondaryBusinessUnit: string;
  secondaryBusinessEntity:string;
  selectedQuestionAnswer= {};
  mmMapperUserChoice:string;
  mmId:string;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  primaryBusinessUnits: SelectItem[];
  primaryBusinessEntities: SelectItem[];
  secondaryBusinessUnits: SelectItem[];
  secondaryBusinessEntities: SelectItem[];
  minDate: Date;
  isOffrBldrbtnDisabled: boolean = true;
  constructor(private createOfferService: CreateOfferService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchCollaboratorService: SearchCollaboratorService,
    private userService: UserService) {
 

    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      console.log(data);
      this.primaryBusinessUnitList = <any>data;
      const primaryBuArry = [];

      this.primaryBusinessUnitList.primaryBU.forEach(element => {
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
    console.log(111);
    console.log(event);
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
    console.log(111);
    console.log(event);
    this.createOfferService.getPrimaryBusinessEntity(event[0])
    
      .subscribe(data => {
        console.log(data);
        const primaryBeArry = [];
        data.forEach(element => {
          primaryBeArry.push({ label: element.BE, value: "Security" });
        });
        
        this.primaryBusinessEntities = primaryBeArry;
      });
      
    
  }

  mModelAssesment() {
    this.router.navigate(['/mmassesment', this.offerId]);
  }

  ngOnInit() {
    this.dpConfig = Object.assign({}, { containerClass: "theme-blue", showWeekNumbers:false});

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
    // this.offerId = this.createOfferService.coolOffer.offerId;
    let loggedInUserId;
    let offerOwner;
    let offerCreatedBy;
    let offerCreationDate = new Date().toDateString();
    console.log(offerCreationDate);
    let createoffer: CreateOffer = new CreateOffer(
      loggedInUserId,
      offerOwner,
      this.offerCreateForm.controls['offerName'].value,
      this.offerCreateForm.controls['offerDesc'].value,
      this.offerCreateForm.controls['primaryBUList'].value,
      this.offerCreateForm.controls['primaryBEList'].value,
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

      console.log(createoffer);
    this.createOfferService.registerOffer(createoffer).subscribe((data) => {
      this.isOffrBldrbtnDisabled = false;
      console.log(data);
      this.offerId = data;
    },
      (err) => {
        console.log(err)
      });
  }
}
