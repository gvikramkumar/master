import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  Input,
  OnChanges
} from '@angular/core';
import { TreeNode, MessageService } from 'primeng/api';
import { OfferconstructCanvasService } from './service/offerconstruct-canvas.service';
import { MMItems } from './model/MMItems';
import { ActivatedRoute } from '@angular/router';
import { SubGroup } from './model/SubGroup';
import { Group } from './model/Group';
import { Groups } from '../models/groups';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { OfferConstructService } from '../services/offer-construct.service';
import { ConstructDetails } from './model/ConstructDetails';
import { ConstructDetail } from './model/ConstructDetail';
import { ItemDetail } from './model/ItemDetail';
import { group } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';
import { async } from '@angular/core/testing';
import { StakeHolder } from '../models/stakeholder';
import { OfferDetailViewService } from '../services/offer-detail-view.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-offerconstruct-canvas',
  templateUrl: './offerconstruct-canvas.component.html',
  styleUrls: ['./offerconstruct-canvas.component.css'],
  providers: [MessageService, OfferConstructService]
})
export class OfferconstructCanvasComponent implements OnInit {
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

  constructor(private cd: ChangeDetectorRef, private elRef: ElementRef, private messageService: MessageService, private offerConstructCanvasService: OfferconstructCanvasService,
    private offerConstructService: OfferConstructService,
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

  /**
   * Called when Item is dragged into Offer Components Tree table
   * When major line item is dragged from left to right
   * @param $event
   */
  dropItem($event) {
    this.initalRowAdded = false;
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
      this.offerConstructItems.push(this.itemToTreeNode(obj));
      this.offerConstructItems = [...this.offerConstructItems];
      this.countableItems.push(this.uniqueId);
      this.updateChildCount();
    }
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
    this.majorItemData = [];
    this.minorItemData = [];
    this.display = true;
    let tempObj = [];
    this.offerConstructItems = [...this.offerConstructItems]
    tempObj = null;
    this.formGroupData = [];
    this.formGroupDataMinorItems = [];
    tempObj = this.offerConstructItems;
    tempObj.forEach(item => {
      if (item.parent == null) {
        const majorItem = {
          productName: item.data.productName
        };
        if (item.children.length) {
          let tempChildObj = []
          tempChildObj = item.children;
          tempChildObj.forEach(item => {
            if (!item.data.isGroupNode) {
              const minorItem = {
                productName: item.data.productName
              }
              this.minorItemData.push(minorItem);
            }
          })
        }
        this.majorItemData.push(majorItem);
      }
    })
    this.displayAddDetails = true;
    let groups = [];
    for (let i = 0; i < this.majorItemData.length; i++) {
      let groupName = { groupName: this.majorItemData[i].productName }
      groups.push(groupName);
    }
    let minorGroups = []
    for (let i = 0; i < this.minorItemData.length; i++) {
      let minorGroupName = { groupName: this.minorItemData[i].productName }
      minorGroups.push(minorGroupName);
    }
    let groupsPayload = groups;
    let m = this;
    for (let i = 0; i < minorGroups.length; i++) {
      let payLoad = { groups: [minorGroups[i]] }
      m.offerConstructService.addDetails(payLoad).subscribe(
        (data) => {
          this.formGroupDataMinorItems.push(data);
          this.multipleForms = this.offerConstructService.toFormGroup(this.questions);
        }, err => console.log('error ' + err),
        () => console.log('Ok ')
      );
    }
    for (let i = 0; i < groups.length; i++) {
      let payLoadMajor = { groups: [groups[i]] }
      m.offerConstructService.addDetails(payLoadMajor).subscribe(
        (data) => {
          this.formGroupData.push(data);
          this.mandatoryFields.push(data.groups[0]);
          this.multipleForms = this.offerConstructService.toFormGroup(this.questions);
        }, err => console.log('error ' + err),
        () => console.log('Ok ')
      );
    }
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
      //rowNode.node.data.productName = rowNode.node.data.name;
      // this.offerConstructItems.push(this.itemToTreeNode(rowNode));
      this.offerConstructItems = [...this.offerConstructItems];
      this.cd.detectChanges();
    }

