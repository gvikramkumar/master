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
  businessUnitAndEntityList;
  offerId:number;
  offerName:string;
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

  constructor(private createOfferService:CreateOfferService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private searchCollaboratorService: SearchCollaboratorService,
              private userService: UserService) {
    this.dpConfig.containerClass = 'theme-green custome-date';
    this.createOfferService.getOfferBox().subscribe(data => {
      this.offerBox = data;
    });
    this.createOfferService.getQuestionsBox().subscribe(data => {
      this.questionBox = data;
    });
    this.createOfferService.getAllBusinessUnit().subscribe(data => {
      this.businessUnitList = <any>data;
    });
    this.createOfferService.getBusinessUnitAndEntity().subscribe(data => {
      this.businessUnitAndEntityList = <any>data;
      const primaryBuArry = [];
      const primaryBeArry = [];
      this.businessUnitAndEntityList.primaryBU.forEach( element => {
        primaryBuArry.push({label: element, value: element});
      });
      this.businessUnitAndEntityList.primaryBE.forEach( element => {
        primaryBeArry.push({label: element, value: element});
      });
      this.primaryBusinessUnits = primaryBuArry;
      this.primaryBusinessEntities = primaryBeArry;
    });
    this.createOfferService.getAllBusinessEntity().subscribe(data => {
      this.businessEntityList = <any>data;
    });

    this.createOfferService.getSecondaryBusinessUnit().subscribe(data => {
      this.secondaryBusinessUnitList = <any>data;
      const secondaryBuArry = [];
      this.secondaryBusinessUnitList.forEach( element => {
        secondaryBuArry.push({label: element.BUSINESS_UNIT, value: element.BUSINESS_UNIT});
      });
      this.secondaryBusinessUnits = secondaryBuArry;
    });

    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['id'];
    });
  }

  createOfferId(offerText) {
    if(this.createOfferService.coolOffer.offerId == null) {
      this.createOfferService.coolOffer.offerName = offerText;
      this.createOfferService.postDataForOfferId(this.createOfferService.coolOffer)
        .subscribe(data => {
          this.disableOfferName = true;
          this.createOfferService.coolOffer = data;
          this.offerId = this.createOfferService.coolOffer.offerId;
        });
    }
  }
  getDate(millis) {
    if(millis !== undefined) {
      var date = new Date(millis);
      return date;
    }
    return null;
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
        this.secondaryBusinessEntityList.forEach( element => {
          secondaryBeArry.push({label: element.BE, value: element.BE});
        });
        this.secondaryBusinessEntities = this.removeDuplicates(secondaryBeArry,'label');
      });
  }
  mModelAssesment() {
    this.router.navigate(['/mmassesment', 1]);// offerId=>1;
  }

  ngOnInit() {
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
  }

  selectUserMMChoice(mmMapperUserChoice) {
    this.mmMapperUserChoice = mmMapperUserChoice;
  }

  mmSelected(selectedMM, mmArray) {
    this.mmId= selectedMM.mmId;
    selectedMM.selected = true;
    mmArray.forEach(mm => {
      if(mm.mmId !== selectedMM.mmId) {
        mm.selected = false;
      }
    });
  }

  questionSelected(question, questionChoice) {
    if(undefined == questionChoice.selected) {
      questionChoice.selected = false;
    }
    questionChoice.selected = !questionChoice.selected;
    this.updateQuestionSelection(question, questionChoice, questionChoice.selected);

  }

  updateQuestionSelection(question,questionChoice,selectedFlag) {
    var choiceArray = this.selectedQuestionAnswer[question.questionID];

    if(choiceArray === undefined || choiceArray == null) {
      choiceArray = Array<string>();
    }

    if(selectedFlag) {
      choiceArray.push(questionChoice.choiceName);
    } else {
      var index = choiceArray.indexOf(questionChoice.choiceName);
      choiceArray.splice(index, 1);
    }

    this.selectedQuestionAnswer[question.questionID] = choiceArray;

  }

  updateOffer(model,selectedValue,) {
    if(model == 'offerDesc') {
      this.createOfferService.coolOffer.offerDesc = this.offerDesc;
    } else if(model === 'expectedLaunchDate') {
      this.createOfferService.coolOffer.expectedLaunchDate = this.expectedLaunchDate;
    }
    this.updateOfferWithChanges();

  }
  updateOfferWithChanges() {
    this.createOfferService.postDataForOfferId(this.createOfferService.coolOffer).subscribe(data => {
      this.createOfferService.coolOffer = data;
    });
  }

  openMMAssignment() {
    if(this.mmMapperUserChoice === 'DO') {
      this.Obj = {
        'offerId': this.createOfferService.coolOffer.offerId,
        'mmChoice': this.mmMapperUserChoice,
        'mmId': this.mmId
      };
    } else if(this.mmMapperUserChoice === 'DONT') {
      this.Obj = {
        'offerId': this.createOfferService.coolOffer.offerId,
        'mmChoice': this.mmMapperUserChoice,
        'questionAnswer': this.selectedQuestionAnswer
      };
    }

    if(this.mmMapperUserChoice === 'DONT'
      && this.selectedQuestionAnswer === {}) {
      alert('Please select question choices');
      return;
    } else if(this.mmMapperUserChoice === 'DO'
      && (this.mmId === '' || this.mmId === undefined)) {
      alert('Please select MM');
      return;
    }

    this.createOfferService.postDataofMmMapper(this.Obj).subscribe(data=> {
      var response = <any> data;
      if(response.status != 'FAILED') {
        this.router.navigate(['/mmassesment/'+this.offerId]);
      } else {
        alert(response.exception);
      }
    });
  }
  selectBUAndBE(model, value) {
    if(model === 'businessEntity') {
      this.createOfferService.coolOffer.businessEntity = value;
      this.createOfferService.coolOffer.expectedLaunchDate = this.expectedLaunchDate;
    } else if(model === 'businessUnit') {
      this.createOfferService.coolOffer.businessUnit = value;
      this.createOfferService.coolOffer.expectedLaunchDate = this.expectedLaunchDate;
    }
    this.updateOfferWithChanges();
  }

  selectSBUAndSBE(model, value) {
    if(model === 'secondaryBusinessEntity') {
      this.createOfferService.coolOffer.secondaryBusinessEntity = value;
      this.createOfferService.coolOffer.expectedLaunchDate = this.expectedLaunchDate;
    } else if(model === 'secondaryBusinessUnit') {
      this.createOfferService.coolOffer.secondaryBusinessUnit = value;
      this.createOfferService.coolOffer.expectedLaunchDate = this.expectedLaunchDate;
    }
    this.updateOfferWithChanges();
  }

  createOffer() {
    this.offerId = this.createOfferService.coolOffer.offerId;
    let loggedInUserId = this.userService.getUserId();
    let createoffer: CreateOffer = new CreateOffer(
      loggedInUserId,
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
      this.offerCreateForm.controls['expectedLaunchDate'].value);
    this.createOfferService.registerOffer(createoffer).subscribe();
  }
}
