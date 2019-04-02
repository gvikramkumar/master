import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { OfferconstructCanvasService } from '@app/offer-construct-canvas/service/offerconstruct-canvas.service';
import { MMItems } from '@app/offer-construct-canvas/model/MMItems';
import { ActivatedRoute } from '@angular/router';
import { SubGroup } from '@app/offer-construct-canvas/model/SubGroup';
import { Group } from '@app/offer-construct-canvas/model/Group';
import { Groups } from '@app/models/groups';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { OfferConstructService } from '@app/services/offer-construct.service';
import { ConstructDetails } from '@app/offer-construct-canvas/model/ConstructDetails';
import { ConstructDetail } from '@app/offer-construct-canvas/model/ConstructDetail';
import { ItemDetail } from '@app/offer-construct-canvas/model/ItemDetail';
import { group } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';
import { async } from '@angular/core/testing';
import { StakeHolder } from '@app/models/stakeholder';
import { OfferDetailViewService } from '@app/services/offer-detail-view.service';
import { filter } from 'rxjs/operators';
import * as _ from 'lodash';
import { MessageService } from '@app/services/message.service';
import { ConfigurationService } from '@shared/services';
@Component({
  selector: 'app-offerconstruct-canvas',
  templateUrl: './offer-construct-canvas.component.html',
  styleUrls: ['./offer-construct-canvas.component.css'],
  providers: [OfferConstructService]
})
export class OfferconstructCanvasComponent implements OnInit, OnDestroy {
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
  private buttonId;
  private uniqueId;
  varibableToBind;
  displayAddDetails: Boolean = false;
  addDetails;
  productName;
  @Input() questions: any[] = [];
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
  display: boolean = false;
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
  public isMajorMinorGroupCreated: boolean = false;
  public isDisabledView: boolean = true;
  listOfferQuestions: any;

  constructor(private cd: ChangeDetectorRef, private elRef: ElementRef, private messageService: MessageService, private offerConstructCanvasService: OfferconstructCanvasService,
    private offerConstructService: OfferConstructService,
    private configurationService: ConfigurationService,
    private activatedRoute: ActivatedRoute, private _fb: FormBuilder, private offerDetailViewService: OfferDetailViewService) {

    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
    this.myForm = this._fb.group({
      // you can also set initial formgroup inside if you like
      companies: this._fb.array([])
    })
  }


  // create a json skelaton for major and minor group