    this.showButtons = false;
    this.offerConstructItems = [...this.offerConstructItems];
  }


  handleChange(obj, $event) {
    let oldValue = obj.myField;
    let newValue = $event.target.value;
    obj.name = newValue;
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
                    obj1['itemDetails'] = element1.data['itemDetails'];
                  }
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
              obj['itemDetails'] = this.draggedItem.data['itemDetails'];
            }
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
            obj['itemDetails'] = this.draggedItem.data['itemDetails'];
          }
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

    this.eGinieSearchForm = new FormGroup({
      searchPID: new FormControl(null, Validators.required)
    });

    // Check if construct details are availbale in the database for the current offer.
    this.offerDetailViewService.offerDetailView(this.currentOfferId).subscribe(offerDetailRes => {
      if (offerDetailRes.constructDetails.length > 0) {
        this.transformDataToTreeNode(offerDetailRes);
      }
    }, (err) => {
      console.log(err);
    });

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
      const offerTypeObj = offerDetails['solutioningDetails'] == null ? null :
        offerDetails['solutioningDetails'].filter(sol => sol.dimensionSubgroup === 'Offer Type');
      const offerType = offerTypeObj == null ? null : offerTypeObj[0]['dimensionAttribute'];

      // Form ICC Request
      const iccRequest = {
        'mmModel': mmModel,
        'offerType': offerType,
        'components': components
      };

      // Call offerconstruct request to get Major/Minor Line Items
      this.offerConstructCanvasService.retrieveIccDetails(iccRequest).subscribe((iccResponse) => {

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


      });

    });


    this.itemCount = 0;

    this.cols = [
      { field: 'productName', header: 'PRODUCTS' },
      { field: 'productFamily', header: 'PRODUCT FAMILY' },
      { field: 'listPrice', header: 'LIST PRICE(USD)' }
    ];
  }

  /**
   * Convert itemdetails array of objets into single object.
   * @param itemDetails
   */
  convertItemDetail(itemDetails): Object {
    const obj = Object.create(null);
    itemDetails.forEach(element => {
      obj[element.attributeName] = element.attributeValue;
    });
    return obj;
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
    obj['itemDetails'] = this.convertItemDetail(node.itemDetails);
    obj['childCount'] = 0;
    let tempNode = this.itemToTreeNode(obj);
    this.offerConstructItems.push(tempNode);
    this.offerConstructItems = [...this.offerConstructItems];
    this.countableItems.push(node.constructNodeId);
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
    obj['itemDetails'] = this.convertItemDetail(childNode.itemDetails);
    obj['childCount'] = 0;
    let tempNode = this.itemToTreeNode(obj);
    parentNode.children.push(tempNode);
    this.offerConstructItems = [...this.offerConstructItems];
    this.updateChildCount();
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
    this.draggedItem = item.node;
    // this.selected = [...this.selected];
  }

  dragStart(event, item: any) {
    this.draggedItem = item;
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
   * Called when an Major Item is added in to Offer Components Tree table
   * after e-ginie search
   * @param searchResult
   */
  addMajorItem(searchResult) {
    const titleName = this.selectedPids.PID;
    if (!this.addedEgineMajorItemsInTree.includes(titleName)) {
      this.initalRowAdded = false;
      const productName = searchResult['PID Category'];
      const obj = Object.create(null);
      obj['uniqueKey'] = ++this.counter;
      this.uniqueId = obj['uniqueKey'];
      obj['productName'] = productName; // PID Category
      obj['isGroupNode'] = false; // Group Node or Not
      obj['title'] = titleName; // PID Name
      obj['isMajorLineItem'] = true; // Major/Minor
      obj['childCount'] = 0;
      obj['eginieItem'] = true;
      obj['itemDetails'] = searchResult;
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
      const productName = searchResult['PID Category'];
      const obj = Object.create(null);
      obj['uniqueKey'] = ++this.counter;
      this.uniqueId = obj['uniqueKey'];
      obj['productName'] = productName; // PID Category
      obj['isGroupNode'] = false; // Group Node or Not
      obj['title'] = titleName; // PID Name
      obj['isMajorLineItem'] = false; // Major/Minor
      obj['childCount'] = 0;
      obj['eginieItem'] = true;
      obj['itemDetails'] = searchResult;
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
    this.offerConstructCanvasService.searchEgenie(event.query).subscribe((results) => {
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

  closeDailog() {
    this.displayAddDetails = false;
    this.questions = [];
  }

  onHide() {
    this.offerConstructService.changeForm('reset');
    this.displayAddDetails = false;
    this.questions = [];
    this.showMandatoryDetails = false;
  }

  addItemDetails() {
    this.showMandatoryDetails = false;
    this.payLoad = JSON.stringify(this.questionForm.value);
    this.currentRowClicked.node.data['itemDetails'] = this.questionForm.value;
    this.closeDailog();
  }

  addAllItemDetails(details) {
    this.showMandatoryDetails = false;
    this.payLoad = JSON.stringify(this.multipleForms.value);
    this.currentRowClicked.node.data['itemDetails'] = this.questionForm.value;
    this.closeDailog();
  }

  showAddDetailsDailog(currentNode) {
    // const productName = product;
    this.currentRowClicked = currentNode;
    this.lineItemName = currentNode.node.data.productName;
    this.popHeadName = currentNode.node.data.title;
    let itemDetails = currentNode.node.data['itemDetails'];
    this.displayAddDetails = true;
    const groups: Groups[] = [];
    const group = new Groups(
      this.lineItemName
    );
    groups.push(group);
    const groupsPayload = { groups };
    this.offerConstructService.addDetails(groupsPayload).subscribe((data) => {
      this.addDetails = data;
      this.addDetails.groups[0].listOfferQuestions.forEach(element => {
        const quesion = element;
        this.questions.push(quesion);
      });
      this.questionForm = this.offerConstructService.toFormGroup(this.questions);
      if (itemDetails !== undefined) {
        this.questionForm.patchValue(itemDetails);
      }
    },
      (err) => {
        console.log(err);
      });
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
    this.offerConstructItems = [];
    this.countableItems = [];
    this.addedEgineMajorItemsInTree = [];
  }

  saveOfferConstructChanges() {

    this.downloadEnable = true;
    this.offerConstructItems = [... this.offerConstructItems];
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
        if (node.data.itemDetails !== undefined) {
          let id: ItemDetail;
          for (const key in node.data.itemDetails) {
            id = new ItemDetail();
            id.attributeName = key;
            id.attributeValue = node.data.itemDetails[key];
            id.eGenieFlag = false;
            cd.itemDetails.push(id);
          }
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
            if (child.data.itemDetails !== undefined) {
              let id: ItemDetail;
              for (const key in child.data.itemDetails) {
                id = new ItemDetail();
                id.attributeName = key;
                id.attributeValue = child.data.itemDetails[key];
                id.eGenieFlag = false;
                cd.itemDetails.push(id);
              }
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
                if (gchild.data.itemDetails !== undefined) {
                  let id: ItemDetail;
                  for (const key in gchild.data.itemDetails) {
                    id = new ItemDetail();
                    id.attributeName = key;
                    id.attributeValue = gchild.data.itemDetails[key];
                    id.eGenieFlag = false;
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

    this.offerConstructCanvasService.saveOfferConstructChanges(cds).subscribe(data => {
    },
      (error) => {
        console.log(error);
      });
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
  }
}

