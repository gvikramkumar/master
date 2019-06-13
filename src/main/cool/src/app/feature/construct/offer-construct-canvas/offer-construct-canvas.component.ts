import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { TreeNode } from 'primeng/api';

import { ActivatedRoute } from '@angular/router';
import { Groups } from '@app/models/groups';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { OfferConstructService } from '@app/services/offer-construct.service';
import { Subscription } from 'rxjs';
import { OfferDetailViewService } from '@app/services/offer-detail-view.service';
import * as _ from 'lodash';
import { MessageService } from '@app/services/message.service';
import { ConfigurationService } from '@app/core/services';
import { LoaderService } from '@app/core/services/loader.service';
import { OfferConstructDefaultValue } from './service/offer-construct-defaultvalue-services';
import { ConstructDetails } from './model/ConstructDetails';
import { ConstructDetail } from './model/ConstructDetail';
import { OfferconstructCanvasService } from './service/offerconstruct-canvas.service';

@Component({
  selector: 'app-offerconstruct-canvas',
  templateUrl: './offer-construct-canvas.component.html',
  styleUrls: ['./offer-construct-canvas.component.css'],
  providers: [OfferConstructService]
})
export class OfferconstructCanvasComponent implements OnInit, OnDestroy {
  public ind = 0;
  questionForm: FormGroup;
  currentOfferId;
  caseId;
  availableItems: any[] = [];
  cols: any[];
  draggedItem: any;
  offerConstructItems: TreeNode[] = [];
  private counter: any = 0;
  itemCategories = [];
  selected: TreeNode[];
  searchInput: any;
  results;
  initalRowAdded: Boolean = true;
  readOnly: Boolean = false;
  expandView = true;
  editData: any;
  showButtons: any = false;
  private uniqueId;
  varibableToBind;
  displayAddDetails: Boolean = false;
  addDetails;
  productName;
  @Input() questions: any[] = [];
  @Input() markCompleteStatus;
  @Output() getCanMarkCompleteStatus = new EventEmitter<boolean>();
  payLoad = '';
  itemCount;
  nodeToDelete;
  autoFocus;
  selectedItems;
  showMandatoryDetails: Boolean = false;
  currentRowClicked;
  selectedPids;
  lineItemName;
  multipleForms: FormGroup;
  display = false;
  majorLineItemsActive = true;
  minorLineItemsActive;
  majorItemData: any[] = [];
  minorItemData: any[] = [];
  number;
  majorItemsGroup;
  majorLineGroup: any[] = [];
  formGroupData = [];
  mandatoryFields = [];
  formGroupDataMinorItems = [];
  count = 1;
  displayMandatory;
  toggleMandatory = true;
  myForm: FormGroup;
  countableItems: Number[] = [];
  private map1 = new Map();
  popHeadName;
  setFlag = true;
  downloadEnable = false;
  addedEgineMajorItemsInTree: any[] = [];
  displayViewDetails: Boolean = false;
  viewDetails;
  eGinieSearchForm: FormGroup;
  itemsList;
  copyAttributeResults;
  setTitle;
  setSearchItem;
  subscription: Subscription;
  public chargeTypeValue: any;
  public licenseDelivery: any;
  public beListType: any;
  public pakEligibility: any;
  public createSpare: any;
  multiSelectItems: string[] = ['Route-to-Market',
    'Price List Availability',
    'GPL Publication',
    'BILLING MODEL'];

  // changes for view add details
  public questionList: any;
  public questionsList: any = {};
  public QuestionsNodeInfo: any = {};
  public majorAndMinorInfo: any;
  public uniqueNodeId: any;
  public isMajorMinorGroupCreated = false;
  public isDisabledView = true;
  listOfferQuestions: any;
  public isShow = false;
  public showLoader = false;
  private buttonId;
  private isMinorDragDrop: boolean = false;
  private billing_soa = "Billing SOA SKU";
  private counterList: any = [];

  showMajorItemFoundDialog: Boolean;