  createMajorMinorGroup() {

    //major group
    this.offerConstructService.singleMultipleFormInfo['major'] = [];
    this.majorAndMinorInfo['major'].forEach(element => {
      this.offerConstructService.singleMultipleFormInfo['major'].push({
        [element]: { 'questionset': [], 'productInfo': [] }
      });
    });

    //minor group
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
  dropItem($event) {
    this.initalRowAdded = false;
    console.log(this.draggedItem);
    if (this.draggedItem['isMajorLineItem']) {
      const obj = Object.create(null);
      obj['uniqueKey'] = ++this.counter;
      this.uniqueId = obj['uniqueKey'];
      obj['productName'] = this.draggedItem.productName;
      obj['isGroupNode'] = false;
      obj['label'] = this.draggedItem.label;
      obj['title'] = this.draggedItem.productName;
      obj['isMajorLineItem'] = this.draggedItem.isMajorLineItem;
      obj['childCount'] = 0;
      let data = this.map1.get(this.draggedItem.productName)
      if (data == undefined) {
        this.map1.set(this.draggedItem.productName, 1);
      } else {
        this.map1.set(this.draggedItem.productName, this.map1.get(this.draggedItem.productName) + 1);
      }
      obj['title'] = this.draggedItem.productName + ' ' + this.map1.get(this.draggedItem.productName);
      obj['uniqueNodeId'] = this.draggedItem.productName + '_' + obj['uniqueKey'];

      // get question set once user drag and drop any product
      let groupName = obj.productName;
      const majorItem = {
        groupName: groupName
      };
      let test = [];
      test.push(majorItem);
      let groupsName = { groups: test };
      // this.getQuestionOnDragDrop(groupsName);  //set listOfOfferquestion to itemDeatils of objects
      this.offerConstructService.addDetails(groupsName).subscribe((data) => {
        this.listOfferQuestions = data.groups[0].listOfferQuestions;
      }, (err) => { },
        () => {
          obj['itemDetails'] = this.listOfferQuestions;
          this.getQuestionList(obj);
        });

      // obj['itemDetails'] = this.getQuestionOnDragDrop(groupsName);
      // call getQuestionList() for set question on drag and drop on product
      // this.getQuestionList(obj);
      this.offerConstructItems.push(this.itemToTreeNode(obj));
      this.offerConstructItems = [...this.offerConstructItems];
      this.countableItems.push(this.uniqueId);
      this.updateChildCount();
    }
  }

  getQuestionOnDragDrop(groupsName) {
    this.offerConstructService.addDetails(groupsName).subscribe((data) => {
      this.listOfferQuestions = data.groups[0].listOfferQuestions;
      return data.groups[0].listOfferQuestions;
    }, (err) => { },
      () => {
      });
  }

  getQuestionList(obj, isQuestionPresent?) {
    console.log("isQuestionPresent", isQuestionPresent);

    let group_name = obj.productName;
    const majorItem = {
      groupName: group_name
    };
    let test = [];
    test.push(majorItem);
    let groupsName = { groups: test };
    this.offerConstructService.addDetails(groupsName).subscribe((data) => {
      let groupName = obj.uniqueNodeId;
      //let groupName = obj.uniqueKey;
      let listOfferQuestions;
      if (isQuestionPresent == undefined) {
        console.log("isQuestionPresent if block", isQuestionPresent);
        listOfferQuestions = data.groups[0].listOfferQuestions;
      } else {
        console.log("isQuestionPresent else block", isQuestionPresent);
        listOfferQuestions = obj.itemDetails;
      }
      let groupinfo = {
        uniqueKey: obj.uniqueKey,
        title: obj.title,
        uniqueNodeId: obj.uniqueNodeId,
        childCount: obj.childCount,
        isMajor: obj.isMajorLineItem,
        isGroupNode: obj.isGroupNode,
        groupName: obj.productName,
        listOfferQuestions: listOfferQuestions
      }

      let setinfo = { [groupName]: groupinfo };

      // this.offerConstructService.singleMultipleFormInfo['productInfo'].push({ [groupName]: groupinfo });

      console.log(this.offerConstructService.singleMultipleFormInfo);

      this.setProductInfo(obj.productName, obj.isMajorLineItem, setinfo, listOfferQuestions);
    });
  }

  setProductInfo(groupName, groupType, groupInfo, questionSet) {

    if (groupType) {      //for major group
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
    console.log("---", (this.offerConstructService.singleMultipleFormInfo));
    console.log("--- offerConstructItems", (this.offerConstructItems));

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
    this.offerConstructCanvasService.getPidDetails(this.itemsList.PID).subscribe(items => {
      itemsData = items.body;
      // this.questionForm.patchValue(itemsData);
      this.cd.detectChanges();
    }, (err) => { },
      () => { this.singleFormCopy(itemsData) });
    this.setSearchItem.node.data.searchItemRef = this.itemsList;
    this.offerConstructItems = [...this.offerConstructItems];
    this.cd.detectChanges();
  }

  //search copy attributes

  singleFormCopy(itemsData) {
    let groupName: any = Object.keys(this.questionsList);
    for (let searchValue in itemsData) {
      // itemsData.forEach(searchValue => {
      this.questionsList[groupName].forEach(element => {
        if (searchValue === element.question) {
          element.currentValue = itemsData[searchValue];
        }
      });
    }
  }

  searchCopyAttributes(event) {
    const searchString = event.query.toUpperCase();
    this.offerConstructCanvasService.searchEgenie(searchString).subscribe((results) => {
      this.copyAttributeResults = [...results];
    },
      (error) => {
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

  showMandatory(event, id) {
    this.toggleMandatory = this.toggleMandatory ? false : true;
    this.displayMandatory = event.target.id;
    this.cd.detectChanges();
  }

  showDialog() {
    // this.majorItemData = [];
    // this.minorItemData = [];

    let offerInfo = this.offerConstructService.singleMultipleFormInfo;
    let majorOfferInfo = offerInfo.major;
    let minorOfferInfo = offerInfo.minor;

    let majorLength = {};
    let minorLength = {};
    majorOfferInfo.forEach((element, index) => {
      let name: any = Object.keys(element);
      majorLength[name] = false;
      if ((element[name].productInfo).length > 0) {
        majorLength[name] = true;
      }
    });
    minorOfferInfo.forEach(element => {
      let name: any = Object.keys(element);
      minorLength[name] = false;
      if ((element[name].productInfo).length > 0) {
        minorLength[name] = true;
      }
    });
    this.offerConstructService.itemlengthList = { major: majorLength, minor: minorLength };
    console.log(this.offerConstructService.itemlengthList);
    this.display = true;
    this.offerConstructService.closeAddDetails = true;


    console.log(this.offerConstructItems, this.offerConstructService.singleMultipleFormInfo);



    // let tempObj = [];
    // this.offerConstructItems = [...this.offerConstructItems]
    // tempObj = null;
    // this.formGroupData = [];
    // this.formGroupDataMinorItems = [];
    // tempObj = this.offerConstructItems;
    // tempObj.forEach(item => {
    //   if (item.parent == null) {
    //     const majorItem = {
    //       productName: item.data.productName
    //     };
    //     if (item.children.length) {
    //       let tempChildObj = []
    //       tempChildObj = item.children;
    //       tempChildObj.forEach(item => {
    //         if (!item.data.isGroupNode) {
    //           const minorItem = {
    //             productName: item.data.productName
    //           }
    //           this.minorItemData.push(minorItem);
    //         }
    //       })
    //     }
    //     this.majorItemData.push(majorItem);
    //   }
    // })
    // this.displayAddDetails = true;
    // let groups = [];
    // for (let i = 0; i < this.majorItemData.length; i++) {
    //   let groupName = { groupName: this.majorItemData[i].productName }
    //   groups.push(groupName);
    // }
    // let minorGroups = []
    // for (let i = 0; i < this.minorItemData.length; i++) {
    //   let minorGroupName = { groupName: this.minorItemData[i].productName }
    //   minorGroups.push(minorGroupName);
    // }
    // let groupsPayload = groups;
    // let m = this;
    // for (let i = 0; i < minorGroups.length; i++) {
    //   let payLoad = { groups: [minorGroups[i]] }
    //   m.offerConstructService.addDetails(payLoad).subscribe(
    //     (data) => {
    //       this.formGroupDataMinorItems.push(data);
    //       this.multipleForms = this.offerConstructService.toFormGroup(this.questions);
    //     }, err => console.log('error ' + err),
    //     () => console.log('Ok ')
    //   );
    // }
    // for (let i = 0; i < groups.length; i++) {
    //   let payLoadMajor = { groups: [groups[i]] }
    //   m.offerConstructService.addDetails(payLoadMajor).subscribe(
    //     (data) => {
    //       this.formGroupData.push(data);
    //       this.mandatoryFields.push(data.groups[0]);
    //       this.multipleForms = this.offerConstructService.toFormGroup(this.questions);
    //     }, err => console.log('error ' + err),
    //     () => console.log('Ok ')
    //   );
    // }
  }

  /* METHOD: deleteNode
    PARAMS: Selected row node to identify the Parent and their children.
    PURPOSE: Use to delete the parent Node as well as Child node in case of grouped Offer Category.
    CREATED ON: 23 Feb 2019
  */
  deleteNode(rowNode) {
    if (rowNode.parent == null) {
      // If parent not present which means its a Major Item and may contains children.
      //Therefore we have to remove complete element from offer array where uniquekey = rowData.uniqueKey
      this.offerConstructItems.forEach((element, index) => {
        if (element.data.uniqueKey == rowNode.node.data.uniqueKey) {
          this.checkNodeUniqueKeyAndPatchQuestion(rowNode, false);
          this.offerConstructItems.splice(index, 1);
        }
      });
    } else {
      // Means Remove event occurs on child elements of any parent.
      // Here we will loop through all offer array and find parent index key then
      // Another loop of children & find Here we have to remove only that children whose uniquekey = rowData.uniqueKey
      // Loop through All available offers construct items array
      this.offerConstructItems.forEach((element, index) => {
        if (element.data.uniqueKey == rowNode.parent.data.uniqueKey) {
          // Loop through of all childrens of matched Parent data from Offer array
          element.children.forEach((childElement, childIndex) => {
            if (childElement.data.uniqueKey == rowNode.node.data.uniqueKey) {
              this.checkNodeUniqueKeyAndPatchQuestion(rowNode, false);
              element.children.splice(childIndex, 1);
              // Removed the child element from Parent Array of Offer construct Array
            }
          });
        }
      });
      // Check if parent is a group Node.
      if (rowNode.parent.data.isGroupNode) {
        this.offerConstructItems.forEach((element, index) => {
          element.children.forEach((childElement, childIndex) => {
            if (childElement.data.uniqueKey == rowNode.parent.data.uniqueKey) {
              // Removed the child element from Parent Array of Offer construct Array
              childElement.children.forEach((innerChildElement, innerChildIndex) => {
                if (innerChildElement.data.uniqueKey == rowNode.node.data.uniqueKey) {
                  this.checkNodeUniqueKeyAndPatchQuestion(rowNode, false);
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

      //change label and header name in global variable
      console.log(rowNode);

      this.changelabel(rowNode.node.data.uniqueKey, rowNode.node.data.productName, rowNode.node.data.isMajorLineItem, rowNode.node.data.uniqueNodeId, rowNode.node.data.name)


      this.cd.detectChanges();
    }

    if (rowNode.node.data['itemDetails']) {
      rowNode.node.data['itemDetails']['Item Name (PID)'] = rowNode.node.data.title;
    }

    this.showButtons = false;
    this.offerConstructItems = [...this.offerConstructItems];
  }


  handleChange(obj, $event) {
    let oldValue = obj.myField;
    let newValue = $event.target.value;
    obj.name = newValue;
  }

  //change name of product 
  changelabel(uniqueKey, productName, isMajorLineItem, uniqueNodeId, name) {
    let groupType;
    if (isMajorLineItem) {
      groupType = "major";
    } else {
      groupType = "minor";
    }
    debugger;
    this.offerConstructService.singleMultipleFormInfo[groupType].forEach((list, index) => {
      if (Object.keys(list) == productName) {
        this.offerConstructService.singleMultipleFormInfo[groupType][index][productName]['productInfo'].forEach((element, index) => {
          if (Object.keys(element) == uniqueNodeId) {
            if (element[uniqueNodeId].uniqueKey == uniqueKey) {
              element[uniqueNodeId].title = name;
            }
          }
        });
      }
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
  dropOnRow($event, rowNode, rowData) {
    if (this.draggedItem.parent) {
      if (this.draggedItem.parent.children) {
        this.itemCount = this.draggedItem.parent.children.length;
      }
    }
    if (this.draggedItem.parent === null) {
      this.offerConstructItems = [...this.offerConstructItems];
    }
    else {
      if (
        rowNode.node.data['isMajorLineItem'] &&
        !this.draggedItem['isMajorLineItem']
      ) {
        if (this.draggedItem.data) {
          if (this.draggedItem.data.isGroupNode && this.draggedItem.children.length > 0) {
            const obj = Object.create(null);
            obj['uniqueKey'] = ++this.counter;
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
                  obj1['uniqueKey'] = ++this.counter;
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
                  this.offerConstructItems = [...this.offerConstructItems];
                }
              });
            });
            this.delteFromParentObject(rowNode, this.draggedItem.data);
            this.offerConstructItems = [...this.offerConstructItems];
          }
        }
        if (this.draggedItem.parent !== undefined) {
          if (this.setFlag) {
            // If dragged node is a tree node,meaning the node which is moved between the canvas
            const obj = Object.create(null);
            obj['uniqueKey'] = ++this.counter;
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
            rowNode.node.children.push(this.itemToTreeNode(obj));
            this.delteFromParentObject(rowNode, this.draggedItem.data);
          }
          this.setFlag = true;
        }
        else {
          // If dragged node is not an actual tree node
          const obj = Object.create(null);
          obj['uniqueKey'] = ++this.counter;
          this.uniqueId = obj['uniqueKey'];
          obj['isGroupNode'] = false;
          obj['productName'] = this.draggedItem.productName;
          obj['label'] = this.draggedItem.label;
          obj['isMajorLineItem'] = this.draggedItem.isMajorLineItem;
          obj['listPrice'] = this.draggedItem.listPrice;
          obj['title'] = this.draggedItem.productName;
          let data = this.map1.get(this.draggedItem.productName)
          if (data == undefined) {
            this.map1.set(this.draggedItem.productName, 1);
          } else {
            this.map1.set(this.draggedItem.productName, this.map1.get(this.draggedItem.productName) + 1);
          }
          obj['title'] = this.draggedItem.productName + ' ' + this.map1.get(this.draggedItem.productName);

          obj['uniqueNodeId'] = this.draggedItem.productName + '_' + obj['uniqueKey'];

          let groupName = obj.productName;
          const majorItem = {
            groupName: groupName
          };
          let test = [];
          test.push(majorItem);
          let groupsName = { groups: test };
          // obj['itemDetails'] = this.getQuestionOnDragDrop(groupsName);
          this.offerConstructService.addDetails(groupsName).subscribe((data) => {
            this.listOfferQuestions = data.groups[0].listOfferQuestions;
          }, (err) => { },
            () => {
              obj['itemDetails'] = this.listOfferQuestions;
              this.getQuestionList(obj);
            });

          rowNode.node.children.push(this.itemToTreeNode(obj));
        }
      }

      if (
        rowNode.node.data['isGroupNode'] &&
        !this.draggedItem['isMajorLineItem']
      ) {
        if (this.draggedItem.data.isGroupNode) {
        } else {
          const obj = Object.create(null);
          obj['uniqueKey'] = ++this.counter;
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
          rowNode.node.children.push(this.itemToTreeNode(obj));
          this.delteFromParentObject(rowNode, this.draggedItem.data);
        }
      }

      this.offerConstructItems = [...this.offerConstructItems];
    }
    this.updateChildCount();
  }

  /**
   * Delete child object when moving from one row to another
   * @param rowNode
   * @param child
   */
  delteFromParentObject(rowNode, child) {
    let tempChildArray = this.draggedItem.parent.children;
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

    this.subscription = this.messageService.getMessage()
      .subscribe(message => {
        this.saveOfferConstructChanges();
      });

    this.eGinieSearchForm = new FormGroup({
      searchPID: new FormControl(null, Validators.required)
    });

    // Check if construct details are availbale in the database for the current offer.
    this.offerConstructService.space.subscribe((val) => {
      this.offerConstructItems.forEach(item => {
        if (item.data.productName == val[0]) {
          item.data['itemDetails'] = val[1];
        }
      })
      this.offerConstructItems.forEach(value => {
        value.children.forEach(itm => {
          if (itm.data.productName == val[0]) {
            itm.data['itemDetails'] = val[1];
          }
        })
      })

      this.offerConstructService.closeDialog.subscribe((val) => {
        if (val == 'close') {
          this.display = false;
        }
      })

      this.offerConstructItems = [...this.offerConstructItems];
    });
    // this.questionForm = this.OfferconstructCanvasService.toFormGroup(this.questionsList)
    this.questionForm = new FormGroup({
    });
    this.multipleForms = new FormGroup({
    });

    // Prepare payload to fetch item categories. Obtain MM information.
    this.offerConstructCanvasService.getMMInfo(this.currentOfferId).subscribe((offerDetails) => {

      // Initialize MM ModelICC Request Param Details
      const mmModel = offerDetails.derivedMM;

      // Initialize Offer Types
      const componentsObj = offerDetails['selectedCharacteristics'] == null ? null : offerDetails['selectedCharacteristics'].
        filter(char => char.subgroup === 'Offer Components');
      const components = componentsObj == null ? null : componentsObj[0]['characteristics'];

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


      }, (err) => { console.log(err) },
        () => (this.createMajorMinorGroup(), this.offerDetailView()));

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
      if (offerDetailRes.constructDetails.length > 0) {
        this.transformDataToTreeNode(offerDetailRes);
      }
    }, (err) => {
      console.log(err);
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

  /**
   * Method to add parent node to tree.
   * @param node
   */
  addNode(node): TreeNode {
    const obj = Object.create(null);
    obj['uniqueKey'] = node.constructNodeId;
    this.counter = Number(node.constructNodeId);
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
    let tempNode = this.itemToTreeNode(obj);
    this.offerConstructItems.push(tempNode);
    this.offerConstructItems = [...this.offerConstructItems];
    this.countableItems.push(node.constructNodeId);

    obj['uniqueNodeId'] = node.constructType + '_' + obj['uniqueKey'];
    this.getQuestionList(obj, true);

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
    let tempNode = this.itemToTreeNode(obj);
    parentNode.children.push(tempNode);
    this.offerConstructItems = [...this.offerConstructItems];
    this.updateChildCount();

    //set question for respective major or minor section
    obj['uniqueNodeId'] = childNode.constructType + '_' + obj['uniqueKey'];
    this.getQuestionList(obj, true);

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
        let parentNode = this.addNode(node);
        offerDetailRes.constructDetails.forEach(innerNode => {
          // Add a child node to parent.
          if (innerNode.constructParentId === node.constructNodeId) {
            let inChild = this.addChildNode(parentNode, innerNode);
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
    this.updateChildCount();
  }

  dragStartRow($event, item) {
    if (this.readOnly === false) {
      this.draggedItem = item.node;
      // this.selected = [...this.selected];
    }

  }

  dragStart(event, item: any) {
    if (this.readOnly === false) {
      this.draggedItem = item;
    }
    this.isDisabledView = true;
  }

  // donwnload Zip file
  downloadZip(offerId) {
    this.offerConstructCanvasService.downloadZip(this.currentOfferId).subscribe((res) => {
      const nameOfFileToDownload = 'offer-construct';
      const blob = new Blob([res], { type: 'application/zip' });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, nameOfFileToDownload);
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = nameOfFileToDownload;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }

  removeSelected() {
    if (this.selected.length) {

      this.selected.forEach((selectedItem) => {
        if (selectedItem.parent == null) {
          // If parent not present which means its a Major Item and may contains children.
          // Therefore we have to remove complete element from offer array where uniquekey = rowData.uniqueKey
          this.offerConstructItems.forEach((element, index) => {
            this.removeEginieMajorItemFromListofAlreadyAddedItems(element.data.title);
            if (element.data.uniqueKey == selectedItem.data.uniqueKey) {

              //remove list form global variable
              this.deleteQuestionToNode(selectedItem.data.uniqueKey, selectedItem.data.productName, selectedItem.data.isMajorLineItem, selectedItem.data.uniqueNodeId);
              this.offerConstructItems.splice(index, 1);
            }
          });
        } else {
          // Means Remove event occurs on child elements of any parent.
          // Here we will loop through all offer array and find parent index key then
          // Another loop of children & find Here we have to remove only that children whose uniquekey = rowData.uniqueKey
          // Loop through All available offers construct items array
          this.offerConstructItems.forEach((element, index) => {
            if (element.data.uniqueKey == selectedItem.parent.data.uniqueKey) {
              // Loop through of all childrens of matched Parent data from Offer array
              element.children.forEach((childElement, childIndex) => {
                if (childElement.data.uniqueKey == selectedItem.data.uniqueKey) {
                  //remove list form global variable
                  this.deleteQuestionToNode(selectedItem.data.uniqueKey, selectedItem.data.productName, selectedItem.data.isMajorLineItem, selectedItem.data.uniqueNodeId);
                  element.children.splice(childIndex, 1);
                  // Removed the child element from Parent Array of Offer construct Array
                }
              });
            }

            // Check if parent is a group Node.
            if (selectedItem.parent.data.isGroupNode) {
              this.offerConstructItems.forEach((element, index) => {
                element.children.forEach((childElement, childIndex) => {
                  if (childElement.data.uniqueKey == selectedItem.parent.data.uniqueKey) {
                    // Removed the child element from Parent Array of Offer construct Array
                    childElement.children.forEach((innerChildElement, innerChildIndex) => {
                      if (innerChildElement.data.uniqueKey == selectedItem.data.uniqueKey) {
                        //remove list form global variable
                        this.deleteQuestionToNode(selectedItem.data.uniqueKey, selectedItem.data.productName, selectedItem.data.isMajorLineItem, selectedItem.data.uniqueNodeId);
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
    let arrayOfEginieItems: any[] = [];
    for (const key in searchResult) {
      const obj = Object.create(null);
      obj['egineAttribue'] = key;
      obj['values'] = this.convertToArray(searchResult[key]);
      obj['eGenieFlag'] = true;
      obj['eGenieExistingPid'] = true;
      arrayOfEginieItems.push(obj)
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
      (error) => {
        this.results = [];
      }
    );
  }

  /**
   * Get e-ginie attribute, add searched item to offer configuration.
   * @param $event Search for PID
   */
  addSearchedItemToOfferConfig() {
    this.offerConstructCanvasService.getPidDetails(this.selectedPids.PID).subscribe((results) => {
      if (results.body['major/minor'] === 'Minor Line') {
        // Call to add minor line item.
        this.addMinorItem(results.body);
      } else if (results.body['major/minor'] === 'Major Line') {
        // Call to add major line item
        this.addMajorItem(results.body);
      } else {
        // Some problem in the response
      }
    },
      (error) => {
        this.results = [];
      }
    );
  }

  drop(event, rowdata) {
    rowdata.node.children.push(this.draggedItem);
    this.offerConstructItems = [...this.offerConstructItems];
  }

  dragEnd(event) {
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

    //reset the form with current value with previous value
    if (updateInfo) {
      this.resetFormValue(this.uniqueNodeId, true);
    } else {
      this.resetFormValue(this.uniqueNodeId, false);
    }

  }

  onHide() {
    // this.offerConstructService.changeForm('reset');
    console.log("onHide");

    this.displayAddDetails = false;
    this.questions = [];
    this.showMandatoryDetails = false;
    this.closeDailog();
  }

  addItemDetails(popHeadName) {
    this.setSearchItem.node.data.searchItemRef = this.itemsList;
    this.showMandatoryDetails = false;
    this.replaceSingleFormQuestionWith(this.uniqueNodeId)
    this.payLoad = JSON.stringify(this.questionForm.value);
    // this.currentRowClicked.node.data['itemDetails'] = this.questionForm.value;
    this.currentRowClicked.node.data['itemDetails'] = this.questionsList[this.uniqueNodeId];
    this.closeDailog(true);
  }

  replaceSingleFormQuestionWith(popHeadName) {
    let title = this.QuestionsNodeInfo[popHeadName].title;
    if (this.QuestionsNodeInfo[popHeadName].isMajor) {     //for major group
      //for major group
      for (let x in this.offerConstructService.singleMultipleFormInfo['major']) {
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
    console.log((this.offerConstructService.singleMultipleFormInfo));
  }

  replacetabularFormQuestion(counter) {
    // replace tabular form  question with offerConstructItems itemsDeatails
    //for major group

    console.log(this.offerConstructService.singleMultipleFormInfo);


    let groupName;
    let title;
    let uniqueId;
    this.offerConstructService.singleMultipleFormInfo['major'].forEach((list, index) => {
      groupName = Object.keys(list);
      this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach(element => {
        title = Object.keys(element);
        // if (Object.keys(element) == title) {
        this.changeItemDetails(true, element[title]);
        // }
      });

    });

    // minor section
    this.offerConstructService.singleMultipleFormInfo['minor'].forEach((list, index) => {
      groupName = Object.keys(list);
      this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].forEach(element => {
        title = Object.keys(element);
        this.changeItemDetails(false, element[title]);
        // }
      });
    });

  }

  changeItemDetails(isManjor, info) {
    // Construct all group Nodes.
    console.log(info);

    this.offerConstructItems.forEach((node) => {
      console.log(node);
      // check if this item is major item
      if (isManjor) {
        if (node.parent === null) {
          if (node.data.uniqueKey == info.uniqueKey) {
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
                if (child.data.uniqueKey == info.uniqueKey) {
                  child.data.itemDetails = info.listOfferQuestions;
                }
              } else {
                if (child.data.uniqueKey == info.uniqueKey) {
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
    console.log(currentNode);

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
    if (itemDetails && !itemDetails["Item Name (PID)"]) {
      itemDetails["Item Name (PID)"] = currentNode.node.data.title;
      this.cd.detectChanges();
    } else if (itemDetails === undefined) {
      itemDetails = { "Item Name (PID)": currentNode.node.data.title };
      this.cd.detectChanges();
    } else if (this.setTitle && this.setTitle !== currentNode.node.data.title) {
      itemDetails["Item Name (PID)"] = currentNode.node.data.title;
    }
    this.setTitle = null;
    this.setTitle = currentNode.node.data.title;
    this.uniqueNodeId = currentNode.node.data.uniqueNodeId;
    const groups: Groups[] = [];
    const group = new Groups(
      this.lineItemName
    );
    groups.push(group);
    const groupsPayload = { groups };
    // this.offerConstructService.addDetails(groupsPayload).subscribe((data) => {
    //   this.addDetails = data;
    //   this.addDetails.groups[0].listOfferQuestions.forEach(element => {
    //     const quesion = element;
    //     this.questions.push(quesion);
    //   });
    //   this.questionForm = this.offerConstructService.toFormGroup(this.questions);
    //   if (itemDetails !== undefined) {
    //     this.questionForm.patchValue(itemDetails);
    //   }
    // },
    //   (err) => {
    //     console.log(err);
    //   });

    this.checkNodeUniqueKeyAndPatchQuestion(currentNode, true);
    
    // TODO:Sudeepthi: hook up form validations here
    console.log("questionsList:" +this.questionsList[this.uniqueNodeId]);
    this.questionForm = this.offerConstructService.toFormGroup(this.questionsList[this.uniqueNodeId]);
    console.log(this.questionForm.controls);

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

    this.downloadEnable = true;
    console.log(this.offerConstructItems);

    this.offerConstructItems = [... this.offerConstructItems];
    console.log(this.offerConstructItems);

    let cds: ConstructDetails = new ConstructDetails(this.currentOfferId, []);

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

        } else {
          let id: ItemDetail;
          // for (const key in node.data.itemDetails) {
          //   id = new ItemDetail();
          //   id.attributeName = key;
          //   id.attributeValue = this.convertToArray(node.data.itemDetails[key]);
          //   id.eGenieFlag = cd.eGenieFlag;
          //   id.eGenieExistingPid = cd.eGenieFlag;
          //   cd.itemDetails.push(id);
          // }
          cd.itemDetails = node.data.itemDetails;
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
                  let id: ItemDetail;
                  for (const key in gchild.data.itemDetails) {
                    id = new ItemDetail();
                    id.attributeName = key;
                    id.attributeValue = this.convertToArray(gchild.data.itemDetails[key]);
                    id.eGenieFlag = cd.eGenieFlag;
                    id.eGenieExistingPid = cd.eGenieFlag;
                    cd.itemDetails.push(id);
                  }
                }
                cds.constructDetails.push(cd);
              });
            }
          }
        });
      }


    });

    console.log("cds", cds);


    this.offerConstructCanvasService.saveOfferConstructChanges(cds).subscribe(data => {
    },
      (error) => {
        console.log(error);
      });
  }

  /**
   * Convert user entered values to an array of values to save in DB.
   */
  convertToArray(selectedItems): string[] {
    let tempArrayOfValues: string[] = [];
    // First check if the values is of array type
    // Meaning this values are from multiselect
    // If not array just copy values in to a temp array and return
    if (Array.isArray(selectedItems)) {
      selectedItems.forEach((selectedValues) => {
        tempArrayOfValues.push(selectedValues.name);
      })
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
      this.patchQuestionToNode(rowNode.node.data.uniqueKey, rowNode.node.data.productName, rowNode.node.data.isMajorLineItem, rowNode.node.data.uniqueNodeId);
    } else {
      this.deleteQuestionToNode(rowNode.node.data.uniqueKey, rowNode.node.data.productName, rowNode.node.data.isMajorLineItem, rowNode.node.data.uniqueNodeId);
    }
  }

  patchQuestionToNode(uniqueId, groupName, isMajor, title) {
    if (isMajor) {     //for major group
      this.offerConstructService.singleMultipleFormInfo['major'].forEach((list, index) => {
        if (Object.keys(list) == groupName) {
          this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach(element => {
            if (Object.keys(element) == title) {
              if (element[title].uniqueKey == uniqueId) {
                this.questionsList[this.uniqueNodeId] = element[title].listOfferQuestions;
                this.QuestionsNodeInfo[this.uniqueNodeId] = { 'uniqueId': uniqueId, 'groupName': groupName, 'isMajor': isMajor, 'title': title, 'uniqueNodeId': this.uniqueNodeId };
              }
            }
          });
        }
      });
    } else {
      this.offerConstructService.singleMultipleFormInfo['minor'].forEach((list, index) => {
        if (Object.keys(list) == groupName) {
          this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].forEach(element => {
            if (Object.keys(element) == title) {
              if (element[title].uniqueKey == uniqueId) {
                this.questionsList[this.uniqueNodeId] = element[title].listOfferQuestions;
                this.QuestionsNodeInfo[this.uniqueNodeId] = { 'uniqueId': uniqueId, 'groupName': groupName, 'isMajor': isMajor, 'title': title, 'uniqueNodeId': this.uniqueNodeId };
              }
            }
          });
        }
      });
    }
  }

  deleteQuestionToNode(uniqueId, groupName, isMajor, title) {
    let MajordeletedJson: any;
    let minordeletedJson: any;
    let indexCount: number;
    if (isMajor) {     //for major group
      this.offerConstructService.singleMultipleFormInfo['major'].forEach((list, index) => {
        if (Object.keys(list) == groupName) {
          indexCount = index;
          MajordeletedJson = this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].filter((element, index) => {
            return Object.keys(element) != title;
          });
        }
      });
      this.offerConstructService.singleMultipleFormInfo.major[indexCount][groupName]['productInfo'] = MajordeletedJson;

    } else {
      this.offerConstructService.singleMultipleFormInfo['minor'].forEach((list, index) => {
        let gName: any = Object.keys(list)
        if (Object.keys(list) == groupName) {
          indexCount = index;
          minordeletedJson = this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].filter((element, index) => {
            return Object.keys(element) != title;
          });
        }
      });
      this.offerConstructService.singleMultipleFormInfo.minor[indexCount][groupName]['productInfo'] = minordeletedJson;
    }
  }

  resetFormValue(popHeadName, isUdate: boolean) {
    let title = this.QuestionsNodeInfo[popHeadName].title;
    let groupName = this.QuestionsNodeInfo[popHeadName].groupName;
    let uniqueId = this.QuestionsNodeInfo[popHeadName].uniqueId;
    if (this.QuestionsNodeInfo[popHeadName].isMajor) {     //for major group
      this.offerConstructService.singleMultipleFormInfo['major'].forEach((list, index) => {
        if (Object.keys(list) == this.QuestionsNodeInfo[popHeadName].groupName) {
          this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach((element, index) => {
            if (Object.keys(element) == title) {
              if (element[title].uniqueKey == uniqueId) {
                this.replaceOrUpdatevalue(element[title].listOfferQuestions, isUdate)
              }
            }
          });
        }
      });
    } else {
      this.offerConstructService.singleMultipleFormInfo['minor'].forEach((list, index) => {
        if (Object.keys(list) == this.QuestionsNodeInfo[popHeadName].groupName) {
          this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].forEach((element, index) => {
            if (Object.keys(element) == title) {
              if (element[title].uniqueKey == uniqueId) {
                this.replaceOrUpdatevalue(element[title].listOfferQuestions, isUdate)
              }
            }
          });
        }
      });
    }
  }

  replaceOrUpdatevalue(listOfferQuestions, isUdate) {
    listOfferQuestions.forEach(element => {
      if (isUdate) {
        element.previousValue = element.currentValue;
      } else {
        element.currentValue = element.previousValue;
      }
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}

