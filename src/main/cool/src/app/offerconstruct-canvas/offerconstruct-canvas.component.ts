import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  Input
} from '@angular/core';
import { TreeNode, MessageService } from 'primeng/api';
import { OfferconstructCanvasService } from './service/offerconstruct-canvas.service';
import { MMItems } from './model/MMItems';
import { ActivatedRoute } from '@angular/router';
import { SubGroup } from './model/SubGroup';
import { Group } from './model/Group';
import { Groups } from '../models/groups';
import { FormGroup } from '@angular/forms';
import { OfferConstructService } from '../services/offer-construct.service';
import { ConstructDetails } from './model/ConstructDetails';
import { ConstructDetail } from './model/ConstructDetail';
import { ItemDetail } from './model/ItemDetail';

@Component({
  selector: 'app-offerconstruct-canvas',
  templateUrl: './offerconstruct-canvas.component.html',
  styleUrls: ['./offerconstruct-canvas.component.css'],
  providers: [MessageService]
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

  constructor(private cd: ChangeDetectorRef, private elRef: ElementRef, private messageService: MessageService, private _canvasService: OfferconstructCanvasService,
    private offerConstructService: OfferConstructService,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
  }

  /**
   * Called when Item is dragged into Offer Construct Tree table
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
      obj['isMajorLineItem'] = this.draggedItem.isMajorLineItem;
      this.offerConstructItems.push(this.itemToTreeNode(obj));
      this.offerConstructItems = [...this.offerConstructItems];
    }
  }

  deleteNode(node) {
    node.node.data = {};
    node.node.children = {};
    this.offerConstructItems = [...this.offerConstructItems];
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
      rowNode.node.data.lablel = rowNode.node.data.name;
      rowNode.node.data.productName = rowNode.node.data.name;
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
        rowNode.node.children.push(this.itemToTreeNode(obj));
        this.delteFromParentObject(rowNode, this.draggedItem.data);
      }

      this.offerConstructItems = [...this.offerConstructItems];
    }
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
  }

  /**
   * Create a row under Major Group Node
   * @param rowNode
   */
  createGroup(rowNode) {
    if (rowNode.node.children) {
      this.itemCount = rowNode.node.children.length;
    }
    this.showButtons = false;
    const obj = Object.create(null);
    const counter = ++this.counter;
    obj['uniqueKey'] = counter;
    obj['productName'] =
      rowNode.node.data.productName + ' ' + 'Group' + ' ' + counter;
    obj['catergoryName'] = 'Billing';
    obj['lablel'] = 'Billing';
    obj['isGroupNode'] = true;
    rowNode.node.children.push(this.itemToTreeNode(obj));
    this.offerConstructItems = [...this.offerConstructItems];
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
    this.questionForm = new FormGroup({
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

      if (res.selectedCharacteristics !== undefined && res.selectedCharacteristics.length > 0) {
        res.selectedCharacteristics.forEach(characterstic => {
          reqObj.groups.forEach((element) => {
            if (element.groupName === characterstic.group) {
              const sgrp = new SubGroup(characterstic.subgroup, characterstic.characteristics);
              element.subGroup.push(sgrp);
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
    })
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
    this.displayAddDetails = false;
    this.questionForm.reset();
    this.questions = [];
    this.showMandatoryDetails = false;
  }

  addItemDetails() {
    this.showMandatoryDetails = false;
    this.payLoad = JSON.stringify(this.questionForm.value);
    this.currentRowClicked.node.data['itemDetails'] = this.questionForm.value;
    this.closeDailog();
  }

  showAddDetailsDailog(currentNode) {
    // const productName = product;
    this.currentRowClicked = currentNode;
    let majorLineItemName;
    // Find parent Product (major item)
    while(currentNode.parent !== null) {
      // statements if the condition is true
        currentNode = currentNode.parent;
        majorLineItemName = currentNode.data.productName;
    }
    this.displayAddDetails = true;
    const groups: Groups[] = [];
    const group = new Groups(
      majorLineItemName
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
  }

  saveOfferConstructChanges() {
    this.offerConstructItems = [... this.offerConstructItems];
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
              let props = Object.keys(child.data.itemDetails);
              let id: ItemDetail;
              props.forEach((prop) => {
                id = new ItemDetail();
                id.attributeName = prop;
                id.attributeValue = child.data.itemDetails.prop;
                id.attributeType = 'Unique';
                id.existingFromEgenie = false;
                cd.itemDetails.push(id);
              });
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
                    let props = Object.keys(gchild.data.itemDetails);
                    let id: ItemDetail;
                    props.forEach((prop) => {
                      id = new ItemDetail();
                      id.attributeName = prop;
                      id.attributeValue = gchild.data.itemDetails.prop;
                      id.attributeType = 'Unique';
                      id.existingFromEgenie = false;
                      cd.itemDetails.push(id);
                    });
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

}
