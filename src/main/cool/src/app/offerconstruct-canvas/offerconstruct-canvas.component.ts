import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  Input
} from '@angular/core';
import { TreeNode, MessageService } from 'primeng/api';
import { OfferconstructCanvasService } from './service/offerconstruct-canvas.service';
import { MMItems } from './model/MMItems';
import { ResolveEnd, ActivatedRoute } from '@angular/router';
import { SubGroup } from './model/SubGroup';
import { DOCUMENT } from '@angular/common';
import { Group } from './model/Group';
import { Groups } from '../models/groups';
import { FormGroup } from '@angular/forms';
import { OfferConstructService } from '../services/offer-construct.service';

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
    // if(this.draggedItem.parent){
    //   if(this.draggedItem.parent.children){
    //     this.itemCount = this.draggedItem.parent.children.length;
    //   }
    // }
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
    console.log('here');
    console.log(node);
    node.node.data = {};
    node.node.children = {};
    this.offerConstructItems = [...this.offerConstructItems];
  }

  enableEdit() {

    // for(let i=0; i<document.getElementsByClassName("new").length; i++){
    // var x = document.getElementsByClassName("new")[i].id;
    // this.buttonId = x;
    // if(id === this.buttonId){
    //   this.showButtons = true;
    // } else {
    //   this.showButtons = false;
    // }

    // }


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
      console.log('daaaaataaaa');
      console.log(rowNode);
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
    console.log('here');
    console.log(rowNode.node.data.uniqueKey);
    console.log(this.draggedItem.parent);
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
          console.log('node with parent');
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
          console.log('node with out parent');
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
        console.log(obj);
        rowNode.node.children.push(this.itemToTreeNode(obj));
        this.delteFromParentObject(rowNode, this.draggedItem.data);
      }

      this.offerConstructItems = [...this.offerConstructItems];

      console.log(this.offerConstructItems);
    }
  }

  /**
   * Delete child object when moving from one row to another
   * @param rowNode
   * @param child
   */
  delteFromParentObject(rowNode, child) {
    console.log(this.draggedItem);
    let tempChildArray = this.draggedItem.parent.children;
    console.log(tempChildArray);
    let index = -1;
    for (let i = 0; i < tempChildArray.length; i++) {
      if (
        this.draggedItem.data.uniqueKey === tempChildArray[i].data.uniqueKey
      ) {
        console.log(tempChildArray[i]);
        index = i;
        console.log(index);
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
    console.log(rowNode);
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
    this._canvasService.getMMInfo(this.currentOfferId).subscribe((res) => {

      console.log(res);

      let reqObj: MMItems;
      reqObj = new MMItems('offerdimensions', res.offerId, res.derivedMM, []);
      // console.log(JSON.stringify(obj));


      if (res.selectedCharacteristics !== undefined && res.selectedCharacteristics.length > 0) {
        res.selectedCharacteristics.forEach(characterstic => {
          // console.log(characterstic);
          let found = reqObj.groups.some(function (el) {
            return el.groupName === characterstic.group;
          });

          if (!found) {
            let grp = new Group(characterstic.group, []);
            reqObj.groups.push(grp);
          } else {

          }
        });
      }

      if (res.selectedCharacteristics !== undefined && res.selectedCharacteristics.length > 0) {
        res.selectedCharacteristics.forEach(characterstic => {
          console.log(characterstic);

          reqObj.groups.forEach((element) => {
            if (element.groupName === characterstic.group) {
              let sgrp = new SubGroup(characterstic.subgroup, characterstic.characteristics);
              element.subGroup.push(sgrp);
            }
          });

        });
      }

      console.log(JSON.stringify(reqObj));

      // call offerconstruct request
      this._canvasService.getOfferConstructItems(reqObj).subscribe((data) => {
        console.log(data);
      });
    });
    this.itemCount = 0;
    const obj = {
      categoryName: 'HARDWARE',
      isMajorLineItem: true,
      productName: 'hardware',
      listPrice: ''
    };
    const obj2 = {
      categoryName: 'MINOR LINE BUNDLE',
      productName: 'minor-line-bundle',
      isMajorLineItem: false,
      listPrice: '23233'
    };
    const obj3 = {
      categoryName: 'XAAS',
      isMajorLineItem: true,
      productName: 'xaas',
      listPrice: ''
    };
    const obj4 = {
      categoryName: 'SOFTWARE',
      isMajorLineItem: true,
      productName: 'software',
      listPrice: ''
    };
    const obj5 = {
      categoryName: 'SUBSCRIPTIONS',
      isMajorLineItem: true,
      productName: 'subscriptions',
      listPrice: ''
    };

    this.itemCategories.push(obj);
    this.itemCategories.push(obj2);
    this.itemCategories.push(obj3);
    this.itemCategories.push(obj4);
    this.itemCategories.push(obj5);

    this.cols = [
      { field: 'productName', header: 'PRODUCTS' },
      { field: 'productFamily', header: 'PRODUCT FAMILY' },
      { field: 'listPrice', header: 'LIST PRICE(USD)' }
    ];
  }

  dragStartRow($event, item) {
    console.log(item);
    this.draggedItem = item.node;
  }

  dragStart(event, item: any) {
    // console.log(item);
    this.draggedItem = item;
  }

  downloadCsv() {
  }

  removeSelected(node) {
    console.log(node);
    console.log(this.selected);
    if (this.selected.length) {
      this.selected = this.selected.slice(this.selected.length);
      //this.selected = [];
      this.offerConstructItems.push(this.itemToTreeNode(this.selected));
      this.offerConstructItems = [...this.offerConstructItems];
      this.selected = [...this.selected];

    }
    //empty your array
    // this.nodeToDelete = {};
    // this.offerConstructItems = [...this.offerConstructItems];
  }

  nodeSelect(event) {
    console.log(event)
    this.messageService.add({ severity: 'info', summary: 'Node Selected', detail: event.node.data.name });
  }

  nodeUnselect(event) {
    this.messageService.add({ severity: 'info', summary: 'Node Unselected', detail: event.node.data.name });
  }

  selectNodeToRemove(node) {
    // node.node.data = {};
    // node.node.children = {};
    console.log(node);
    this.nodeToDelete = node;
    // node = {}
    this.offerConstructItems = [...this.offerConstructItems];
  }

  /**
   *
   * @param $event Search for PID
   */
  searchForItem($event) { }

  drop(event, rowdata) {
    rowdata.node.children.push(this.draggedItem);
    this.offerConstructItems = [...this.offerConstructItems];
  }

  dragEnd(event) {
    this.draggedItem = null;
    console.log(this.offerConstructItems);
  }

  toggleSidebar() {
    this.expandView = !this.expandView;
  }

  addMore() {
    console.log('addmore');
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
    console.log(this.payLoad);
    console.log(this.currentRowClicked);
    this.currentRowClicked.node.data['itemDetails'] = this.questionForm.value;
    console.log(this.offerConstructItems);
    this.closeDailog();
  }

  showAddDetailsDailog(currentNode) {
    // const productName = product;
    this.currentRowClicked = currentNode;
    console.log(currentNode);
    let majorLineItemName;
    // Find parent Product (major item)
    while(currentNode.parent !== null) {
      // statements if the condition is true 
        currentNode = currentNode.parent;
        majorLineItemName = currentNode.data.productName;
    }
    console.log(majorLineItemName);
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

  saveOfferConstructChanges() {
    const constructDetails: any[] = [];
    const constructDetailsPayload = {};

    this._canvasService.saveOfferConstructChanges(constructDetailsPayload).subscribe(data => {
    });
  }

}