  constructor(
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private offerConstructCanvasService: OfferconstructCanvasService,
    private offerConstructService: OfferConstructService,
    private configurationService: ConfigurationService,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private offerDetailViewService: OfferDetailViewService,
    private loaderService: LoaderService,
    private defaultValueServices: OfferConstructDefaultValue) {

    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
    });
    this.myForm = this._fb.group({
      // you can also set initial formgroup inside if you like
      companies: this._fb.array([])
    });

    this.showMajorItemFoundDialog = false;

  }


  //
  onValidateChars(event) {
    event.target.value = event.target.value.replace(event.target.value, event.target.value.toUpperCase());
    if ((event.target.value.charAt(0) == '!' || event.target.value.charAt(0) == '+' || event.target.value.charAt(0) == '=' || event.target.value.charAt(0) == '>'
      || event.target.value.charAt(0) == '<' || event.target.value.charAt(0) == '#' || event.target.value.charAt(0) == '/' || event.target.value.charAt(0) == '.'
      || event.target.value.charAt(0) == '-' || event.target.value.charAt(0) == '[' || event.target.value.charAt(0) == ']'
    ) || event.target.value.charAt(0) === " ") {
      event.target.value = event.target.value.replace(event.target.value.charAt(0), '');
    }
    event.target.value = event.target.value.replace(/[&\\\#,$%!@^':;'*?|<>{}=]/g, '');
    event.target.value = event.target.value.replace(/\[.*?\]/g, "");

  }


  // create a json skelaton for major and minor group

  createMajorMinorGroup() {

    // major group
    this.offerConstructService.singleMultipleFormInfo['major'] = [];
    this.majorAndMinorInfo['major'].forEach(element => {
      this.offerConstructService.singleMultipleFormInfo['major'].push({
        [element]: { 'questionset': [], 'productInfo': [] }
      });
    });

    // minor group
    this.offerConstructService.singleMultipleFormInfo['minor'] = [];
    this.majorAndMinorInfo['minor'].forEach(element => {
      this.offerConstructService.singleMultipleFormInfo['minor'].push({
        [element]: { 'questionset': [], 'productInfo': [] }
      });

      this.isMajorMinorGroupCreated = true;

    });
  }

  /**
   * Called when Item is dragged into Offer Components Tree table
   * When major line item is dragged from left to right
   * @param $event
   */
  dropItem() {

    this.dropItemImpl().then(() => this.checkCanMarkCompleteStatus());
  }

  dropItemImpl() {

    this.initalRowAdded = false;
    if (this.draggedItem['isMajorLineItem']) {
      this.loaderService.startLoading();
      const obj = Object.create(null);
      obj['uniqueKey'] = ++this.counter;
      this.uniqueId = obj['uniqueKey'];
      obj['productName'] = this.draggedItem.productName;
      obj['isGroupNode'] = false;
      obj['label'] = this.draggedItem.label;
      obj['title'] = this.draggedItem.productName;
      obj['isMajorLineItem'] = this.draggedItem.isMajorLineItem;
      obj['childCount'] = 0;
      const data = this.map1.get(this.draggedItem.productName);

      if (data == undefined) {
        this.map1.set(this.draggedItem.productName, 1);
      } else {
        this.map1.set(this.draggedItem.productName, this.map1.get(this.draggedItem.productName) + 1);
      }

      obj['title'] = this.draggedItem.productName + ' ' + this.map1.get(this.draggedItem.productName);
      obj['uniqueNodeId'] = this.draggedItem.productName + '_' + obj['uniqueKey'];

      // get question set once user drag and drop any product
      const groupName = obj.productName;
      const majorItem = {
        groupName: groupName
      };

      const info = [];
      info.push(majorItem);
      const groupsName = { groups: info };
      // this.getQuestionOnDragDrop(groupsName);  //set listOfOfferquestion to itemDeatils of objects
      this.offerConstructService.addDetails(groupsName).subscribe((data) => {
        this.listOfferQuestions = data.groups[0].listOfferQuestions;

        if (obj.productName !== this.billing_soa) {
          if (obj.productName == 'License') {
            let listOfferQuestions = this.defaultValueServices.LicenseDefault(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }
          else {
            let listOfferQuestions = this.defaultValueServices.LicenseDefaultOptional(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }
          if (obj.productName == 'Billing') {
            let listOfferQuestions = this.defaultValueServices.setTermsNPayments(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }
          else {
            let listOfferQuestions = this.defaultValueServices.setTermsNPaymentsN(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }
          if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'XaaS' || obj.productName == 'Billing') {
            let listOfferQuestions = this.defaultValueServices.getLicenseDeliveryTypeDefaultValues(this.listOfferQuestions, this.licenseDelivery);
            obj['itemDetails'] = listOfferQuestions;
          }
          else {
            let listOfferQuestions = this.defaultValueServices.getLicenseDeliveryTypeDefaultValuesN(this.listOfferQuestions, this.licenseDelivery);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'XaaS' || obj.productName == 'Billing') {
            let listOfferQuestions = this.defaultValueServices.getChargeTypeValidationValues(this.listOfferQuestions, this.chargeTypeValue);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'XaaS') {
            let listOfferQuestions = this.defaultValueServices.ImageSigningForXaas(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }
          else if (obj.productName == 'Hardware') {
            let listOfferQuestions = this.defaultValueServices.ImageSigningForHardware(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }
          else {
            let listOfferQuestions = this.defaultValueServices.ImageSigningForHardwareDefault(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'XaaS' || obj.productName == 'Billing') {
            let listOfferQuestions = this.defaultValueServices.nonSoaSkuDefaults(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'XaaS'
          || obj.productName == 'Billing' || obj.productName == 'SW Subscription Mapped SKU') {
            let listOfferQuestions = this.defaultValueServices.getChargeTypeValidationValues(this.listOfferQuestions, this.chargeTypeValue);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'Billing') {
            let listOfferQuestions = this.defaultValueServices.getProductQuantityDeliveryPreferenceValues(this.listOfferQuestions, this.pakEligibility);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'XaaS') {
            let listOfferQuestions = this.defaultValueServices.ImageSigningForXaas(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }
          else if (obj.productName == 'Hardware') {
            let listOfferQuestions = this.defaultValueServices.ImageSigningForHardware(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }
          else {
            let listOfferQuestions = this.defaultValueServices.ImageSigningForHardwareDefault(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'License') {
            let listOfferQuestions = this.defaultValueServices.setSoftwareLicense(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }
          else {
            let listOfferQuestions = this.defaultValueServices.setSoftwareLicenseDefault(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'XaaS'
          || obj.productName == 'Billing' || obj.productName == 'SW Subscription Mapped SKU') {
            let listOfferQuestions = this.defaultValueServices.setCreateDefault(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'Billing') {
            let listOfferQuestions = this.defaultValueServices.setAdjustable(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'XaaS' || obj.productName == 'Billing') {
            let listOfferQuestions = this.defaultValueServices.setTaxCategory(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }

          ///ADd Non IOS
          if (obj.productName == 'License') {
              let listOfferQuestions = this.defaultValueServices.setSoftwareLicenseNSKU(this.listOfferQuestions);
              obj['itemDetails'] = listOfferQuestions;
          }
          else{
              let listOfferQuestions = this.defaultValueServices.setSoftwareLicenseNSKUDefault(this.listOfferQuestions);
              obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'License' || obj.productName == 'Hardware'){
            let listOfferQuestions = this.defaultValueServices.getSpareTypeValues(this.listOfferQuestions, this.createSpare);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'Hardware'){
            let listOfferQuestions = this.defaultValueServices.setConditionalAccessDefault(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'Hardware'){
            let listOfferQuestions = this.defaultValueServices.setEnablementFileTypeDefault(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'XaaS'){
            let listOfferQuestions = this.defaultValueServices.setItemTypeXassDefault(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }

          if (obj.productName == 'Billing'){
            let listOfferQuestions = this.defaultValueServices.setItemTypeBillingDefault(this.listOfferQuestions);
            obj['itemDetails'] = listOfferQuestions;
          }
          // if (obj.productName == 'License') {
          //     let listOfferQuestions = this.defaultValueServices.setSoftwareLicenseNSKU(this.listOfferQuestions);
          //     obj['itemDetails'] = listOfferQuestions;
          // }
          // else{
          //     let listOfferQuestions = this.defaultValueServices.setSoftwareLicenseNSKUDefault(this.listOfferQuestions);
          //     obj['itemDetails'] = listOfferQuestions;
          // }

          obj['itemDetails'] = this.listOfferQuestions;
        } else {
          let listOfferQuestions = this.defaultValueServices.billingSOADefaultValue(this.listOfferQuestions, this.chargeTypeValue, this.beListType);
          obj['itemDetails'] = listOfferQuestions;
        }
        this.offerConstructItems.push(this.itemToTreeNode(obj));
        this.offerConstructItems = [...this.offerConstructItems];
        this.countableItems.push(this.uniqueId);
        this.updateChildCount();
        this.getQuestionList(obj);
      }, (err) => {
        console.log('error' + err);
        this.loaderService.stopLoading();
      },
        () => {
        });
    }
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Async Work Complete");
        resolve();
      }, 1000);
    });
    return promise;
  }

  getQuestionOnDragDrop(groupsName) {
    this.offerConstructService.addDetails(groupsName).subscribe((data) => {
      return data.groups[0].listOfferQuestions;
    }, () => { },
      () => {
      });
  }

  getQuestionList(obj, isQuestionPresent?) {
    const group_name = obj.productName;
    const majorItem = {
      groupName: group_name
    };

    const test = [];
    test.push(majorItem);
    // this.offerConstructService.addDetails(groupsName).subscribe((data) => {
    const groupName = obj.uniqueNodeId;
    // let groupName = obj.uniqueKey;

    // set product title to 'Item Name (PID)'. this is not coming from server
    if (this.listOfferQuestions != undefined) {
      this.listOfferQuestions.forEach(ques => {
        if (ques.egineAttribue == 'Item Name (PID)') {
          ques.currentValue = obj.title;
          ques.previousValue = obj.title;
        }
      });
    }


    let listOfferQuestions;
    if (isQuestionPresent == undefined) {
      // for newly drag and drop
      listOfferQuestions = this.listOfferQuestions;
    } else {
      // for previous save value
      listOfferQuestions = obj.itemDetails;
    }

    const groupinfo = {
      uniqueKey: obj.uniqueKey,
      title: obj.title,
      uniqueNodeId: obj.uniqueNodeId,
      childCount: obj.childCount,
      isMajor: obj.isMajorLineItem,
      isGroupNode: obj.isGroupNode,
      groupName: obj.productName,
      eGenieFlag: false,
      listOfferQuestions: listOfferQuestions,
      newItemEGenieStatus: obj.newItemEGenieStatus
    };

    const setinfo = { [groupName]: groupinfo };
    this.setProductInfo(obj.productName, obj.isMajorLineItem, setinfo, listOfferQuestions);
    // });
  }

  setProductInfo(groupName, groupType, groupInfo, questionSet) {

    if (groupType) {      // for major group
      this.offerConstructService.singleMultipleFormInfo['major'].forEach((element, index) => {
        if (Object.keys(element) == groupName) {
          this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['questionset'] = [];
          this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['questionset'] = questionSet;
          this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].push(groupInfo);
        }
      });
    } else {
      this.offerConstructService.singleMultipleFormInfo['minor'].forEach((element, index) => {
        if (Object.keys(element) == groupName) {
          this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['questionset'] = [];
          this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['questionset'] = questionSet;
          this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].push(groupInfo);
        }
      });
    }
    this.isDisabledView = false;
    this.loaderService.stopLoading();
  }

  submitClickEvent() {
    this.offerConstructService.submitClickEvent.emit();
  }

  closeDialog() {
    this.offerConstructService.closeAction('close');
  }

  closeAddALLDialog() {
    this.offerConstructService.closeAction('close');
  }

  addItms() {
    let itemsData: any;
    if (this.showLoader) {
      this.loaderService.startLoading();
      if (this.itemsList != null) {
        this.offerConstructCanvasService.getPidDetails(this.itemsList.PID).subscribe(items => {
          this.loaderService.stopLoading();
          this.showLoader = false;
          itemsData = items.body;
          // this.questionForm.patchValue(itemsData);
          this.cd.detectChanges();
        }, (err) => {
          this.loaderService.stopLoading();
          this.showLoader = false;
        }, () => {
          this.singleFormCopy(itemsData);
          this.loaderService.stopLoading();
          this.showLoader = false;
        });
        this.setSearchItem.node.data.searchItemRef = this.itemsList;
        this.offerConstructItems = [...this.offerConstructItems];
        this.cd.detectChanges();
      }
    }
  }

  // search copy attributes

  singleFormCopy(itemsData) {

    const title = this.uniqueNodeId;
    if (this.lineItemName === itemsData['Item Category']) {
      for (const searchValue in itemsData) {

        this.questionsList[title].forEach(element => {

          if (searchValue === element.question) {
            element.currentValue = itemsData[searchValue];
          }

        });
      }
    }
  }

  searchCopyAttributes(event) {
    const searchString = event.query.toUpperCase();
    this.offerConstructCanvasService.searchEgenie(searchString).subscribe((results) => {
      this.copyAttributeResults = [...results];
      this.showLoader = true;
    },
      () => {
        this.results = [];
      }
    );
  }

  majorLine() {
    this.minorLineItemsActive = false;
    this.majorLineItemsActive = true;
  }

  minorLine() {
    this.majorLineItemsActive = false;
    this.minorLineItemsActive = true;
  }

  showMandatory(event) {
    this.toggleMandatory = this.toggleMandatory ? false : true;
    this.displayMandatory = event.target.id;
    this.cd.detectChanges();
  }

  showDialog() {
    this.ind--;
    const offerInfo = this.offerConstructService.singleMultipleFormInfo;
    const majorOfferInfo = offerInfo.major;
    const minorOfferInfo = offerInfo.minor;

    const majorLength = {};
    const minorLength = {};
    majorOfferInfo.forEach((element) => {
      const name: any = Object.keys(element);
      majorLength[name] = false;
      if ((element[name].productInfo).length > 0) {
        majorLength[name] = true;
      }
    });
    minorOfferInfo.forEach(element => {
      const name: any = Object.keys(element);
      minorLength[name] = false;
      if ((element[name].productInfo).length > 0) {
        minorLength[name] = true;
      }
    });

    this.offerConstructService.itemlengthList = { major: majorLength, minor: minorLength };
    this.display = true;
    this.offerConstructService.closeAddDetails = true;
  }

  // remove node from offerConstructService.singleMultipleFormInfo

  deleteNode(rowNode) {
    //if (this.markCompleteStatus === false) {
      if (rowNode.parent == null) {
        // If parent not present which means its a Major Item and may contains children.
        // Therefore we have to remove complete element from offer array where uniquekey = rowData.uniqueKey
        this.offerConstructItems.forEach((element) => {
          if (element.data.uniqueKey == rowNode.node.data.uniqueKey) {
            this.deleteItemToNode(element.data.uniqueKey, element.data.isMajorLineItem);
            element.children.forEach((childElement) => {
              console.log("childElement", childElement);
              if (childElement.data.isGroupNode) {
                childElement.children.forEach((child) => {
                  this.deleteItemToNode(child.data.uniqueKey, child.data.isMajorLineItem);
                })
              }
              if (!childElement.data.isGroupNode) {
                this.deleteItemToNode(childElement.data.uniqueKey, childElement.data.isMajorLineItem);
              }
            });
          }
        });
      } else {
        console.log("element");
        this.offerConstructItems.forEach((element) => {
          console.log(element);

          if (element.data.uniqueKey == rowNode.parent.data.uniqueKey) {
            // Loop through of all childrens of matched Parent data from Offer array
            element.children.forEach((childElement) => {
              if (childElement.data.isGroupNode) {
                childElement.children.forEach((child) => {
                  this.deleteItemToNode(child.data.uniqueKey, child.data.isMajorLineItem);
                })
              } else {
                if (childElement.data.uniqueKey == rowNode.node.data.uniqueKey) {
                  this.checkNodeUniqueKeyAndPatchQuestion(rowNode, false);
                  // Removed the child element from Parent Array of Offer construct Array
                }
              }
            });
          }
        });
        // Check if parent is a group Node.
        if (rowNode.parent.data.isGroupNode) {
          console.log("isGroupNode", rowNode.parent.data.isGroupNode);

          this.offerConstructItems.forEach((element) => {
            element.children.forEach((childElement) => {
              // if (childElement.data.uniqueKey == rowNode.parent.data.uniqueKey) {
              // Removed the child element from Parent Array of Offer construct Array
              childElement.children.forEach((innerChildElement) => {
                if (innerChildElement.data.uniqueKey == rowNode.node.data.uniqueKey) {
                  this.checkNodeUniqueKeyAndPatchQuestion(rowNode, false);
                  // Removed the child element from Parent Array of Offer construct Array
                }
              });
              // }
            });
          });
        }
      }
      this.deleteNodeFromOfferConstructItems(rowNode);  // remove node from offerconstruct Item
      this.checkCanMarkCompleteStatus();
  //}

  }

  /* METHOD: deleteNode
      PARAMS: Selected row node to identify the Parent and their children.
      PURPOSE: Use to delete the parent Node as well as Child node in case of grouped Offer Category.
      CREATED ON: 23 Feb 2019
    */

  deleteNodeFromOfferConstructItems(rowNode) {
    //if (this.markCompleteStatus === false) {
      if (rowNode.parent == null) {
        // If parent not present which means its a Major Item and may contains children.
        // Therefore we have to remove complete element from offer array where uniquekey = rowData.uniqueKey
        this.offerConstructItems.forEach((element, index) => {
          if (element.data.uniqueKey == rowNode.node.data.uniqueKey) {
            this.offerConstructItems.splice(index, 1);
          }
        });
      } else {
        // Means Remove event occurs on child elements of any parent.
        // Here we will loop through all offer array and find parent index key then
        // Another loop of children & find d we have to remove only that children whose uniquekey = rowData.uniqueKey
        // Loop through All available offers construct items array
        this.offerConstructItems.forEach((element) => {
          if (element.data.uniqueKey == rowNode.parent.data.uniqueKey) {
            // Loop through of all childrens of matched Parent data from Offer array
            element.children.forEach((childElement, childIndex) => {
              if (childElement.data.uniqueKey == rowNode.node.data.uniqueKey) {
                element.children.splice(childIndex, 1);
                // Removed the child element from Parent Array of Offer construct Array
              }
            });
          }
        });
        // Check if parent is a group Node.
        if (rowNode.parent.data.isGroupNode) {
          this.offerConstructItems.forEach((element) => {
            element.children.forEach((childElement) => {
              if (childElement.data.uniqueKey == rowNode.parent.data.uniqueKey) {
                // Removed the child element from Parent Array of Offer construct Array
                childElement.children.forEach((innerChildElement, innerChildIndex) => {
                  if (innerChildElement.data.uniqueKey == rowNode.node.data.uniqueKey) {
                    childElement.children.splice(innerChildIndex, 1);
                    // Removed the child element from Parent Array of Offer construct Array
                  }
                });
              }
            });
          });
        }
      }
      this.offerConstructItems = [...this.offerConstructItems];
      this.removeEginieMajorItemFromListofAlreadyAddedItems(rowNode.node.data.title);
      this.updateChildCount();
    //}

  }

  enableEdit() {
    this.editData = false;
    this.showButtons = true;
    this.cd.detectChanges();
  }

  disableButtons() {
    this.showButtons = false;
    this.cd.detectChanges();
    this.offerConstructItems = [...this.offerConstructItems];
  }

  saveData(rowNode) {
    if (rowNode.node.data.name) {
      rowNode.node.data.catergoryName = rowNode.node.data.name;
      rowNode.node.data.label = rowNode.node.data.name;
      rowNode.node.data.title = rowNode.node.data.name;
      // rowNode.node.data.productName = rowNode.node.data.name;
      // this.offerConstructItems.push(this.itemToTreeNode(rowNode));
      this.offerConstructItems = [...this.offerConstructItems];

      // change label and header name in global variable
      console.log(rowNode);

      this.changelabel(rowNode.node.data.uniqueKey, rowNode.node.data.isMajorLineItem, rowNode.node.data.name);


      this.cd.detectChanges();
    }

    if (rowNode.node.data['itemDetails']) {
      rowNode.node.data['itemDetails']['Item Name (PID)'] = rowNode.node.data.title;
    }

    this.showButtons = false;
    this.offerConstructItems = [...this.offerConstructItems];
  }


  handleChange(obj, $event) {
    const newValue = $event.target.value;
    obj.name = newValue;
  }

  trimSpaces = function (obj, $event) {
    obj.name = $event.target.value.trim();
  }
  // change name of product
  changelabel(uniqueKey, isMajorLineItem, name) {
    let groupType;
    if (isMajorLineItem) {
      groupType = 'major';
    } else {
      groupType = 'minor';
    }
    this.offerConstructService.singleMultipleFormInfo[groupType].forEach((list, index) => {
      const groupName: any = Object.keys(list);
      this.offerConstructService.singleMultipleFormInfo[groupType][index][groupName]['productInfo'].forEach((element) => {
        const productname: any = Object.keys(element);
        if (element[productname].uniqueKey == uniqueKey) {
          element[productname].title = name;
          // change name in Item Name (PID)  as per requirement
          element[productname].listOfferQuestions.forEach(ques => {
            if (ques.question == 'Item Name (PID)') {
              ques.currentValue = name;
              ques.previousValue = name;
            }
          });
        }
      });
    });
  }

  /**
   *
   * @param item Convert an Item into TreeNode
   */
  private itemToTreeNode(item): TreeNode {
    return {
      label: item.categoryName,
      data: item,
      draggable: true,
      expanded: true,
      children: []
    };
  }

  /**
   * Called when a row in the table is dragged on to another row in the table.
   * @param $event
   * @param rowNode
   * @param rowData
   */
  dropOnRow(rowNode) {
    if (this.draggedItem.parent) {
      if (this.draggedItem.parent.children) {
        this.itemCount = this.draggedItem.parent.children.length;
      }
    }
    if (this.draggedItem.parent === null) {
      this.offerConstructItems = [...this.offerConstructItems];
    } else {
      if (
        rowNode.node.data['isMajorLineItem'] &&
        !this.draggedItem['isMajorLineItem']
      ) {
        this.loaderService.startLoading();
        if (this.draggedItem.data) {
          if (this.draggedItem.data.isGroupNode && this.draggedItem.children.length > 0) {
            const obj = Object.create(null);
            obj['uniqueKey'] = this.draggedItem.data.uniqueKey;
            this.uniqueId = obj['uniqueKey'];
            obj['isGroupNode'] = true;
            obj['productName'] = this.draggedItem.data.productName;
            obj['label'] = this.draggedItem.data.label;
            obj['isMajorLineItem'] = this.draggedItem.data.isMajorLineItem;
            obj['listPrice'] = this.draggedItem.data.listPrice;
            obj['title'] = this.draggedItem.data.title ? this.draggedItem.data.title : this.draggedItem.data.productName;
            rowNode.node.children.push(this.itemToTreeNode(obj));
            this.setFlag = false;
            this.offerConstructItems = [...this.offerConstructItems];
            this.draggedItem.children.forEach(element1 => {
              rowNode.node.children.forEach(element => {
                if (element.data.uniqueKey === obj.uniqueKey && element.data.isGroupNode) {
                  const obj1 = Object.create(null);
                  obj1['uniqueKey'] = element1.data.uniqueKey;
                  this.uniqueId = obj['uniqueKey'];
                  obj1['isGroupNode'] = false;
                  obj1['productName'] = element1.data.productName;
                  obj1['label'] = element1.data.label;
                  obj1['isMajorLineItem'] = element1.data.isMajorLineItem;
                  obj1['listPrice'] = element1.data.listPrice;
                  obj1['title'] = element1.data.title ? element1.data.title : element1.data.productName;
                  if (element1.data['eginieItem']) {
                    obj1['eginieItem'] = element1.data['eginieItem'];
                  }
                  obj1['itemDetails'] = element1.data['itemDetails'];
                  element.children.push(this.itemToTreeNode(obj1));
                  // Dragging Billing SOA from major to major
                  if (element1.data.productName == this.billing_soa) {
                    this.setSameAsMajorLine(rowNode, element1.data['itemDetails']);
                  }
                  this.offerConstructItems = [...this.offerConstructItems];
                }
              });
            });
            this.delteFromParentObject();
            this.offerConstructItems = [...this.offerConstructItems];
            this.loaderService.stopLoading();
          }
          this.loaderService.stopLoading();
        }
        if (this.draggedItem.parent !== undefined) {
          if (this.setFlag) {
            // If dragged node is a tree node,meaning the node which is moved between the canvas
            const obj = Object.create(null);
            // obj['uniqueKey'] = ++this.counter;
            obj['uniqueKey'] = this.draggedItem.data.uniqueKey;
            this.uniqueId = obj['uniqueKey'];
            if (this.draggedItem.data) {
              if (this.draggedItem.data.isGroupNode) {
                obj['isGroupNode'] = true;
              }
            } else {
              obj['isGroupNode'] = false;
            }
            obj['productName'] = this.draggedItem.data.productName;
            obj['label'] = this.draggedItem.data.label;
            obj['isMajorLineItem'] = this.draggedItem.data.isMajorLineItem;
            obj['listPrice'] = this.draggedItem.data.listPrice;
            obj['title'] = this.draggedItem.data.title ? this.draggedItem.data.title : this.draggedItem.data.productName;
            if (this.draggedItem.data['eginieItem']) {
              obj['eginieItem'] = this.draggedItem.data['eginieItem'];
            }
            obj['itemDetails'] = this.draggedItem.data['itemDetails'];
            obj['uniqueNodeId'] = this.draggedItem.uniqueNodeId;
            rowNode.node.children.push(this.itemToTreeNode(obj));
            // Dragging Billing SOA from major to major
            if (this.draggedItem.data.productName == this.billing_soa) {
              this.setSameAsMajorLine(rowNode, this.draggedItem.data['itemDetails']);
            }
            this.delteFromParentObject();
            this.loaderService.stopLoading();
          }
          this.setFlag = true;
        } else {
          // If dragged node is not an actual tree node
          this.isMinorDragDrop = true;
          const obj = Object.create(null);
          obj['uniqueKey'] = ++this.counter;
          this.uniqueId = obj['uniqueKey'];
          obj['isGroupNode'] = false;
          obj['productName'] = this.draggedItem.productName;
          obj['label'] = this.draggedItem.label;
          obj['isMajorLineItem'] = this.draggedItem.isMajorLineItem;
          obj['listPrice'] = this.draggedItem.listPrice;
          obj['title'] = this.draggedItem.productName;
          const data = this.map1.get(this.draggedItem.productName);
          if (data == undefined) {
            this.map1.set(this.draggedItem.productName, 1);
          } else {
            this.map1.set(this.draggedItem.productName, this.map1.get(this.draggedItem.productName) + 1);
          }
          obj['title'] = this.draggedItem.productName + ' ' + this.map1.get(this.draggedItem.productName);

          obj['uniqueNodeId'] = this.draggedItem.productName + '_' + obj['uniqueKey'];

          const groupName = obj.productName;
          const majorItem = {
            groupName: groupName
          };
          const test = [];
          test.push(majorItem);
          const groupsName = { groups: test };
          // obj['itemDetails'] = this.getQuestionOnDragDrop(groupsName);
          this.offerConstructService.addDetails(groupsName).subscribe((data) => {
            this.listOfferQuestions = data.groups[0].listOfferQuestions;
            if (obj.productName !== this.billing_soa) {
              if (obj.productName == 'License') {
                let listOfferQuestions = this.defaultValueServices.LicenseDefault(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }
              else {
                let listOfferQuestions = this.defaultValueServices.LicenseDefaultOptional(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }
              if (obj.productName == 'Billing') {
                let listOfferQuestions = this.defaultValueServices.setTermsNPayments(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }
              else {
                let listOfferQuestions = this.defaultValueServices.setTermsNPaymentsN(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }
              if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'XaaS' || obj.productName == 'Billing') {
                let listOfferQuestions = this.defaultValueServices.getLicenseDeliveryTypeDefaultValues(this.listOfferQuestions, this.licenseDelivery);
                obj['itemDetails'] = listOfferQuestions;
              }
              else {
                let listOfferQuestions = this.defaultValueServices.getLicenseDeliveryTypeDefaultValuesN(this.listOfferQuestions, this.licenseDelivery);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'XaaS' || obj.productName == 'Billing') {
                let listOfferQuestions = this.defaultValueServices.getChargeTypeValidationValues(this.listOfferQuestions, this.chargeTypeValue);
                obj['itemDetails'] = listOfferQuestions;
              }
              //
              // if (obj.productName == 'License') {
              //     let listOfferQuestions = this.defaultValueServices.setEntitlementTerm(this.listOfferQuestions);
              //     obj['itemDetails'] = listOfferQuestions;
              // }else{
              //     let listOfferQuestions = this.defaultValueServices.setEntitlementTermN(this.listOfferQuestions);
              //     obj['itemDetails'] = listOfferQuestions;
              // }

              if (obj.productName == 'XaaS') {
                let listOfferQuestions = this.defaultValueServices.ImageSigningForXaas(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }
              else if (obj.productName == 'Hardware') {
                let listOfferQuestions = this.defaultValueServices.ImageSigningForHardware(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }
              else {
                let listOfferQuestions = this.defaultValueServices.ImageSigningForHardwareDefault(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'XaaS' || obj.productName == 'Billing') {
                let listOfferQuestions = this.defaultValueServices.getChargeTypeValidationValues(this.listOfferQuestions, this.chargeTypeValue);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'Billing') {
                let listOfferQuestions = this.defaultValueServices.getProductQuantityDeliveryPreferenceValues(this.listOfferQuestions, this.pakEligibility);
                obj['itemDetails'] = listOfferQuestions;
              }
              //
              // if (obj.productName == 'License') {
              //     let listOfferQuestions = this.defaultValueServices.setEntitlementTerm(this.listOfferQuestions);
              //     obj['itemDetails'] = listOfferQuestions;
              // }else{
              //     let listOfferQuestions = this.defaultValueServices.setEntitlementTermN(this.listOfferQuestions);
              //     obj['itemDetails'] = listOfferQuestions;
              // }

              if (obj.productName == 'XaaS') {
                let listOfferQuestions = this.defaultValueServices.ImageSigningForXaas(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }
              else if (obj.productName == 'Hardware') {
                let listOfferQuestions = this.defaultValueServices.ImageSigningForHardware(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }
              else {
                let listOfferQuestions = this.defaultValueServices.ImageSigningForHardwareDefault(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'License') {
                let listOfferQuestions = this.defaultValueServices.setSoftwareLicense(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }
              else {
                let listOfferQuestions = this.defaultValueServices.setSoftwareLicenseDefault(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'XaaS'
              || obj.productName == 'Billing') {
                let listOfferQuestions = this.defaultValueServices.setCreateDefault(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'Billing') {
                let listOfferQuestions = this.defaultValueServices.setAdjustable(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'XaaS' || obj.productName == 'Billing') {
                let listOfferQuestions = this.defaultValueServices.setTaxCategory(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'License') {
                  let listOfferQuestions = this.defaultValueServices.setSoftwareLicenseNSKU(this.listOfferQuestions);
                  obj['itemDetails'] = listOfferQuestions;
              }
              else{
                  let listOfferQuestions = this.defaultValueServices.setSoftwareLicenseNSKUDefault(this.listOfferQuestions);
                  obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'License' || obj.productName == 'Hardware'){
                let listOfferQuestions = this.defaultValueServices.getSpareTypeValues(this.listOfferQuestions, this.createSpare);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'Hardware'){
                let listOfferQuestions = this.defaultValueServices.setConditionalAccessDefault(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'Hardware'){
                let listOfferQuestions = this.defaultValueServices.setEnablementFileTypeDefault(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'XaaS'){
                let listOfferQuestions = this.defaultValueServices.setItemTypeXassDefault(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }

              if (obj.productName == 'Billing'){
                let listOfferQuestions = this.defaultValueServices.setItemTypeBillingDefault(this.listOfferQuestions);
                obj['itemDetails'] = listOfferQuestions;
              }

              // if (obj.productName == 'License' || obj.productName == 'Hardware' || obj.productName == 'SW Subscription Mapped SKU'){
              //   let listOfferQuestions = this.defaultValueServices.getCountryNameValues(this.listOfferQuestions, this.createSpare);
              //   obj['itemDetails'] = listOfferQuestions;
              // }

              obj['itemDetails'] = this.listOfferQuestions;
            } else {
              let listOfferQuestions = this.defaultValueServices.billingSOADefaultValue(this.listOfferQuestions, this.chargeTypeValue, this.beListType);

              obj['itemDetails'] = this.listOfferQuestions;
            }
            this.setSameAsMajorLine(rowNode, this.listOfferQuestions);
            rowNode.node.children.push(this.itemToTreeNode(obj));
            this.offerConstructItems = [...this.offerConstructItems];
            this.updateChildCount();
            this.getQuestionList(obj);
            this.isDisabledView = false;
            this.isMinorDragDrop = false;
            this.loaderService.stopLoading();
          }, (err) => {
            console.log('error' + err);
            this.loaderService.stopLoading();
          },
            () => {
              // if (obj.productName !== 'Billing SOA' || obj.productName !== 'Billing') {

            });

        }
      }

      if (
        rowNode.node.data['isGroupNode'] &&
        !this.draggedItem['isMajorLineItem']
      ) {
        if (this.draggedItem.data.isGroupNode) {
        } else {
          const obj = Object.create(null);
          // obj['uniqueKey'] = ++this.counter;
          obj['uniqueKey'] = this.draggedItem.data.uniqueKey;
          this.uniqueId = obj['uniqueKey'];
          obj['isGroupNode'] = false;
          obj['productName'] = this.draggedItem.data.productName;
          obj['label'] = this.draggedItem.data.label;
          obj['isMajorLineItem'] = this.draggedItem.data.isMajorLineItem;
          obj['listPrice'] = this.draggedItem.data.listPrice;
          obj['title'] = this.draggedItem.data.title ? this.draggedItem.data.title : this.draggedItem.data.productName;
          if (this.draggedItem.data['eginieItem']) {
            obj['eginieItem'] = this.draggedItem.data['eginieItem'];
          }
          obj['itemDetails'] = this.draggedItem.data['itemDetails'];
          obj['uniqueNodeId'] = this.draggedItem.uniqueNodeId;
          rowNode.node.children.push(this.itemToTreeNode(obj));
          this.delteFromParentObject();
          this.loaderService.stopLoading();
        }
      }

      if (!this.isMinorDragDrop) {
        this.offerConstructItems = [...this.offerConstructItems];
      }
    }
    if (!this.isMinorDragDrop) {
      this.updateChildCount();
      this.isDisabledView = false;  // for enable button
    }
  }

  //same as major line item
  setSameAsMajorLine(rowNode, listOfQuestions) {
    let priceListAvailability = [];
    let gplPublication = [];
    let typeOfQuantity = [];

    if (rowNode.node.data) {
      rowNode.node.data.itemDetails.forEach(element => {
        if (element.question === 'Price List Availability') {
          priceListAvailability = element.listCurrentValue;
        }
        if (element.question === 'GPL Publication') {
          gplPublication = element.listCurrentValue;
        }
        if (element.question === 'Type Of Quantity') {
          typeOfQuantity = element.listCurrentValue;
        }
      });
      listOfQuestions.forEach(billingSoa => {
        if (billingSoa.question === 'Price List Availability') {
          billingSoa.listCurrentValue = priceListAvailability;
          billingSoa.listPreviousValue = priceListAvailability;
        }
        if (billingSoa.question === 'GPL Publication') {
          billingSoa.listCurrentValue = gplPublication;
          billingSoa.listPreviousValue = gplPublication;
        }
        if (billingSoa.question === 'Type Of Quantity') {
          billingSoa.listCurrentValue = typeOfQuantity;
          billingSoa.listPreviousValue = typeOfQuantity;
        }
      });
    }

  }

  /**
   * Delete child object when moving from one row to another
   * @param rowNode
   * @param child
   */
  delteFromParentObject() {
    const tempChildArray = this.draggedItem.parent.children;
    let index = -1;
    for (let i = 0; i < tempChildArray.length; i++) {
      if (
        this.draggedItem.data.uniqueKey === tempChildArray[i].data.uniqueKey
      ) {
        index = i;
        break;
      }
    }
    this.draggedItem.parent.children.splice(index, 1);
    this.updateChildCount();
  }

  /**
   * Create a row under Major Group Node
   * @param rowNode
   */
  createGroup(rowNode) {
    if (rowNode.node.children) {
      this.itemCount = rowNode.node.children.length;
    }

    let countGroup = 1;
    if (rowNode.node.children) {
      rowNode.node.children.forEach(item => {
        if (item.data.isGroupNode === true) {
          countGroup += 1;
        }
      });
    }

    this.showButtons = false;
    const obj = Object.create(null);
    const counter = ++this.counter;
    obj['uniqueKey'] = counter;
    obj['productName'] =
      rowNode.node.data.productName + ' ' + 'Group' + ' ' + countGroup;
    obj['catergoryName'] = rowNode.node.data.productName;
    obj['label'] = rowNode.node.data.productName;
    obj['title'] = rowNode.node.data.productName + ' ' + 'Group' + ' ' + countGroup;
    obj['isGroupNode'] = true;
    rowNode.node.children.push(this.itemToTreeNode(obj));
    this.offerConstructItems = [...this.offerConstructItems];
    this.countableItems.push(counter);
    this.updateChildCount();
  }

  showButton(event, id) {
    this.buttonId = event.target.id;
    this.autoFocus = true;
    this.cd.detectChanges();
  }

  focusMethod(id) {
    document.getElementById(id).focus();
  }


  ngOnInit() {

    this.loaderService.startLoading();
    this.subscription = this.messageService.getMessage()
      .subscribe(() => {
        this.saveOfferConstructChanges();
      },
        (err) => { this.loaderService.stopLoading(); },
        () => { });

    this.eGinieSearchForm = new FormGroup({
      searchPID: new FormControl(null, Validators.required)
    });



    // Check if construct details are availbale in the database for the current offer.
    this.offerConstructService.space.subscribe((val) => {
      this.offerConstructItems.forEach(item => {
        if (item.data.productName == val[0]) {
          item.data['itemDetails'] = val[1];
        }
      });
      this.offerConstructItems.forEach(value => {
        value.children.forEach(itm => {
          if (itm.data.productName == val[0]) {
            itm.data['itemDetails'] = val[1];
          }
        });
      });

      this.offerConstructService.closeDialog.subscribe((val) => {
        if (val == 'close') {
          this.display = false;
        }
      }, () => { this.loaderService.stopLoading(); },
        () => { });

      this.offerConstructItems = [...this.offerConstructItems];

    }, (err) => {
      this.loaderService.stopLoading();
    }, () => {

    });

    this.questionForm = new FormGroup({
    });

    this.multipleForms = new FormGroup({
    });

    //Update my flag if ATO uploaded into EGENIE
    this.offerConstructService.updateNewEgenieFlag(this.currentOfferId).subscribe(response => {
      // Prepare payload to fetch item categories. Obtain MM information.
      this.offerConstructCanvasService.getMMInfo(this.currentOfferId).subscribe((offerDetails) => {

        // Initialize MM ModelICC Request Param Details
        const mmModel = offerDetails.derivedMM;

        // Initialize Offer Types
        const componentsObj = offerDetails['selectedCharacteristics'] == null ? null : offerDetails['selectedCharacteristics'].
          filter(char => char.subgroup === 'Offer Components');
        // const components = componentsObj == null ? null : componentsObj[0]['characteristics'];
        let components = null;
        if (componentsObj.length > 0) {
          components = componentsObj == null ? null : componentsObj[0]['characteristics'] !== undefined ?
            componentsObj[0]['characteristics'] : null;
        } else {
          components = null;
          this.loaderService.stopLoading();
        }

        // Initialize Components
        const offerTypeObj = !offerDetails['solutioningDetails'] ? [] :
          offerDetails['solutioningDetails'].filter(sol => sol.dimensionSubgroup === 'Offer Type');
        const offerType = offerTypeObj && offerTypeObj.length > 0 ? offerTypeObj[0]['dimensionAttribute'] : [];

        // Form ICC Request
        const iccRequest = {
          'mmModel': mmModel,
          'offerType': offerType,
          'components': components
        };

        // Call offerconstruct request to get Major/Minor Line Items
        this.offerConstructCanvasService.retrieveIccDetails(iccRequest).subscribe((iccResponse) => {

          this.majorAndMinorInfo = iccResponse;

          // Extract Major / Minor Category Details
          const minorItems = iccResponse['minor'];
          const majorItems = iccResponse['major'];

          let majorItemsList = [];
          let minorItemsList = [];

          majorItemsList = majorItems.map(function (item) {
            return {
              productName: item,
              categoryName: item,
              isMajorLineItem: true,
              listPrice: ''
            };
          });

          minorItemsList = minorItems.map(function (item) {
            return {
              productName: item,
              categoryName: item,
              isMajorLineItem: false,
              listPrice: ''
            };
          });

          // Populate Item Categories List
          this.itemCategories = majorItemsList.concat(minorItemsList);


        }, (err) => {
          console.log(err);
          this.loaderService.stopLoading();
        },
          () => (this.createMajorMinorGroup(), this.offerDetailView()));

      });
    });

    this.itemCount = 0;

    this.cols = [
      { field: 'productName', header: 'PRODUCTS' },
      { field: 'productFamily', header: 'PRODUCT FAMILY' },
      { field: 'listPrice', header: 'LIST PRICE(USD)' }
    ];

    this.readOnly = this.configurationService.startupData.readOnly;

  }

  offerDetailView() {
    // Check if construct details are availbale in the database for the current offer.
    this.offerDetailViewService.retrieveOfferDetails(this.currentOfferId).subscribe(offerDetailRes => {
      if (offerDetailRes.constructDetails !== null && offerDetailRes.constructDetails.length > 0) {
        this.transformDataToTreeNode(offerDetailRes);
      }
      if (offerDetailRes.solutioningDetails !== null && offerDetailRes.solutioningDetails !== undefined) {
        if (offerDetailRes.solutioningDetails.length > 0) {
          this.getChargeTypeAndPricingType(offerDetailRes.solutioningDetails);
        }
      }
      if (offerDetailRes.primaryBEList !== null && offerDetailRes.primaryBEList !== undefined) {
        if (offerDetailRes.primaryBEList.length > 0) {
          this.getprimaryBEListType(offerDetailRes.primaryBEList);
        }
      }
      if (offerDetailRes.additionalCharacteristics != null || offerDetailRes.additionalCharacteristics != undefined) {
        if (offerDetailRes.additionalCharacteristics.length > 0) {
          this.getLicenseDeliveryType(offerDetailRes.additionalCharacteristics);
        }
      }

      if (offerDetailRes.solutioningDetails !== null && offerDetailRes.solutioningDetails !== undefined) {
        if (offerDetailRes.solutioningDetails.length > 0) {
          this.getPakEligibilityType(offerDetailRes.solutioningDetails);
        }
      }
      if (offerDetailRes.solutioningDetails !== null && offerDetailRes.solutioningDetails !== undefined) {
        if (offerDetailRes.solutioningDetails.length > 0) {
          this.getCreateSpareType(offerDetailRes.solutioningDetails);
        }
      }

      // check if at least one major and one minor item selected, and enable the mark complete button.
      this.checkCanMarkCompleteStatus();
    }, (err) => {
      console.log(err);
      this.loaderService.stopLoading();
    }, () => {
      this.loaderService.stopLoading();
    });
  }

  /**
   * Convert itemdetails array of objets into single object.
   * @param itemDetails
   */
  convertItemDetail(itemDetails): Object {
    const obj = Object.create(null);
    itemDetails.forEach(element => {
      // If attribute is of multiselect , then convert list of array values to
      // array of objects which prime ng p-multiSelect  can understand.
      if (this.multiSelectItems.includes(element.attributeName)) {
        obj[element.attributeName] = this.convertToArrayOfObjects(element.attributeValue);
      } else {
        obj[element.attributeName] = element.attributeValue[0];
      }
    });
    return obj;
  }

  convertToArrayOfObjects(attribValue): any[] {
    const tempArrayObj: any[] = [];
    attribValue.forEach(element => {
      const obj = Object.create(null);
      obj['name'] = element;
      tempArrayObj.push(obj);
    });
    return tempArrayObj;
  }

  // getChargeTypeAndPricingType for billing SOA

  // getChargeTypeAndPricingType for billing SOA

  getChargeTypeAndPricingType(solutioningDetails) {
    solutioningDetails.forEach(element => {
      element.Details.forEach(list => {
        if (list.egenieAttributeName == 'CHARGE TYPE' || list.egenieAttributeName == 'Charge Type') {
          this.chargeTypeValue = list.solutioningAnswer;
        }
      });
    });
  }

  getprimaryBEListType(primaryBEList) {
      this.beListType = primaryBEList[0];
  }

  getLicenseDeliveryType(additionalCharacteristics) {
    additionalCharacteristics.forEach(element => {
      if (element.subgroup == 'License Delivery') {
        this.licenseDelivery = element.characteristics[0];
      }
    });
  }

  getPakEligibilityType(solutioningDetails) {
    solutioningDetails.forEach(element => {
      element.Details.forEach(list => {
        if (list.egenieAttributeName == 'PAK Eligibility' || list.egenieAttributeName == 'PAK Eligibility') {
          this.pakEligibility = list.solutioningAnswer;
        }
      });
    });
  }

  getCreateSpareType(solutioningDetails) {
    solutioningDetails.forEach(element => {
      element.Details.forEach(list => {
        if (list.egenieAttributeName == 'Create Spare?' || list.egenieAttributeName == 'Create Spare?') {
          this.createSpare = list.solutioningAnswer;
        }
      });
    });
  }

  /**
   * Method to add parent node to tree.
   * @param node
   */
  addNode(node): TreeNode {
    const obj = Object.create(null);
    obj['uniqueKey'] = node.constructNodeId;
    this.counter = Number(node.constructNodeId);
    this.counterList.push(this.counter);
    obj['productName'] = node.constructType;
    obj['isGroupNode'] = node.groupNode;
    obj['label'] = node.constructItemName;
    obj['title'] = node.constructItemName;
    obj['isMajorLineItem'] = true;
    // obj['itemDetails'] = this.convertItemDetail(node.itemDetails);
    obj['itemDetails'] = node.itemDetails;
    obj['childCount'] = 0;
    if (node['eGenieFlag']) {
      obj['eginieItem'] = node['eGenieFlag'];
      // obj['itemDetails'] = this.draggedItem.data['itemDetails'];
    }
    obj['newItemEGenieStatus'] = node['newItemEGenieStatus'];
    const tempNode = this.itemToTreeNode(obj);
    this.offerConstructItems.push(tempNode);
    this.offerConstructItems = [...this.offerConstructItems];
    this.countableItems.push(node.constructNodeId);

    if (node.eGenieFlag == false) {
      obj['uniqueNodeId'] = node.constructType + '_' + obj['uniqueKey'];
      this.getQuestionList(obj, true);
    } else {
      console.log(obj);
      this.getSetQuestionAccordingToPID(obj['itemDetails'], node.constructType, obj, true, true);

    }

    return tempNode;
  }

  /**
   * Method to add child Node under parent Node  in Tree.
   * @param parentNode
   * @param childNode
   */
  addChildNode(parentNode, childNode): TreeNode {
    const obj = Object.create(null);
    obj['uniqueKey'] = childNode.constructNodeId;
    this.counter = Number(childNode.constructNodeId);
    this.counterList.push(this.counter);
    obj['productName'] = childNode.constructType;
    obj['isGroupNode'] = childNode.groupNode;
    obj['label'] = childNode.constructItemName;
    obj['title'] = childNode.constructItemName;
    obj['isMajorLineItem'] = false;
    // obj['itemDetails'] = this.convertItemDetail(childNode.itemDetails);
    obj['itemDetails'] = childNode.itemDetails;
    obj['childCount'] = 0;
    if (childNode['eGenieFlag']) {
      obj['eginieItem'] = childNode['eGenieFlag'];
      // obj['itemDetails'] = this.draggedItem.data['itemDetails'];
    }
    obj['newItemEGenieStatus'] = childNode['newItemEGenieStatus'];
    const tempNode = this.itemToTreeNode(obj);
    parentNode.children.push(tempNode);
    this.offerConstructItems = [...this.offerConstructItems];
    this.updateChildCount();

    // set question for respective major or minor section
    if (childNode.eGenieFlag == false) {
      obj['uniqueNodeId'] = childNode.constructType + '_' + obj['uniqueKey'];
      this.getQuestionList(obj, true);
    } else {
      console.log(obj);
      this.getSetQuestionAccordingToPID(obj['itemDetails'], obj['productName'], obj, true, false);
    }

    return tempNode;
  }

  /**
   * Method to transform construct details into tree form.
   */
  transformDataToTreeNode(offerDetailRes: any) {
    this.offerConstructItems = [];
    this.initalRowAdded = false;
    offerDetailRes.constructDetails.forEach(node => {
      // Loop thorugh Major items.
      if (node.constructParentId === '0') {
        const parentNode = this.addNode(node);
        offerDetailRes.constructDetails.forEach(innerNode => {
          // Add a child node to parent.
          if (innerNode.constructParentId === node.constructNodeId) {
            const inChild = this.addChildNode(parentNode, innerNode);
            // If group Node , need to add respective children nodes under it.
            if (innerNode.groupNode) {
              offerDetailRes.constructDetails.forEach(gChildNode => {
                // Add a child node to parent.
                if (gChildNode.constructParentId === innerNode.constructNodeId) {
                  this.addChildNode(inChild, gChildNode);
                }
              });
            }
          }
        });
      }
    });
    this.counter = Math.max(...this.counterList);
    this.updateChildCount();
  }

  dragStartRow(item) {
    if (this.readOnly === false) {
      console.log(item)

      this.draggedItem = item.node;
      this.selected = [...this.selected];
    }

  }

  dragStart(item: any) {
    if (this.readOnly === false) {
      console.log(item)

      this.draggedItem = item;
    }
    this.isDisabledView = true;
  }

  // donwnload Zip file
  downloadZip() {
    this.offerConstructCanvasService.downloadZip(this.currentOfferId).subscribe((res) => {
      const nameOfFileToDownload = 'offer-construct';
      const blob = new Blob([res], { type: 'application/zip' });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, nameOfFileToDownload);
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = nameOfFileToDownload;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }

  // first remove selected node from offerConstructService.singleMultipleFormInfo

  // testOne() {
  //   alert(this.selected);
  // }

  removeSelected() {
    //if (this.markCompleteStatus === false) {
      if (this.selected.length) {
        this.selected.forEach((selectedItem) => {
          if (selectedItem.parent == null) {
            this.offerConstructItems.forEach((element) => {
              this.removeEginieMajorItemFromListofAlreadyAddedItems(element.data.title);
              if (element.data.uniqueKey == selectedItem.data.uniqueKey) {

                // remove list form global variable
                this.deleteQuestionToNode(selectedItem.data.uniqueKey, selectedItem.data.isMajorLineItem);
              }
            });
          } else {
            this.offerConstructItems.forEach((element) => {
              if (element.data.uniqueKey == selectedItem.parent.data.uniqueKey) {
                // Loop through of all childrens of matched Parent data from Offer array
                element.children.forEach((childElement) => {
                  if (childElement.data.uniqueKey == selectedItem.data.uniqueKey) {
                    // remove list form global variable
                    this.deleteQuestionToNode(selectedItem.data.uniqueKey, selectedItem.data.isMajorLineItem);
                  }
                });
              }

              // Check if parent is a group Node.
              if (selectedItem.parent.data.isGroupNode) {
                this.offerConstructItems.forEach((element) => {
                  element.children.forEach((childElement) => {
                    if (childElement.data.uniqueKey == selectedItem.parent.data.uniqueKey) {
                      // Removed the child element from Parent Array of Offer construct Array
                      childElement.children.forEach((innerChildElement) => {
                        if (innerChildElement.data.uniqueKey == selectedItem.data.uniqueKey) {
                          // remove list form global variable
                          this.deleteQuestionToNode(selectedItem.data.uniqueKey, selectedItem.data.isMajorLineItem);
                          // childElement.children.splice(innerChildIndex, 1);
                        }
                      });
                    }
                  });
                });
              }
            });
          }
        });
      }
      this.removeSelectedNode();  //  remove selected node from offerConstructItems
      this.checkCanMarkCompleteStatus();
   // }

  }

  removeSelectedNode() {
    if (this.selected.length) {

      this.selected.forEach((selectedItem) => {
        if (selectedItem.parent == null) {
          // If parent not present which means its a Major Item and may contains children.
          // Therefore we have to remove complete element from offer array where uniquekey = rowData.uniqueKey
          this.offerConstructItems.forEach((element, index) => {
            this.removeEginieMajorItemFromListofAlreadyAddedItems(element.data.title);
            if (element.data.uniqueKey == selectedItem.data.uniqueKey) {

              // remove list form global variable
              this.offerConstructItems.splice(index, 1);
            }
          });
        } else {
          // Means Remove event occurs on child elements of any parent.
          // Here we will loop through all offer array and find parent index key then
          // Another loop of children & find Here we have to remove only that children whose uniquekey = rowData.uniqueKey
          // Loop through All available offers construct items array
          this.offerConstructItems.forEach((element) => {
            if (element.data.uniqueKey == selectedItem.parent.data.uniqueKey) {
              // Loop through of all childrens of matched Parent data from Offer array
              element.children.forEach((childElement, childIndex) => {
                if (childElement.data.uniqueKey == selectedItem.data.uniqueKey) {
                  // remove list form global variable
                  element.children.splice(childIndex, 1);
                  // Removed the child element from Parent Array of Offer construct Array
                }
              });
            }

            // Check if parent is a group Node.
            if (selectedItem.parent.data.isGroupNode) {
              this.offerConstructItems.forEach((element) => {
                element.children.forEach((childElement) => {
                  if (childElement.data.uniqueKey == selectedItem.parent.data.uniqueKey) {
                    // Removed the child element from Parent Array of Offer construct Array
                    childElement.children.forEach((innerChildElement, innerChildIndex) => {
                      if (innerChildElement.data.uniqueKey == selectedItem.data.uniqueKey) {
                        // remove list form global variable
                        childElement.children.splice(innerChildIndex, 1);
                        // Removed the child element from Parent Array of Offer construct Array
                      }
                    });
                  }
                });
              });
            }
          });
        }
      });
    }
    this.nodeToDelete = {};
    this.offerConstructItems = [...this.offerConstructItems];
    this.selected = null;
    // this.removeEginieMajorItemFromListofAlreadyAddedItems();
    this.updateChildCount();
  }

  /**
   * Convert searched e-gine PIDs to a format equal to other PID's
   */
  convertEgineDetails(searchResult): any {
    const arrayOfEginieItems: any[] = [];
    for (const key in searchResult) {
      const obj = Object.create(null);
      obj['egineAttribue'] = key;
      obj['values'] = this.convertToArray(searchResult[key]);
      obj['eGenieFlag'] = true;
      obj['eGenieExistingPid'] = true;
      arrayOfEginieItems.push(obj);
    }
    return arrayOfEginieItems;
  }

  /**
   * Called when an Major Item is added in to Offer Components Tree table
   * after e-ginie search
   * @param searchResult
   */
  addMajorItem(searchResult) {
    const titleName = this.selectedPids.PID;
    if (!this.addedEgineMajorItemsInTree.includes(titleName)) {
      this.initalRowAdded = false;
      const productName = searchResult['Item Category'];
      const obj = Object.create(null);
      obj['uniqueKey'] = ++this.counter;
      this.uniqueId = obj['uniqueKey'];
      obj['productName'] = productName; // PID Category
      obj['isGroupNode'] = false; // Group Node or Not
      obj['title'] = titleName; // PID Name
      obj['isMajorLineItem'] = true; // Major/Minor
      obj['childCount'] = 0;
      obj['eginieItem'] = true;
      // obj['itemDetails'] = searchResult;
      obj['itemDetails'] = this.convertEgineDetails(searchResult);
      this.offerConstructItems.push(this.itemToTreeNode(obj));
      this.offerConstructItems = [...this.offerConstructItems];
      this.countableItems.push(this.uniqueId);
      this.updateChildCount();
      this.addedEgineMajorItemsInTree.push(titleName);
      this.eGinieSearchForm.reset();


      // call to method for add search PID info in global variable
      this.getSetQuestionAccordingToPID(searchResult, productName, obj, false, true);
    }
  }

  /**
   * Called when an Minor Item is added in to Offer Components Tree table
   * after e-ginie search.
   * A minor item is added to the last added major item in the canvas
   * @param searchResult
   */
  addMinorItem(searchResult) {
    const titleName = this.selectedPids.PID;
    if (this.offerConstructItems.length > 0) {
      const productName = searchResult['Item Category'];
      const obj = Object.create(null);
      obj['uniqueKey'] = ++this.counter;
      this.uniqueId = obj['uniqueKey'];
      obj['productName'] = productName; // PID Category
      obj['isGroupNode'] = false; // Group Node or Not
      obj['title'] = titleName; // PID Name
      obj['isMajorLineItem'] = false; // Major/Minor
      obj['childCount'] = 0;
      obj['eginieItem'] = true;
      // obj['itemDetails'] = searchResult;
      obj['itemDetails'] = this.convertEgineDetails(searchResult);
      // A minor item cannot be added if altleast one major item doesn't exist
      const lastMajorItem = this.offerConstructItems[this.offerConstructItems.length - 1];
      lastMajorItem.children.push(this.itemToTreeNode(obj));
      this.offerConstructItems = [...this.offerConstructItems];
      this.updateChildCount();
      this.eGinieSearchForm.reset();

      // call to method for add search PID info in global variable
      this.getSetQuestionAccordingToPID(searchResult, productName, obj, false, false);
    }
  }

  /**
   * Mehtod to delete major item from list which was added from E-ginie search.
   * This will help to maitain an unique major item in the tree.
   * @param itemName
   */
  removeEginieMajorItemFromListofAlreadyAddedItems(itemName) {
    if (this.addedEgineMajorItemsInTree.includes(itemName)) {
      const index = this.addedEgineMajorItemsInTree.indexOf(itemName);
      this.addedEgineMajorItemsInTree.splice(index, 1);
    }
  }

  /**
   *
   * @param $event Search for PID
   */
  searchForItemFromPdaf(event) {
    const searchString = event.query.toUpperCase();
    this.offerConstructCanvasService.searchEgenie(searchString).subscribe((results) => {
      this.results = [...results];
    },
      () => {
        this.results = [];
      }
    );
  }

  /**
   * Get e-ginie attribute, add searched item to offer configuration.
   * @param $event Search for PID
   */
  addSearchedItemToOfferConfig() {
    this.loaderService.startLoading();
    this.offerConstructCanvasService.getPidDetails(this.selectedPids.PID).subscribe((results) => {
      this.loaderService.stopLoading();

      // Raviraj US290268
      if (!_.isEmpty(results)) {
        if (results.body['major/minor'] === 'Minor Line') {
          if ((results.body['WorkFlow Status'] === 'APPROVED' || results.body['WorkFlow Status'] === 'PENDING APPROVAL BUC'
          || results.body['WorkFlow Status'].toUpperCase() === 'PENDING PRODUCT CLASS') &&
            ((results.body['WorkFlow Status Requested By'] === 'BUC') || (
              results.body['WorkFlow Status Requested By'] === 'PDT'))) {
            // Call to add minor line item.
            this.addMinorItem(results.body);
          }
        }
        else {
          this.showMajorItemFoundDialog = true;
        }
      }
    },
      () => {
        this.results = [];
        this.loaderService.stopLoading();
      }
    );
  }

  showMajorItemFoundDialogFunction() {
    this.showMajorItemFoundDialog = false;
  }


  // getAndSetQUestionAccordingToPID

  getSetQuestionAccordingToPID(searchResult, productName, obj, isFromDB, isMajorOrMinor) {

    const groupName = productName;
    const majorItem = {
      groupName: groupName
    };
    const info = [];
    info.push(majorItem);
    const groupsName = { groups: info };
    let questionsList: any;
    if (!isFromDB) {  // form search PID
      this.offerConstructService.addDetails(groupsName).subscribe((data) => {
        questionsList = data.groups[0].listOfferQuestions;
        for (const element in searchResult) {
          questionsList.forEach(ques => {
            if (element == ques.question) {
              ques.currentValue = searchResult[element];
            }
            if (ques.egineAttribue == 'Item Name (PID)') {
              ques.currentValue = obj.title;
              ques.previousValue = obj.title;
            }
          });
        }
        const groupinfo = {
          uniqueKey: obj.uniqueKey,
          title: obj.title,
          uniqueNodeId: obj.uniqueNodeId,
          childCount: obj.childCount,
          isMajor: obj.isMajorLineItem,
          isGroupNode: obj.isGroupNode,
          groupName: obj.productName,
          eGenieFlag: true,
          listOfferQuestions: questionsList,
          newItemEGenieStatus: obj.newItemEGenieStatus
        };
        const setinfo = { [groupName]: groupinfo };
        this.setProductInfo(groupName, isMajorOrMinor, setinfo, data.groups[0].listOfferQuestions);
      }, () => { },
        () => {
        });
    } else {
      this.offerConstructService.addDetails(groupsName).subscribe((data) => {
        questionsList = data.groups[0].listOfferQuestions;
        searchResult.forEach(element => {
          questionsList.forEach(ques => {
            if (element.egineAttribue == ques.question) {
              ques.currentValue = element.values;
            }
          });
        });
        const groupinfo = {
          uniqueKey: obj.uniqueKey,
          title: obj.title,
          uniqueNodeId: obj.uniqueNodeId,
          childCount: obj.childCount,
          isMajor: obj.isMajorLineItem,
          isGroupNode: obj.isGroupNode,
          groupName: obj.productName,
          eGenieFlag: true,
          listOfferQuestions: questionsList,
          newItemEGenieStatus: obj.newItemEGenieStatus
        };
        const setinfo = { [groupName]: groupinfo };
        this.setProductInfo(groupName, isMajorOrMinor, setinfo, data.groups[0].listOfferQuestions);
      }, () => { },
        () => {
        });
    }
  }

  drop(rowdata) {
    rowdata.node.children.push(this.draggedItem);
    this.offerConstructItems = [...this.offerConstructItems];
  }

  dragEnd() {
    this.draggedItem = null;
  }

  toggleSidebar() {
    this.expandView = !this.expandView;
  }

  addMore() {
    this.expandView = !this.expandView;
  }

  closeDailog(updateInfo?) {
    this.displayAddDetails = false;
    this.questions = [];
    // this.questionForm.reset();

    // reset the form with current value with previous value
    if (updateInfo) {
      this.resetFormValue(this.uniqueNodeId, true);  // if
    } else {
      this.resetFormValue(this.uniqueNodeId, false);
    }

  }

  onHide() {
    this.displayAddDetails = false;
    this.questions = [];
    this.showMandatoryDetails = false;
    this.closeDailog(false);  // reset form info
  }

  addItemDetails() {
    this.setSearchItem.node.data.searchItemRef = this.itemsList;
    this.showMandatoryDetails = false;
    this.replaceSingleFormQuestionWith(this.uniqueNodeId);
    this.payLoad = JSON.stringify(this.questionForm.value);
    // this.currentRowClicked.node.data['itemDetails'] = this.questionForm.value;
    this.currentRowClicked.node.data['itemDetails'] = this.questionsList[this.uniqueNodeId];
    this.closeDailog(true);  // save form info
  }

  replaceSingleFormQuestionWith(popHeadName) {
    const title = this.QuestionsNodeInfo[popHeadName].title;
    if (this.QuestionsNodeInfo[popHeadName].isMajor) {     // for major group
      // for major group
      for (const x in this.offerConstructService.singleMultipleFormInfo['major']) {
        if (x == this.QuestionsNodeInfo[popHeadName].groupName) {
          this.offerConstructService.singleMultipleFormInfo.major[x]['productInfo'].forEach(element => {
            console.log(element[title]);
            if (element[title].uniqueKey == this.QuestionsNodeInfo[popHeadName].uniqueId) {
              this.questionList[this.uniqueNodeId] = element[title].listOfferQuestions;
            }
          });
        }
      }
    }
  }

  replacetabularFormQuestion() {
    // replace tabular form  question with offerConstructItems itemsDeatails
    // for major group
    let groupName;
    let title;
    this.offerConstructService.singleMultipleFormInfo['major'].forEach((list, index) => {
      groupName = Object.keys(list);
      this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach(element => {
        title = Object.keys(element);
        // if (Object.keys(element) == title) {
        this.changeItemDetails(true, element[title]);
        this.offerConstructItems.forEach(e => {
          if (e.data.uniqueKey === element[title].uniqueKey) { e.data.title = e.data.label = element[title].title; }
        });
        // }
      });

    });

    // minor section
    this.offerConstructService.singleMultipleFormInfo['minor'].forEach((list, index) => {
      groupName = Object.keys(list);
      this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].forEach(element => {
        title = Object.keys(element);
        this.changeItemDetails(false, element[title]);
        this.offerConstructItems.forEach(major => {
          if (major['children'].length > 0) {
            major['children'].forEach(e => {
              if (e.data.uniqueKey === element[title].uniqueKey) {
                e.data.title = e.data.label = element[title].title;
              }
            });
          }
        });
        // }
      });
    });

  }

  changeItemDetails(isManjor, info) {
    // Construct all group Nodes.
    this.offerConstructItems.forEach((node) => {
      // check if this item is major item
      if (isManjor) {
        if (node.parent === null) {
          if ((node.data.uniqueKey == info.uniqueKey) && (!node.data.eginieItem)) {
            node.data.itemDetails = info.listOfferQuestions;
          }
        }
      } else {
        // Construct all minor items
        if (node.children !== undefined && node.children !== null) {
          node.children.forEach((child) => {
            if (!child.data.isGroupNode) {
              // check their unique key and replace with itemDeatils with productInfo
              if (_.isEmpty(child.data.itemDetails)) {
                if ((child.data.uniqueKey == info.uniqueKey) && (!child.data.eginieItem)) {
                  child.data.itemDetails = info.listOfferQuestions;
                }
              } else {
                if ((child.data.uniqueKey == info.uniqueKey) && (!child.data.eginieItem)) {
                  child.data.itemDetails = info.listOfferQuestions;
                }
              }
            } else {
              // Store Group Information
              // Store children under group node.
            }
          });
        }
      }
    });
    console.log(this.offerConstructItems);
  }

  showAddDetailsDailog(currentNode) {
    // const productName = product;
    this.setSearchItem = currentNode;
    this.currentRowClicked = currentNode;
    this.cd.detectChanges();
    if (currentNode.node.data.searchItemRef) {
      this.itemsList = currentNode.node.data.searchItemRef;
    } else {
      this.itemsList = null;
    }

    this.currentRowClicked = currentNode;
    this.lineItemName = currentNode.node.data.productName;
    this.popHeadName = currentNode.node.data.title;
    let itemDetails = currentNode.node.data['itemDetails'];
    this.displayAddDetails = true;

    if (itemDetails && !itemDetails['Item Name (PID)']) {
      itemDetails['Item Name (PID)'] = currentNode.node.data.title;
      this.cd.detectChanges();
    } else if (itemDetails === undefined) {
      itemDetails = { 'Item Name (PID)': currentNode.node.data.title };
      this.cd.detectChanges();
    } else if (this.setTitle && this.setTitle !== currentNode.node.data.title) {
      itemDetails['Item Name (PID)'] = currentNode.node.data.title;
    }

    this.setTitle = null;
    this.setTitle = currentNode.node.data.title;
    this.uniqueNodeId = currentNode.node.data.uniqueKey;
    const groups: Groups[] = [];
    const group = new Groups(
      this.lineItemName
    );

    groups.push(group);
    this.checkNodeUniqueKeyAndPatchQuestion(currentNode, true);

    // Map Drop-down values
    // this.mapDropDownValues();

    this.questionForm = this.offerConstructService.toFormGroup(this.questionsList[this.uniqueNodeId]);
  }


  showViewDetailsDailog(currentNode) {
    this.popHeadName = currentNode.node.data.title;
    this.displayViewDetails = true;
    // let itemDetails = currentNode.node.data['itemDetails'];
    this.viewDetails = currentNode.node.data['itemDetails'];
    delete this.viewDetails['major/minor'];
  }

  openMandatory() {
    this.showMandatoryDetails = !this.showMandatoryDetails;
  }

  discardChanges() {
    // Check if construct details are availbale in the database for the current offer.
    this.offerDetailViewService.retrieveOfferDetails(this.currentOfferId).subscribe(offerDetailRes => {
      if (offerDetailRes.constructDetails) {
        this.transformDataToTreeNode(offerDetailRes);
      }
    }, (err) => {
      console.log(err);
    });
    this.offerConstructItems = [...this.offerConstructItems];
    this.countableItems = [];
    this.addedEgineMajorItemsInTree = [];
  }

  saveOfferConstructChanges() {

    // save  loader
    this.loaderService.startLoading();

    this.downloadEnable = true;
    this.offerConstructItems = [... this.offerConstructItems];

    const cds: ConstructDetails = new ConstructDetails(this.currentOfferId, []);

    // Construct all group Nodes.
    this.offerConstructItems.forEach((node) => {

      let cd: ConstructDetail;

      // check if this item is major item
      if (node.parent === null) {

        cd = new ConstructDetail();
        cd.constructItem = 'Major';
        cd.constructItemName = node.data.title;
        cd.constructType = node.data.productName;
        cd.productFamily = '';
        cd.constructNodeId = node.data.uniqueKey.toString();
        cd.constructParentId = '0';
        cd.groupNode = false;

        // Checking if item is e-genie item.
        if (node.data['eginieItem']) {
          cd.eGenieFlag = true;
        }

        if (_.isEmpty(node.data.itemDetails)) {

          // const id = new ItemDetail();
          // id.attributeName = 'Item Name (PID)';
          // id.attributeValue = this.convertToArray(node.data.title);
          // id.eGenieFlag = cd.eGenieFlag;
          // id.eGenieExistingPid = cd.eGenieFlag;
          // cd.itemDetails.push(id);
          cd.itemDetails = node.data.itemDetails;
          cd.itemDetails['eGenieFlag'] = cd.eGenieFlag;
          cd.itemDetails['attributeName'] = cd.eGenieFlag;
          cd.itemDetails['eGenieExistingPid'] = cd.eGenieFlag;
        } else {
          // for (const key in node.data.itemDetails) {
          //   id = new ItemDetail();
          //   id.attributeName = key;
          //   id.attributeValue = this.convertToArray(node.data.itemDetails[key]);
          //   id.eGenieFlag = cd.eGenieFlag;
          //   id.eGenieExistingPid = cd.eGenieFlag;
          //   cd.itemDetails.push(id);
          // }
          cd.itemDetails = node.data.itemDetails;
          cd.itemDetails['eGenieFlag'] = cd.eGenieFlag;
          cd.itemDetails['attributeName'] = cd.eGenieFlag;
          cd.itemDetails['eGenieExistingPid'] = cd.eGenieFlag;
        }
        cds.constructDetails.push(cd);
      }

      // Construct all minor items
      if (node.children !== undefined && node.children !== null) {
        node.children.forEach((child) => {
          if (!child.data.isGroupNode) {
            cd = new ConstructDetail();
            cd.constructItem = 'Minor';
            cd.constructItemName = child.data.title;
            cd.constructType = child.data.productName;
            cd.productFamily = '';
            cd.constructNodeId = child.data.uniqueKey.toString();
            cd.constructParentId = node.data.uniqueKey.toString();
            cd.groupNode = false;
            // Checking if item is e-genie item.
            if (child.data['eginieItem']) {
              cd.eGenieFlag = true;
            }
            if (_.isEmpty(child.data.itemDetails)) {

              // const id = new ItemDetail();
              // id.attributeName = 'Item Name (PID)';
              // id.attributeValue = this.convertToArray(child.data.title);
              // id.eGenieFlag = cd.eGenieFlag;
              // id.eGenieExistingPid = cd.eGenieFlag;
              // cd.itemDetails.push(id);
              cd.itemDetails = child.data.itemDetails;
              cd.itemDetails['eGenieFlag'] = cd.eGenieFlag;
              cd.itemDetails['attributeName'] = cd.eGenieFlag;
              cd.itemDetails['eGenieExistingPid'] = cd.eGenieFlag;

            } else {

              // let id: ItemDetail;
              // for (const key in child.data.itemDetails) {
              //   id = new ItemDetail();
              //   id.attributeName = key;
              //   id.attributeValue = this.convertToArray(child.data.itemDetails[key]);
              //   id.eGenieFlag = cd.eGenieFlag;
              //   id.eGenieExistingPid = cd.eGenieFlag;
              //   cd.itemDetails.push(id);
              // }
              cd.itemDetails = child.data.itemDetails;
              cd.itemDetails['eGenieFlag'] = cd.eGenieFlag;
              cd.itemDetails['attributeName'] = cd.eGenieFlag;
              cd.itemDetails['eGenieExistingPid'] = cd.eGenieFlag;
            }
            cds.constructDetails.push(cd);
          } else {
            // Store Group Information
            cd = new ConstructDetail();
            cd.constructItem = 'Group';
            cd.constructItemName = child.data.title;
            cd.constructType = 'Group';
            cd.productFamily = '';
            cd.constructNodeId = child.data.uniqueKey.toString();
            cd.constructParentId = node.data.uniqueKey.toString();
            cd.groupNode = true;
            cds.constructDetails.push(cd);

            // Store children under group node.
            if (child.children !== undefined && child.children !== null) {
              child.children.forEach((gchild) => {
                cd = new ConstructDetail();
                cd.constructItem = 'Minor';
                cd.constructItemName = gchild.data.title;
                cd.constructType = gchild.data.productName;
                cd.productFamily = '';
                cd.constructNodeId = gchild.data.uniqueKey.toString();
                cd.constructParentId = child.data.uniqueKey.toString();
                cd.groupNode = false;
                // Checking if item is e-genie item.
                if (gchild.data['eginieItem']) {
                  cd.eGenieFlag = true;
                }
                if (gchild.data.itemDetails !== undefined) {
                  cd.itemDetails = gchild.data.itemDetails;
                  cd.itemDetails['eGenieFlag'] = cd.eGenieFlag;
                  cd.itemDetails['attributeName'] = cd.eGenieFlag;
                  cd.itemDetails['eGenieExistingPid'] = cd.eGenieFlag;

                  // for (const key in gchild.data.itemDetails) {
                  //   id = new ItemDetail();
                  //   id.attributeName = key;
                  //   id.attributeValue = this.convertToArray(gchild.data.itemDetails[key]);
                  //   id.eGenieFlag = cd.eGenieFlag;
                  //   id.eGenieExistingPid = cd.eGenieFlag;
                  //   cd.itemDetails.push(id);
                  // }
                }
                cds.constructDetails.push(cd);
              });
            }
          }
        });
      }
    });

    console.log('cds', cds);
    this.offerConstructCanvasService.saveOfferConstructChanges(cds).subscribe(() => {
      this.loaderService.stopLoading();
    },
      () => {
        this.loaderService.stopLoading();
      });
  }

  /**
   * Convert user entered values to an array of values to save in DB.
   */
  convertToArray(selectedItems): string[] {
    const tempArrayOfValues: string[] = [];
    // First check if the values is of array type
    // Meaning this values are from multiselect
    // If not array just copy values in to a temp array and return
    if (Array.isArray(selectedItems)) {
      selectedItems.forEach((selectedValues) => {
        tempArrayOfValues.push(selectedValues.name);
      });
    } else {
      tempArrayOfValues.push(selectedItems);
    }
    return tempArrayOfValues;
  }

  /**
   * Update Count of children under each Major Line Item.
   */
  updateChildCount() {

    if (this.offerConstructItems.length === 0) {
      this.map1.clear();
    }

    this.countableItems.forEach((index) => {
      this.offerConstructItems.forEach((item) => {
        if (item.data.uniqueKey === index) {
          // First find total no of children under root node.
          let totalChildren = item.children.length;
          let totalNoOfGroups = 0;
          // then find count of total children in each group if group exists, and
          // the number of groups
          if (item.children.length > 0) {
            item.children.forEach((child) => {
              if (child.data.isGroupNode) {
                totalNoOfGroups = ++totalNoOfGroups;
                totalChildren = totalChildren + child.children.length;
              } else {
                // do nothing
              }
            });
          }
          // then total count - number of groups will be the actual count
          totalChildren = totalChildren - totalNoOfGroups;
          item.data['childCount'] = totalChildren;
        }
      });
    });
    this.offerConstructCanvasService.sendMessage(this.offerConstructItems);
  }


  checkNodeUniqueKeyAndPatchQuestion(rowNode, patchQuestion: boolean) {
    if (patchQuestion) {
      this.patchQuestionToNode(rowNode.node.data.uniqueKey, rowNode.node.data.isMajorLineItem, rowNode.node.data.uniqueNodeId);
    } else {
      this.deleteQuestionToNode(rowNode.node.data.uniqueKey, rowNode.node.data.isMajorLineItem);
    }
  }

  deleteItemToNode(uniqueKey, isMajorLineItem) {
    this.deleteQuestionToNode(uniqueKey, isMajorLineItem);
  }

  patchQuestionToNode(uniqueId, isMajor, title) {

    let groupType;
    if (isMajor) {
      groupType = 'major';
    } else {
      groupType = 'minor';
    }

    this.offerConstructService.singleMultipleFormInfo[groupType].forEach((list, index) => {
      const groupName: any = Object.keys(list);
      this.offerConstructService.singleMultipleFormInfo[groupType][index][groupName]['productInfo'].forEach(element => {
        const productName: any = Object.keys(element);
        if (element[productName].uniqueKey == uniqueId) {
          if (this.questionsList[this.uniqueNodeId] == undefined) {
            this.questionsList[this.uniqueNodeId] = element[productName].listOfferQuestions;
            this.QuestionsNodeInfo[this.uniqueNodeId] = {
              'uniqueId': uniqueId, 'groupName': groupName,
              'isMajor': isMajor, 'title': title,
              'uniqueNodeId': this.uniqueNodeId,
              'questionList': element[productName].listOfferQuestions
            };
          } else {
            this.questionsList[this.uniqueNodeId].forEach(item => {
              if (Object.keys(item) != this.uniqueNodeId) {
                this.questionsList[this.uniqueNodeId] = element[productName].listOfferQuestions;
                this.QuestionsNodeInfo[this.uniqueNodeId] = {
                  'uniqueId': uniqueId, 'groupName': groupName,
                  'isMajor': isMajor, 'title': title,
                  'uniqueNodeId': this.uniqueNodeId,
                  'questionList': element[productName].listOfferQuestions
                };
              }
            });
          }
        }
      });
    });
  }

  deleteQuestionToNode(uniqueId, isMajor) {
    let indexCount: number;
    let innerIndexCount: number;
    if (isMajor) {     // for major group
      let groupName: any;
      let selectedMajorProduct: any;
      const groupType = 'major';
      this.offerConstructService.singleMultipleFormInfo['major'].forEach((list, index) => {
        groupName = Object.keys(list);
        indexCount = index;
        selectedMajorProduct = this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach((element, index) => {
          const pName: any = Object.keys(element);

          if (element[pName].uniqueKey == uniqueId) {
            innerIndexCount = index;
            this.removeFromArray(indexCount, innerIndexCount, groupName, groupType);
          }
        });
        // selectedMajorProduct = this.removeFromArray(selectedMajorProduct, uniqueId);
      });

    } else {
      let groupName: any;
      this.offerConstructService.singleMultipleFormInfo['minor'].forEach((list, index) => {
        groupName = Object.keys(list);
        indexCount = index;
        const groupType = 'minor';
        this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].forEach((element, index) => {
          const pName: any = Object.keys(element);
          if (element[pName].uniqueKey == uniqueId) {
            innerIndexCount = index;
            this.removeFromArray(indexCount, innerIndexCount, groupName, groupType);
          }
        });
      });
    }
  }

  removeFromArray(indexCount, innerIndexCount, groupName, groupType) {
    this.offerConstructService.singleMultipleFormInfo[groupType][indexCount][groupName]['productInfo'].splice(innerIndexCount, 1);
    // array.splice(index, 1);
    // return array;
  }

  resetFormValue(popHeadName, isUdate: boolean) {
    // const groupName = this.QuestionsNodeInfo[popHeadName].groupName;
    const uniqueId = this.QuestionsNodeInfo[popHeadName].uniqueId;
    if (this.QuestionsNodeInfo[popHeadName].isMajor) {     // for major group
      this.offerConstructService.singleMultipleFormInfo['major'].forEach((list, index) => {
        const groupName: any = Object.keys(list);
        this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach((element) => {
          const producttitle: any = Object.keys(element);
          if (element[producttitle].uniqueKey == uniqueId) {
            this.replaceOrUpdatevalue(element[producttitle].listOfferQuestions, element[producttitle].eGenieFlag, isUdate);
          }
          // }
        });
        // }
      });
    } else {
      this.offerConstructService.singleMultipleFormInfo['minor'].forEach((list, index) => {
        const groupName: any = Object.keys(list);
        this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].forEach((element) => {
          const producttitle: any = Object.keys(element);
          if (element[producttitle].uniqueKey == uniqueId) {
            this.replaceOrUpdatevalue(element[producttitle].listOfferQuestions, element[producttitle].eGenieFlag, isUdate);
          }
        });
        // }
      });
    }
  }

  replaceOrUpdatevalue(listOfferQuestions, isEgenieFlag, isUdate) {
    if (!isEgenieFlag || isEgenieFlag === false) {
      listOfferQuestions.forEach(element => {
        if (isUdate) {  // update the value
          if (element.componentType !== 'Multiselect') {
            element.previousValue = element.currentValue;
          } else {
            element.listPreviousValue = element.listCurrentValue;
          }
        } else {  // for cancel the form
          if (element.componentType !== 'Multiselect') {
            element.currentValue = element.previousValue;
          } else {
            element.listCurrentValue = element.listPreviousValue;
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
// check major and mirror status to make mark complete enable
  checkCanMarkCompleteStatus() {


    // let message = 'false';
    // if (this.offerConstructItems.length === 0) {
    //   message = "false";
    // } else {
    //   this.offerConstructItems.forEach(item => {
    //     if (item.children.length > 0) {
    //       message = "true";
    //     }
    //   })
    // }
    // this.getCanMarkCompleteStatus.next(message);
    const majorItemData = [];
    const minorItemData = [];

      this.offerConstructItems.forEach(item => {
        if (item.data.isMajorLineItem === true) {
          majorItemData.push(item);
        }
      });

     this.offerConstructItems.forEach(minorItem => {
        minorItem['children'].forEach(element => {
          if (element.data.isMajorLineItem === false) {
            minorItemData.push(element);
          }
        });
      });

     this.offerConstructItems.forEach(majorItem => {
        majorItem['children'].forEach(ele => {
          if (ele.data.isGroupNode) {
            if (ele.children.length > 0) {
              ele.children.forEach(element => {
                minorItemData.push(element);
              });
            }
          }
        });
      });

      if (majorItemData.length > 0 && minorItemData.length > 0){
        this.getCanMarkCompleteStatus.next(true);


        }else{
          this.getCanMarkCompleteStatus.next(false);
        }
  }

}
