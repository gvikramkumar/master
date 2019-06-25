import { OfferconstructPIDService } from './../../../feature/construct/offer-construct-canvas/service/offer-construct-pid.service';
import { LoaderService } from '@app/core/services/loader.service';
import { Component, OnInit, Input, Output, ViewChild, ElementRef, Renderer, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { OfferConstructService } from '@app/services/offer-construct.service';
import * as moment from 'moment';
import { OfferconstructCanvasService } from '@app/feature/construct/offer-construct-canvas/service/offerconstruct-canvas.service';
import { OfferConstructDefaultValue } from '@app/feature/construct/offer-construct-canvas/service/offer-construct-defaultvalue-services';
import { ConfirmationService } from 'primeng/api';
import { OfferDetailViewService } from '@app/services/offer-detail-view.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dynamic-form-multiple',
  templateUrl: './dynamic-form-multiple.html',
  styleUrls: ['./dynamic-form-multiple.css'],
  providers: [DatePipe]
})
export class DynamicFormMultipleComponent implements OnInit {
  public offerInfo: any;
  public majorOfferInfo: any;
  public minorOfferInfo: any;
  public headerArray: any;
  public tableShowCondition: boolean = false;
  public ismajorSection: boolean = true;
  public minorLineItemsActive: Boolean = false;
  public majorLineItemsActive: Boolean = false;
  public copyAttributeResults: any;
  public results: any;
  public beListType: any;
  public selectedProduct: any = [];
  public selectedTab: string;
  public itemsData: any;
  public itemsList: any = [];
  public lengthList: any;
  currentOfferId;
  public currenntHeaderName: any;
  @Output() valueChange = new EventEmitter();
  @Output() clkDownloadZip = new EventEmitter();
  public viewDetails: Boolean = false;
  public detailArray: any[] = [];
  public headerName: any = '';
  offerForm: FormGroup;
  onLoad: boolean = false;
  public showLoader: boolean = false;
  private billing_soa = "Billing SOA SKU";
  lastIndex = -1;
  closeDialogAction: number = 0;
  @Input() indexVal;
  @Input() isItemCreation: boolean;
  eGenieAlert: boolean;
  createdeGenie: boolean;
  itemNameInvalid: Boolean = false;
  constructor(public offerConstructService: OfferConstructService,
    private offerConstructCanvasService: OfferconstructCanvasService,
    private loaderService: LoaderService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private defaultValueServices: OfferConstructDefaultValue,
    private OfferconstructPIDService: OfferconstructPIDService,
    private offerDetailViewService: OfferDetailViewService,
    private confirmationService: ConfirmationService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
    });
  }

  ngOnInit() {
    this.onLoad = true;
    this.offerInfo = this.offerConstructService.singleMultipleFormInfo;
    this.majorOfferInfo = this.offerInfo.major;
    this.minorOfferInfo = this.offerInfo.minor;

    this.tableShowCondition = true;
    this.selectedTab = 'major';
    this.createObjectForSearch();
    this.offerDetailView();

    console.log(this.offerInfo);

  }

  createObjectForSearch() {
    //create object with blank value for search operation
    let major = {};
    let minor = {};
    this.majorOfferInfo.forEach((element, index) => {
      let name: any = Object.keys(element);
      major[name] = '';
    });
    this.minorOfferInfo.forEach(element => {
      let name: any = Object.keys(element);
      minor[name] = '';
    });
    this.itemsList = { major: major, minor: minor };

  }

  majorSection() {
    this.ismajorSection = true;
    this.minorLineItemsActive = false;
    this.majorLineItemsActive = true;
    this.selectedTab = 'major';
  }

  minorSection() {
    this.onLoad = false;
    this.ismajorSection = false;
    this.majorLineItemsActive = false;
    this.minorLineItemsActive = true;
    this.selectedTab = 'minor';
  }
  getprimaryBEListType(primaryBEList) {
    this.beListType = primaryBEList[0];
  }

  offerDetailView() {
    // Check if construct details are availbale in the database for the current offer.
    this.offerDetailViewService.retrieveOfferDetails(this.currentOfferId).subscribe(offerDetailRes => {
      if (offerDetailRes.primaryBEList !== null && offerDetailRes.primaryBEList !== undefined) {
        if (offerDetailRes.primaryBEList.length > 0) {
          this.getprimaryBEListType(offerDetailRes.primaryBEList);
        }
      }
    }, (err) => {
      console.log(err);
      this.loaderService.stopLoading();
    }, () => {
      this.loaderService.stopLoading();
    });
  }

  onHideViewDetailsModal() {
    console.log("test");

    //this.closeDailog(false);  //reset form info
  }

  saveForm() {
    let isUdate: boolean = true;
    this.majorOfferInfo.forEach((list, index) => {
      let groupName: any = Object.keys(list);
      this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach((element, index) => {
        let title: any = Object.keys(element);
        this.replaceOrUpdatevalue(element[title], isUdate)
      });
    });

    this.minorOfferInfo.forEach((list, index) => {
      let groupName: any = Object.keys(list);
      this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].forEach((element, index) => {
        let title: any = Object.keys(element);
        this.replaceOrUpdatevalue(element[title], isUdate)
      });
    });

    let counter = 10;
    this.valueChange.emit(counter);
    this.closeDialogAction = 1;
    //this.offerConstructService.closeAddDetails = false;
  }
  eGenieDefault(q) {
    if (q.value.eGenieFlag) {
      this.eGenieAlert = true;
    }
    if (q.value.newItemEGenieStatus) { this.createdeGenie = true }
  }

  openEgineTab(q) {
    if (q.value.eGenieFlag) {
      this.OfferconstructPIDService.showEgenie(q.value.title);
    }
  }

  onShowDialog() {
    this.closeDialogAction = 1;
    this.minorSection();
    setTimeout(() => {
      this.majorSection();
    }, 0);
  }
  confirmDialog() {
    this.closeDialogAction++;
    if (this.closeDialogAction <= 1) {
      this.confirmationService.confirm({
        message: 'You have not saved changes to this page. If you would like to save these changes, please Save before proceeding to another screen.',
        accept: () => {
        },
        reject: () => {
        }
      });
    } else { this.closeDialog() }
  }
  closeDialog() {
    this.majorSection();
    this.offerConstructService.closeAddDetails = false;
    this.indexVal = this.lastIndex--;
    let isUdate: boolean = true;
    this.majorOfferInfo.forEach((list, index) => {
      let groupName: any = Object.keys(list);
      this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach((element, index) => {
        let title: any = Object.keys(element);
        if (!element[title].eGenieFlag || element[title].eGenieFlag === false) {
          element[title].listOfferQuestions.forEach(majorProduct => {
            if (majorProduct.componentType !== "Multiselect") {
              majorProduct.currentValue = majorProduct.previousValue;
            } else {
              majorProduct.listCurrentValue = majorProduct.listPreviousValue;
            }
          });
        }
      });
    });
    this.minorOfferInfo.forEach((list, index) => {
      let groupName: any = Object.keys(list);
      this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].forEach((element, index) => {
        let title: any = Object.keys(element);
        if (!element[title].eGenieFlag || element[title].eGenieFlag === false) {
          element[title].listOfferQuestions.forEach(minorProduct => {
            if (minorProduct.componentType !== "Multiselect") {
              minorProduct.currentValue = minorProduct.previousValue;
            } else {
              minorProduct.listCurrentValue = minorProduct.listPreviousValue;
            }
          });
        }
      });
    });
  }

  replaceOrUpdatevalue(questions, isUdate) {
    if (!questions.eGenieFlag || questions.eGenieFlag === false) {
      if (isUdate) {
        questions.listOfferQuestions.forEach(list => {
          if (list.componentType !== "Multiselect") {
            list.previousValue = list.currentValue;
          } else {
            list.listPreviousValue = list.listCurrentValue;
          }
        });
      } else {
        questions.listOfferQuestions.forEach(item => {
          if (item.componentType !== "Multiselect") {
            item.currentValue = item.previousValue;
          } else {
            item.listCurrentValue = item.listPreviousValue;
          }
        });
      }
    }
  }

  //search copy and paste in multiple form

  onTabOpen(e, headerName) {
    this.currenntHeaderName = headerName;
    // this.itemsList[headerName] = {};

  }

  searchCopyAttributes(event) {
    const searchString = event.query.toUpperCase();
    this.offerConstructCanvasService.searchEgenie(searchString).subscribe((results) => {
      this.showLoader = true;
      this.copyAttributeResults = [...results];
    },
      (error) => {
        this.results = [];
      }
    );
  }

  getSelctedProduct(event, records) {
    if (event.target.checked) {
      if (this.selectedProduct.length == 0) {
        this.selectedProduct.push(records);
      } else {
        this.selectedProduct.forEach(element => {
          if ((element.groupName == records.groupName) && (element.groupName == records.groupName)) {
            this.selectedProduct.push(records);
          } else {
            this.selectedProduct.push(records);
          }
        });
      }
    } else {
      if (this.selectedProduct.length > 0) {
        console.log('-- Before remove--- ', this.selectedProduct);
        this.selectedProduct = this.removeFromArray(this.selectedProduct, records.uniqueKey)
        console.log('-- After remove--- ', this.selectedProduct);
      }
    }
  }

  removeFromArray(array, key) {
    let index = array.findIndex(x => x.uniqueKey === key);
    array.splice(index, 1);
    return array;
  }

  patchvalueToSelected(groupName) {
    // If Billing SOA SKU is selected, for comparison with PID's Item category Name,
    // it needs to be assigned to Billing.
    let isBillingSOA = false;
    if (groupName === 'Billing SOA SKU') {
      groupName = 'Billing';
      isBillingSOA = true;
    }

    let itemsData = this.itemsData;
    if (itemsData !== undefined) {
      if (groupName === itemsData['Item Category']) {
        if (isBillingSOA) {
          groupName = 'Billing SOA SKU';
        }
        this.selectedProduct.forEach(product => {
          if (groupName = product.groupName) {
            for (let searchValue in itemsData) {
              product.listOfferQuestions.forEach(element => {
                if (searchValue === element.question) {
                  element.currentValue = itemsData[searchValue];
                }
              });
            }
          }
        });
      }
    }
  }

  addItms(groupName) {
    let selectedSection = this.selectedTab;
    let selectedGroup = groupName;
    if (this.showLoader) {
      if (this.itemsList[selectedSection][selectedGroup].PID != undefined) {
        this.headerName = this.itemsList[selectedSection][selectedGroup].PID;
        this.loaderService.startLoading();
        this.offerConstructCanvasService.getPidDetails(this.itemsList[selectedSection][selectedGroup].PID).subscribe(items => {
          this.loaderService.stopLoading();
          this.showLoader = false;
          if (items != undefined) {
            this.itemsData = items.body;
          } else {
            console.log("network error");
          }
        }, (err) => {
          this.showLoader = false;
          this.loaderService.stopLoading();

        }, () => {
          this.loaderService.stopLoading();
          this.showLoader = false;
        });
      }
    }
  }

  dateFormat(val) {
    if (val !== '') {
      return this.datePipe.transform(new Date(val), 'MM/dd/yyyy');
    }
  }

  updateDate(e) {
    return this.datePipe.transform(new Date(e), 'MM/dd/yyyy');
  }

  patchToALL(groupName) {
    // If Billing SOA SKU is selected, for comparison with PID's Item category Name,
    //  it needs to be assigned to Billing.
    let isBillingSOA = false;
    if (groupName === 'Billing SOA SKU') {
      groupName = 'Billing';
      isBillingSOA = true;
    }

    let itemsData = this.itemsData;
    // copy items from the same ICC type
    if (itemsData !== undefined) {
      if (groupName === itemsData['Item Category']) {
        //copy in major section or minor section
        if (this.ismajorSection) {
          this.majorOfferInfo.forEach((element, index) => {
            let gname: any = Object.keys(element);
            if (gname == groupName) {
              element[gname].productInfo.forEach((questionset, index) => {
                let setname: any = Object.keys(questionset);
                if (!questionset[setname].eGenieFlag) {
                  this.copySearchItemToAllSection(questionset[setname].listOfferQuestions);
                }
              });
            }
          });
        } else {
          if (isBillingSOA) {
            groupName = 'Billing SOA SKU';
          }
          this.minorOfferInfo.forEach((element, index) => {
            let gname: any = Object.keys(element);
            if (gname == groupName) {
              element[gname].productInfo.forEach((questionset, index) => {
                let setname: any = Object.keys(questionset);
                if (!questionset[setname].eGenieFlag) {
                  this.copySearchItemToAllSection(questionset[setname].listOfferQuestions);
                }
              });
            }
          });
        }
      }
    }
  }

  copySearchItemToAllSection(questionset) {
    let itemsData = this.itemsData;
    if (itemsData != undefined) {
      for (let searchValue in itemsData) {
        // itemsData.forEach(searchValue => {
        questionset.forEach(element => {
          if (searchValue === element.question) {
            element.currentValue = itemsData[searchValue];
          }
        });
      }
    }
  }

  displayViewDetails() {
    if (this.itemsData) {
      this.detailArray = [];
      for (let key in this.itemsData) {
        if (key !== 'major/minor') {
          this.detailArray.push({
            egenieAttribute: key,
            value: this.itemsData[key]
          });
        }
      }
      this.viewDetails = true;
    }
  }

  onHideViewDetails() {
    this.viewDetails = false;
  }


  addAllDetailsValidationsonChange(e, question, questionList?, groupName?) {
    this.closeDialogAction = 0;
    // set base price value according to billing_soa SOA Pricing selection type && questionList == this.billing_soa
    if (questionList !== undefined) {
      /* Added to track user modified details vs auto populated ones for Mark as Complete story*/
      question.lastModifiedBy = 'User';
      if (groupName == this.billing_soa) {
        if (question.question == "SOA Pricing" || question.question == "Monthly Amount") {
          questionList.forEach(e => {
            if (e.question == "SOA Pricing") {
              if (e.currentValue == "Flat") {
                this.defaultValueServices.setBasePriceInBillingSOADForFlat(questionList);
              }

              if (e.currentValue == "% of Product List") {
                this.defaultValueServices.setBasePriceInBillingSOAForProduct(questionList);
              }
            }
          });
        }
        if (question.question === 'Service Type?') {
          if (question.currentValue === 'Support') {
            this.defaultValueServices.serviceTypeValue = 'Support';
            this.defaultValueServices.setSubscriptionType(questionList, this.defaultValueServices.serviceTypeValue);
          }

          if (question.currentValue === 'Service') {
            this.defaultValueServices.serviceTypeValue = 'Service';
            this.defaultValueServices.setSubscriptionType(questionList, this.defaultValueServices.serviceTypeValue);
          }
        }
      }
      if (question.question === 'Service Type?') {
        if (question.currentValue === 'N/A') {
          this.defaultValueServices.serviceTypeValue = 'Support';
          this.defaultValueServices.setSubscriptionType(questionList, this.defaultValueServices.serviceTypeValue);
        }
      }

      if (question.question == "Description") {
        this.defaultValueServices.setLongDescription(questionList);
      }

      if (question.question == "Default True Up Term") {
        this.defaultValueServices.setDefaultTrueupTerm(questionList);
      }
      if (question.question == "Default Initial Term") {
        this.defaultValueServices.setDefIniTerm(questionList);
      }

      if (question.question == "Default Initial Term") {
        this.defaultValueServices.setDefaultInitialTerm(questionList);
      }

      if (question.question == "STD AUTO RENEWAL TERM") {
        this.defaultValueServices.setDefaultAutoRenewalTerm(questionList);
      }

      if (question.question == "Smart Licensing Enabled") {
        if (question.currentValue == "Yes") {
          this.defaultValueServices.setSmartAccountSOAForProduct(questionList);
        }
        if (question.currentValue == "No") {
          this.defaultValueServices.setSmartAccountForSmartLicensingEnabledNo(questionList);
        }

      }

      if (question.question == "Is The PID Product Based?") {
        if (question.currentValue == "Yes") {
          this.defaultValueServices.setPricingFormula(questionList);
        }
        if (question.currentValue == "No") {
          this.defaultValueServices.setPricingFormulaNo(questionList);
        }

      }

      if (question.question == "Terms & Payments Required") {
        if (question.currentValue == "Yes") {
          this.defaultValueServices.setTermsPaymentsRequired(questionList);
        }
        if (question.currentValue == "No") {
          this.defaultValueServices.setTermsPaymentsRequiredN(questionList);
        }

      }

      if (question.question == "Pricing Approval Required") {
        if (question.currentValue == "Yes") {
          this.defaultValueServices.setPricingApprovalRequired(questionList);
        }
        if (question.currentValue == "No") {
          this.defaultValueServices.setPricingApprovalRequiredN(questionList);
        }

      }
      if (question.question == "Refurbished Item?") {
        if (question.currentValue == "Yes") {
          this.defaultValueServices.setRefurbishedItemRequired(questionList);
        }
        if (question.currentValue == "No") {
          this.defaultValueServices.setRefurbishedItemRequiredN(questionList);
        }

      }

      if (question.question == "Delivery Option") {
        if (question.currentValue == "ELECTRONIC") {
          this.defaultValueServices.setEnablePartySWKey(questionList);
        }
        else {
          this.defaultValueServices.setEnablePartySWKeyN(questionList);
        }

      }

      if (question.question == "Terms & Payments Required") {
        if (question.currentValue == "Yes") {
          this.defaultValueServices.setSubscriptionOffset(questionList);
        }
        else {
          this.defaultValueServices.setSubscriptionOffsetN(questionList);
        }

      }

      // if (question.question == "Product Reliability Class") {
      //     if (question.currentValue == "Yes") {
      //         this.defaultValueServices.setSubscriptionOffset(questionList);
      //     }
      // }

      if (question.question == "Enablement") {
        if (question.currentValue == "Y") {
          this.defaultValueServices.setEnablementFileType(questionList);
        }
        else {
          this.defaultValueServices.setEnablementFileTypeN(questionList);
        }
      }

      if (question.question == "Enablement File Type") {
        if (question.currentValue == "EMM" || question.currentValue == "Hybrid") {
          this.defaultValueServices.setConditionalAccess(questionList);
        }
        else {
          this.defaultValueServices.setConditionalAccessN(questionList);
        }
      }

      if (question.question == "SOA Pricing") {
        if (question.currentValue == "Flat") {
          this.defaultValueServices.setSoaPricingbasedDefaultsFlat(questionList);
        }
        else {
          this.defaultValueServices.setSoaPricingbasedDefaultsFlatN(questionList);
        }
      }

      if (question.question == "SOA Pricing") {
        if (question.currentValue == "% of Product List") {
          this.defaultValueServices.setSoaPricingbasedDefaultsProduct(questionList);
        }
        else {
          this.defaultValueServices.setSoaPricingbasedDefaultsProductN(questionList);
        }
      }

      if (question.question == "Support Pricing Minimum (monthly) ") {
        if (question.currentValue == "Yes") {
          this.defaultValueServices.setMonthlySupportPricingProduct(questionList);
        }
        else {
          this.defaultValueServices.setMonthlySupportPricingProductN(questionList);
        }
      }

      if (question.question == "Monthly Amount") {
        if (question.currentValue != "$0") {
          this.defaultValueServices.setTMSNOde(questionList);
        }
        else {
          this.defaultValueServices.setTMSNOdeN(questionList);
        }
      }

      if (question.question == "Percentage Amount") {
        if (question.currentValue != "blank" || question.currentValue != "") {
          this.defaultValueServices.setTMSNOde1(questionList);
        }
        else {
          this.defaultValueServices.setTMSNOdeN1(questionList);
        }
      }

      if (question.question == "Service Type?") {
        if (question.currentValue == "Service") {
          this.defaultValueServices.setTMSNOdeASDefault(questionList);
        }
        if (question.currentValue == "Support") {
          this.defaultValueServices.setTMSNOdeASDefaultN(questionList);
        }
      }

      if (question.question == "Service Type?") {
        if (question.currentValue == "Support") {
          this.defaultValueServices.setTMSNOdeN2(questionList);
        }
      }

      if (question.question == "Monthly Amount") {
        if (question.currentValue != "$0") {
          this.defaultValueServices.setTMSNOdeTS(questionList, this.beListType);
        }
        else {
          this.defaultValueServices.setTMSNOdeTSN(questionList);
        }
      }

      if (question.question == "Percentage Amount") {
        if (question.currentValue != "blank" || question.currentValue != "") {
          this.defaultValueServices.setTMSNOdeTS1(questionList, this.beListType);
        }
        else {
          this.defaultValueServices.setTMSNOdeTSN1(questionList, this.beListType);
        }
      }

      if (question.question == "Service Type?") {
        if (question.currentValue == "Support") {
          this.defaultValueServices.setTMSNOdeTSDefault(questionList, this.beListType);
        }
        else {
          this.defaultValueServices.setTMSNOdeTSDefaultN(questionList, this.beListType);
        }
      }

      //
      // if (question.question == "Service Type?") {
      //     if(question.currentValue == "Support") {
      //         this.defaultValueServices.setTMSNOdeTSN2(questionList,this.beListType);
      //     }
      // }
      //
      if (question.question == "Service Type?") {
        if (question.currentValue == "Support") {
          this.defaultValueServices.setTMSNOdeASDisable(questionList);
        }
      }

      if (question.question == "Service Type?") {
        if (question.currentValue == "Service") {
          this.defaultValueServices.setTMSNOdeTSDisable(questionList, this.beListType);
        }
      }

      if (question.question == "SOA Pricing") {
        if (question.currentValue == "Flat") {
          this.defaultValueServices.setMonthlySupMin(questionList);
        }
      }

      if (question.question == "Service Type?") {
        if (question.currentValue == "Support") {
          this.defaultValueServices.settmsTsValue(questionList, this.beListType);
        }

      }
      if (question.question == "Service Type?") {
        if (question.currentValue == "Service") {
          this.defaultValueServices.settmsAsValue(questionList, this.beListType);
        }

      }


      if (question.question == "SOA Pricing") {
        if (question.currentValue == "% of Product List") {
          this.defaultValueServices.setTmsASTmsTS(questionList);
        }
      }

      if (question.question == "UDI Value") {
        if (question.currentValue == "Full UDI Compliance" || question.currentValue == "Will implement Physical visibility only"
          || question.currentValue == "Will implement Electronic visibility only") {
          this.defaultValueServices.setBasePID(questionList);
        }
        else {
          this.defaultValueServices.setBasePIDN(questionList);
        }
      }

      if (question.question == "Country Specific Association" || question.question == "ROHS") {
        this.defaultValueServices.getCountryNameValues(questionList);
      }

    }
    var validatorPattern = '';
    if (question.egineAttribue !== "Item Name (PID)") {
      if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "numeric" && question.question != "Default Initial Term") {
        if (!(/^[0-9]*$/.test(question.currentValue))) {
          question.rules.validationMessage = question.egineAttribue + " should be in " + question.rules.textcase;
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }
      if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "camel") {
        if (!(/^(([0-9])|([A-Z0-9][a-z0-9]+))*([A-Z])?$/.test(question.currentValue))) {
          question.rules.validationMessage = question.egineAttribue + " should be in " + question.rules.textcase;
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }


      }
      if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "2 decimal number") {
        if (!(/^[0-9]*\.[0-9][0-9]$/.test(question.currentValue))) {
          question.rules.validationMessage = question.egineAttribue + " should be in " + question.rules.textcase;
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }
      if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "comma seperate numeric with no space") {
        if (!(/^[0-9]+(,[0-9]+)*$/.test(question.currentValue))) {
          question.rules.validationMessage = question.egineAttribue + " should be in " + question.rules.textcase;
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }

      if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "comma separated no spaces") {
        if ((/^\s{1,}[\,]|[\,]\s{1,}$/.test(question.currentValue))) {
          question.rules.validationMessage = "Entry of a comma separated list with no spaces";
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }

      if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "First letter Caps, No special characters allowed and max of 60 characters") {
        if (!(/^[A-Z][A-Za-z0-9\s]*$/.test(question.currentValue))) {
          question.rules.validationMessage = question.egineAttribue + " should be in " + question.rules.textcase;
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }
      if (question.egineAttribue == 'Non Standard True Up Term') {
        if (!(/^0*([2-6])$/.test(question.currentValue))) {
          question.rules.validationMessage = "Value should be a numeric range (ex. 2-6)";
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }
      if (question.egineAttribue == 'Initial Term') {
        if (!(/^(0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120))(,(0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120)))*$/.test(question.currentValue))) {
          question.rules.validationMessage = "Comma separated numeric range with no spaces (example: 1,12) where 1 is min and 120 is max";
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }
      if (question.egineAttribue == 'NON STD INITIAL TERM') {
        if (!(/^(0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120))(-(0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120)))$/.test(question.currentValue))) {
          question.rules.validationMessage = "Value should be a numeric range where 1 is min and 120 is max (example: 1-12)";
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }
      if (question.egineAttribue == 'STD AUTO RENEWAL TERM') {
        if (!(/^0*([1-9]|[1-5][0-9]|60)$/.test(question.currentValue))) {
          question.rules.validationMessage = "Mandatory entry of 1 numeric  value where 1 is min and 60 is max";
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }
      if (question.egineAttribue == 'NON STD AUTO RENEWAL TERM') {
        if (!(/^(0*([1-9]|1[0-2]))(-(0*([1-9]|1[0-2])))$/.test(question.currentValue))) {
          question.rules.validationMessage = question.egineAttribue + "Value should be a numeric range where 1 is min and 12 is max";
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }
      if (question.egineAttribue == 'Subscription Offset(In Days)') {
        if (!(/^0*([1-9]|[1-5][0-9]|60)$/.test(question.currentValue))) {
          question.rules.validationMessage = "Mandatory entry of 1 numeric value between 1 and 60";
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }
      if (question.egineAttribue == 'Non Standard True Up Term') {
        if (!(/^(0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120))(-(0*([1-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|120)))$/.test(question.currentValue))) {
          question.rules.validationMessage = "Value should be a numeric range (ex. 2-6)";
          question.rules.isvalid = false;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
        }
      }
    } else {
      this.itemNameInvalid = true;

      this.offerConstructCanvasService.validatePID(question.currentValue).subscribe((data) => {
        if (question.rules.isMandatoryOptional == "Mandatory" && question.currentValue == '') {
          question.rules.validationMessage = "Item Name is Mandatory";
          question.rules.isvalid = false;
          this.itemNameInvalid = true;
          return;
        }
        else if (!(/^[^\/\.\+\-\@\&\#\%\$\!\*\<\>\:\;\,\\\'\[\]\|\?\^\{\}\=\<\>a-z][^\@\&\#\%\$\!\*\<\>\:\;\,\\\'\[\]\|\?\^\{\}\=\<\>a-z]*$/.test(question.currentValue))) {
          question.rules.validationMessage = "All caps required and maximum of 18 characters";
          question.rules.isvalid = false;
          this.itemNameInvalid = true;
          return;
        }
        else if (question.currentValue.length > 18) {
          question.rules.validationMessage = "Max length";
          question.rules.isvalid = false;
          this.itemNameInvalid = true;
          return;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
          this.itemNameInvalid = false;
        }
        if (data.length > 0) {
          question.rules.validationMessage = "Item Name already exists, please type another name";
          question.rules.isvalid = false;
          this.itemNameInvalid = true;
          return;
        }
        else {
          question.rules.validationMessage = "";
          question.rules.isvalid = true;
          this.itemNameInvalid = false;
        }

      });

    }

  }
  downloadZip() {
    this.clkDownloadZip.emit()
  }
  trimSpaces(obj, $event) {
    obj.currentValue = $event.target.value.trim();
  }
}
