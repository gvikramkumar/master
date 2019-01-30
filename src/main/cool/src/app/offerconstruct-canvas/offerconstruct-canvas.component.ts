import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { OfferconstructCanvasService } from './service/offerconstruct-canvas.service';
import { MMItems } from './model/MMItems';
import { ResolveEnd, ActivatedRoute } from '@angular/router';
import { SubGroup } from './model/SubGroup';
import { Group } from './model/Group';
import { Groups } from '../models/groups';
import { FormGroup } from '@angular/forms';
import { OfferConstructService } from '../services/offer-construct.service';

@Component({
  selector: 'app-offerconstruct-canvas',
  templateUrl: './offerconstruct-canvas.component.html',
  styleUrls: ['./offerconstruct-canvas.component.css']
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
  displayAddDetails: Boolean = false;
  addDetails;
  hardwareName;
  @Input() questions: any[] = [];
  payLoad = '';

  constructor(
    private cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private _canvasService: OfferconstructCanvasService,
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
      obj['productName'] = this.draggedItem.productName;
      obj['isGroupNode'] = false;
      obj['label'] = this.draggedItem.label;
      obj['isMajorLineItem'] = this.draggedItem.isMajorLineItem;
      this.offerConstructItems.push(this.itemToTreeNode(obj));
      this.offerConstructItems = [...this.offerConstructItems];
    }
  }

  deleteNode(node) {
    console.log(node);
    node.node.data = {};
    node.node.children = {};
    this.offerConstructItems = [...this.offerConstructItems];
  }

  enableEdit() {
    this.editData = false;
    this.showButtons = true;
    this.cd.detectChanges();
  }

  saveData(rowNode) {
    console.log('daaaaataaaa');
    console.log(rowNode);
    rowNode.node.data.catergoryName = rowNode.node.data.name;
    rowNode.node.data.lablel = rowNode.node.data.name;
    rowNode.node.data.productName = rowNode.node.data.name;
    this.showButtons = false;
    this.offerConstructItems.push(this.itemToTreeNode(rowNode));
    this.offerConstructItems = [...this.offerConstructItems];
    this.cd.detectChanges();
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

    console.log(rowNode);
    console.log(this.draggedItem);
    if (
      rowNode.node.data['isMajorLineItem'] &&
      !this.draggedItem['isMajorLineItem']
    ) {
      if (this.draggedItem.parent !== undefined) {
        console.log('node with parent');
        // If dragged node is a tree node,meaning the node which is moved between the canvas
        const obj = Object.create(null);
        obj['uniqueKey'] = ++this.counter;
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

  ngOnInit() {
    this.questionForm = this.offerConstructService.toFormGroup(this.questions);
    // call service to get catergories
    this._canvasService.getMMInfo(this.currentOfferId).subscribe((res) => {

      console.log(res);

      let reqObj: MMItems;
      reqObj  =  new MMItems('offerdimensions',res.offerId,res.derivedMM,[]);
      // console.log(JSON.stringify(obj));


      if (res.selectedCharacteristics !== undefined && res.selectedCharacteristics.length > 0 ) {
        res.selectedCharacteristics.forEach(characterstic => {
          // console.log(characterstic);
          let found = reqObj.groups.some(function (el) {
            return el.groupName === characterstic.group;
          });

          if (!found) {
            let grp = new Group(characterstic.group,[]);
             reqObj.groups.push(grp);
          } else {

          }
          });
        }

        if (res.selectedCharacteristics !== undefined && res.selectedCharacteristics.length > 0 ) {
          res.selectedCharacteristics.forEach(characterstic => {
            console.log(characterstic);

            reqObj.groups.forEach ((element) => {
              if (element.groupName === characterstic.group) {
                let sgrp = new SubGroup(characterstic.subgroup,characterstic.characteristics);
                element.subGroup.push(sgrp);
              }
            });

            });
          }

        console.log(JSON.stringify(reqObj));

        // call offerconstruct request
        this._canvasService.getOfferConstructItems(reqObj).subscribe( (data) => {
          console.log(data);
        });
    });



    const obj = {
      categoryName: 'Hardware',
      isMajorLineItem: true,
      productName: 'hardware',
      listPrice: ''
    };
    const obj2 = {
      categoryName: 'something-minor',
      productName: 'something-minor',
      isMajorLineItem: false,
      listPrice: '23233'
    };
    const obj3 = {
      categoryName: 'XAAS',
      isMajorLineItem: true,
      productName: 'XAAS',
      listPrice: ''
    };
    this.itemCategories.push(obj);
    this.itemCategories.push(obj2);
    this.itemCategories.push(obj3);
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

  /**
   *
   * @param $event Search for PID
   */
  searchForItem($event) {}

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
  }

  addItemDetails() {
    console.log('called submit method', this.questionForm);
    this.payLoad = JSON.stringify(this.questionForm.value);
    console.log(this.payLoad);
    this.closeDailog();
  }

  showAddDetailsDailog(hardware) {
    const hardwareName = hardware;
    this.displayAddDetails = true;
    const groups: Groups[] = [];
    const group = new Groups(
      hardwareName
    );
    groups.push(group);
    console.log(groups);
    const groupsPayload = {groups};
    this.offerConstructService.addDetails(groupsPayload).subscribe((data) => {
    this.addDetails = data;
      console.log(this.addDetails);
      this.addDetails.groups[0].listOfferQuestions.forEach(element => {
        const quesion = element;
        this.questions.push(quesion);
      });
      console.log(this.questions);
    },
      (err) => {
        console.log(err);
      });
  }
}
