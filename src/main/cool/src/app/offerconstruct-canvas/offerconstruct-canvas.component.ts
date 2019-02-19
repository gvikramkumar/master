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
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { OfferConstructService } from '../services/offer-construct.service';
import { ConstructDetails } from './model/ConstructDetails';
import { ConstructDetail } from './model/ConstructDetail';
import { ItemDetail } from './model/ItemDetail';
import { group } from '@angular/animations';

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
  itemCategories: any[] = [];
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
  formGroupData= [];
  mandatoryFields=[];
  formGroupDataMinorItems = [];
  count = 1;
  displayMandatory;
  toggleMandatory = true;
  myForm: FormGroup;
  countableItems:Number[] = [];
  constructor(private cd: ChangeDetectorRef, private elRef: ElementRef, private messageService: MessageService, private _canvasService: OfferconstructCanvasService,
    private offerConstructService: OfferConstructService, private offerConstructCanvasService: OfferConstructService,
    private activatedRoute: ActivatedRoute, private _fb: FormBuilder) {
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
      this.offerConstructItems.push(this.itemToTreeNode(obj));
      this.offerConstructItems = [...this.offerConstructItems];
      this.countableItems.push(this.uniqueId);
      this.updateChildCount();
    }
  }

  majorLine(){
    this.minorLineItemsActive = false;
    this.majorLineItemsActive = true;
  }

  minorLine() {
    this.majorLineItemsActive = false;
    this.minorLineItemsActive = true;
  }

  showMandatory(event, id) {
    this.toggleMandatory = this.toggleMandatory?false:true;
    this.displayMandatory = event.target.id;
    this.cd.detectChanges();
  }

  showDialog() {
    this.majorItemData = [];
    this.minorItemData = [];
    this.display = true;
    let tempObj= [];
    this.offerConstructItems = [...this.offerConstructItems]
    tempObj = null;
    this.formGroupData = [];
    this.formGroupDataMinorItems = [];
    tempObj = this.offerConstructItems;
    console.log(tempObj);
    tempObj.forEach(item => {
      if(item.parent==null){
        const majorItem = {
          productName: item.data.productName
        };
        if(item.children.length){
        let tempChildObj = []
        tempChildObj = item.children;
        tempChildObj.forEach(item => {
          if(!item.data.isGroupNode){
            const minorItem = {
              productName: item.data.productName
            }
            this.minorItemData.push(minorItem);
          }
        })
        }
        this.majorItemData.push(majorItem);
        console.log(this.majorItemData)
      }
    })
    this.displayAddDetails = true;
    let groups = [];
    for(let i=0; i<this.majorItemData.length; i++){
      let groupName = {groupName: this.majorItemData[i].productName}
      groups.push(groupName);
    }
    let minorGroups = []
    for(let i=0; i<this.minorItemData.length; i++){
      let minorGroupName = {groupName: this.minorItemData[i].productName}
      minorGroups.push(minorGroupName);
    }
    console.log(groups)
    let groupsPayload = groups;
    let m = this;
    for (let i = 0; i < minorGroups.length; i++) {
      let payLoad = {groups: [minorGroups[i]]}
      m.offerConstructService.addDetails(payLoad).subscribe(
        (data) => {
          this.formGroupDataMinorItems.push(data);
          console.log(this.formGroupDataMinorItems);
      console.log(this.questions)
      this.multipleForms = this.offerConstructService.toFormGroup(this.questions);
        }, err => console.log('error ' + err),
        () => console.log('Ok ')
      );
      }
    for (let i = 0; i < groups.length; i++) {
      let payLoadMajor = {groups: [groups[i]]}
      m.offerConstructService.addDetails(payLoadMajor).subscribe(
        (data) => {
      this.formGroupData.push(data);
      this.mandatoryFields.push(data.groups[0]);
      this.multipleForms = this.offerConstructService.toFormGroup(this.questions);
        }, err => console.log('error ' + err),
        () => console.log('Ok ')
      );
      }
      console.log(this.formGroupData);
      console.log(this.mandatoryFields);
  }

  deleteNode(node) {
    node.node.data = {};
    node.node.children = {};
    this.offerConstructItems = [...this.offerConstructItems];
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
      this.offerConstructItems.push(this.itemToTreeNode(rowNode));
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
    } else {
      if (
        rowNode.node.data['isMajorLineItem'] &&
        !this.draggedItem['isMajorLineItem']
      ) {
        if (this.draggedItem.parent !== undefined) {
          // If dragged node is a tree node,meaning the node which is moved between the canvas
          const obj = Object.create(null);
          obj['uniqueKey'] = ++this.counter;
          this.uniqueId = obj['uniqueKey'];
          obj['isGroupNode'] = false;
          obj['productName'] = this.draggedItem.data.productName;
          obj['label'] = this.draggedItem.data.label;
          obj['isMajorLineItem'] = this.draggedItem.data.isMajorLineItem;
          obj['listPrice'] = this.draggedItem.data.listPrice;
          obj['title'] = this.draggedItem.data.title?this.draggedItem.data.title: this.draggedItem.data.productName;
          rowNode.node.children.push(this.itemToTreeNode(obj));
          this.delteFromParentObject(rowNode, this.draggedItem.data);
        } else {
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
          rowNode.node.children.push(this.itemToTreeNode(obj));
        }
      }

      if (
        rowNode.node.data['isGroupNode'] &&
        !this.draggedItem['isMajorLineItem']
      ) {
        const obj = Object.create(null);
        obj['uniqueKey'] = ++this.counter;
        this.uniqueId = obj['uniqueKey'];
        obj['isGroupNode'] = false;
        obj['productName'] = this.draggedItem.data.productName;
        obj['label'] = this.draggedItem.data.label;
        obj['isMajorLineItem'] = this.draggedItem.data.isMajorLineItem;
        obj['listPrice'] = this.draggedItem.data.listPrice;
        obj['title'] = this.draggedItem.data.productName;
        rowNode.node.children.push(this.itemToTreeNode(obj));
        this.delteFromParentObject(rowNode, this.draggedItem.data);
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
      rowNode.node.children.forEach(item=> {
        if(item.data.isGroupNode === true) {
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
    obj['catergoryName'] = 'Billing';
    obj['label'] = 'Billing';
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
    this.offerConstructService.space.subscribe((val) => {
      console.log(val);
      console.log(this.offerConstructItems);
      this.offerConstructItems.forEach(item=>{
        if(item.data.productName == val[0]){
          item.data['itemDetails'] = val[1];
        }
      })
      this.offerConstructItems.forEach(value=>{
        value.children.forEach(itm=>{
          if(itm.data.productName == val[0]){
            itm.data['itemDetails'] = val[1];
            console.log('asdfafdadf ',itm);
          }
        })
      })

      this.offerConstructService.closeDialog.subscribe((val) => {
        if(val=='close'){
          this.display = false;
        }
      })

      this.offerConstructItems = [...this.offerConstructItems];
      console.log(this.offerConstructItems);
    });
    this.questionForm = new FormGroup({
    });

    this.multipleForms = new FormGroup({
    });

    // Prepare payload to fetch item categories. Obtain MM information.
    this._canvasService.getMMInfo(this.currentOfferId).subscribe((res) => {
      let reqObj: MMItems;
      reqObj = new MMItems('offerdimensions', res.offerId, res.derivedMM, []);
      if (res.selectedCharacteristics !== undefined && res.selectedCharacteristics.length > 0) {
        res.selectedCharacteristics.forEach(characterstic => {
          const found = reqObj.groups.some(function (el) {
            return el.groupName === characterstic.group;
          });

          if (!found) {
            const grp = new Group(characterstic.group, []);
            reqObj.groups.push(grp);
          } else {
            // Do nothing
          }
        });
      }

      // extract selected charecterstics
      if (res.selectedCharacteristics !== undefined && res.selectedCharacteristics.length > 0) {
        res.selectedCharacteristics.forEach(characterstic => {
          reqObj.groups.forEach((element) => {
            if (characterstic.characteristics.length > 0) {
              if (element.groupName === characterstic.group) {
                const sgrp = new SubGroup(characterstic.subgroup, characterstic.characteristics);
                element.subGroup.push(sgrp);
              }
            }
          });
        });
      }

      if (res.additionalCharacteristics !== undefined && res.additionalCharacteristics.length > 0) {
        res.additionalCharacteristics.forEach(characterstic => {
          const found = reqObj.groups.some(function (el) {
            return el.groupName === characterstic.group;
          });

          if (!found) {
            const grp = new Group(characterstic.group, []);
            reqObj.groups.push(grp);
          } else {
            // Do nothing
          }
        });
      }

      // extract additional charecterstics
      if (res.additionalCharacteristics !== undefined && res.additionalCharacteristics.length > 0) {
        res.additionalCharacteristics.forEach(characterstic => {
          reqObj.groups.forEach((element) => {
            if (characterstic.characteristics.length > 0) {
              if (element.groupName === characterstic.group) {
                const sgrp = new SubGroup(characterstic.subgroup, characterstic.characteristics);
                element.subGroup.push(sgrp);
              }
            }
          });
        });
      }

      // Call offerconstruct request to get Major/Minor Line Items
      this._canvasService.getOfferConstructItems(reqObj).subscribe((data) => {
        const itemData = data['listOfferCatagory'];
        itemData.forEach(item => {
          const itemObj = {
            categoryName: item.type,
            isMajorLineItem: item.majorLineItem,
            productName: item.type,
            listPrice: ''
          };
          this.itemCategories.push(itemObj);
        });
      });
    });

    this.itemCount = 0;

    this.cols = [
      { field: 'productName', header: 'PRODUCTS' },
      { field: 'productFamily', header: 'PRODUCT FAMILY' },
      { field: 'listPrice', header: 'LIST PRICE(USD)' }
    ];
  }

  dragStartRow($event, item) {
    this.draggedItem = item.node;
    //this.selected = [...this.selected];
  }

  dragStart(event, item: any) {
    this.draggedItem = item;
  }

  //donwnload Zip file
  downloadZip(offerId) {
    this._canvasService.downloadZip(this.currentOfferId).subscribe((res) => {
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
      let newObj = [];
      newObj = this.offerConstructItems;
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i].parent != null) {
          let uniqKey = this.selected[i].data.uniqueKey;
          for (let m = 0; m < newObj.length; m++) {
            for (let k = 0; k < newObj[m].children.length; k++) {
              if (uniqKey == newObj[m].children[k].data.uniqueKey) {
                newObj[m].children.splice(k, 1);
              }
            }
          }
        }
        if (this.selected[i].parent === null) {
          let uKey = this.selected[i].data.uniqueKey;
          for (let j = 0; j < newObj.length; j++) {
            if (uKey == newObj[j].data.uniqueKey) {
              newObj.splice(j, 1);
            }
          }
        }
      }
      this.offerConstructItems = newObj;
      this.offerConstructItems = [...this.offerConstructItems];
      this.selected = [...this.selected];
    }
    this.nodeToDelete = {};
    this.offerConstructItems = [...this.offerConstructItems];
    this.updateChildCount();
  }

  /**
   *
   * @param $event Search for PID
   */
  searchForItem(event) {
    this._canvasService.searchEgenie(event.query).subscribe ((results)=> {
      this.results = [...results];
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
    this.questionForm.reset();
    this.questions = [];
  }

  onHide() {
    this.offerConstructService.changeForm('reset');
    this.displayAddDetails = false;
    this.questionForm.reset();
    this.questions = [];
    this.showMandatoryDetails = false;
  }

  addItemDetails() {
    this.showMandatoryDetails = false;
    this.payLoad = JSON.stringify(this.questionForm.value);
    console.log(this.questionForm.value);
    this.currentRowClicked.node.data['itemDetails'] = this.questionForm.value;
    console.log(this.offerConstructItems);
    this.closeDailog();
  }

  addAllItemDetails(details) {
    this.showMandatoryDetails = false;
    this.payLoad = JSON.stringify(this.multipleForms.value);
    alert(JSON.stringify(this.multipleForms.value))
    this.currentRowClicked.node.data['itemDetails'] = this.questionForm.value;
    this.closeDailog();
  }

  showAddDetailsDailog(currentNode) {
    // const productName = product;
    this.currentRowClicked = currentNode;
    this.lineItemName = currentNode.node.data.productName;
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
    },
      (err) => {
        console.log(err);
      });
  }

  openMandatory() {
    this.showMandatoryDetails = !this.showMandatoryDetails;
  }

  discardChanges() {
    this.offerConstructItems = [];
    this.countableItems = [];
  }

  saveOfferConstructChanges() {
    this.offerConstructItems = [... this.offerConstructItems];
    console.log('this is the object', this.offerConstructItems)
    let cds: ConstructDetails  = new ConstructDetails(this.currentOfferId, []);
    this.offerConstructItems.forEach( (node) => {
      let cd:ConstructDetail;
      // check if this item is major item
      if (node.parent === null) {
        cd = new ConstructDetail();
        cd.constructItem = 'Major';
        cd.constructItemName = node.data.productName;
        cd.constructType = node.data.productName;
        cd.productFamily = node.data.productName;
        cd.groupName = [];
        if (node.data.itemDetails !== undefined) {
          let id: ItemDetail;
          for (const key in node.data.itemDetails) {
            id = new ItemDetail();
            id.attributeName = key;
            id.attributeValue = node.data.itemDetails[key];
            id.attributeType = 'Unique';
            id.existingFromEgenie = false;
            cd.itemDetails.push(id);
          };
        }
        cds.constructDetails.push(cd);
      }

      // minor items
      if (node.children !== undefined && node.children !== null) {
        node.children.forEach((child) => {
          if (!child.data.isGroupNode) {
            cd = new ConstructDetail();
            cd.constructItem = 'Minor';
            cd.constructItemName = child.data.productName;
            cd.constructType = child.data.productName;
            cd.productFamily = child.data.productName;
            cd.groupName = [];
            if (child.data.itemDetails !== undefined) {
              let id: ItemDetail;
              for (const key in child.data.itemDetails) {
                id = new ItemDetail();
                id.attributeName = key;
                id.attributeValue = child.data.itemDetails[key];
                id.attributeType = 'Unique';
                id.existingFromEgenie = false;
                cd.itemDetails.push(id);
              };
            }
            cds.constructDetails.push(cd);
          } else {
            if (child.children !== undefined && child.children !== null) {
              child.children.forEach((gchild) => {
                  cd = new ConstructDetail();
                  cd.constructItem = 'Minor';
                  cd.constructItemName = gchild.data.productName;
                  cd.constructType = gchild.data.productName;
                  cd.productFamily = gchild.data.productName;
                  cd.groupName.push(child.data.productName);
                  if (gchild.data.itemDetails !== undefined) {
                    let id: ItemDetail;
                    for (const key in gchild.data.itemDetails) {
                      id = new ItemDetail();
                      id.attributeName = key;
                      id.attributeValue = gchild.data.itemDetails[key];
                      id.attributeType = 'Unique';
                      id.existingFromEgenie = false;
                      cd.itemDetails.push(id);
                    };
                  }
                  cds.constructDetails.push(cd);
                });
              }
            }
        });
      }


    });

    this._canvasService.saveOfferConstructChanges(cds).subscribe(data => {
    },
    (error) => {
      console.log(error);
    });
  }

  /**
   * Update Count of children under each Major Line Item.
   */
  updateChildCount() {
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
              } else  {
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
