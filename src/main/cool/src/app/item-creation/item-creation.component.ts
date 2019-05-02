
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OfferDetailViewService } from '@app/services/offer-detail-view.service';
import { OfferConstructService } from '@app/services/offer-construct.service';
import { OfferconstructCanvasService } from '@app/construct/offer-construct-canvas/service/offerconstruct-canvas.service';
import { ConstructDetails } from '@app/construct/offer-construct-canvas/model/ConstructDetails';
import { ConstructDetail } from '@app/construct/offer-construct-canvas/model/ConstructDetail';
import { TreeNode } from 'primeng/api';
import * as _ from 'lodash';
import { LoaderService } from '@app/core/services/loader.service';
import { ItemCreationService } from '@app/services/item-creation.service';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.component.html',
  styleUrls: ['./item-creation.component.scss']
})
export class ItemCreationComponent implements OnInit {
  productColumns: any[];
  productDetails: TreeNode[];
  selectedCars: any[];
  selectedProductNodes: TreeNode[]; //selectedNodes3
  selectedProductNames: string;
  offerDropdownValues: any;
  offerId: string;
  caseId: string;
  selectedOffer: string;
  display: Boolean = false;
  
  offerName: string;
  offerOwner: string;

  primaryBE: string;
  derivedMM: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;

  stakeholders: any;
  stakeHolderData: any;


  public majorAndMinorInfo: any;
  public currentOfferId: any;
  public offerConstructItems: TreeNode[] = [];
  public counter: number;
  public offerInfo: any;
  public majorOfferInfo: any;
  public minorOfferInfo: any;
  public ismajorSection: boolean = true;
  public minorLineItemsActive: Boolean = false;
  public majorLineItemsActive: Boolean = false;
  public selectedTab: string;
  public onLoad: boolean;
  ind = 0;

  constructor(private router: Router, private itemCreationService: ItemCreationService,
    private activatedRoute: ActivatedRoute, private offerConstructService: OfferConstructService, 
    private stakeholderfullService: StakeholderfullService, private rightPanelService: RightPanelService,
    private loaderService: LoaderService,
    private offerDetailViewService: OfferDetailViewService,
    private offerConstructCanvasService: OfferconstructCanvasService,
    ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.offerId = params['offerId'];
      this.caseId = params['caseId'];
      this.selectedOffer = params['selectedAto'];
    });
  }

  ngOnInit() {
    this.displaySelectedOffer(this.selectedOffer);
    this.productColumns = [
      { field: 'product', header: 'PRODUCTS' },
      { field: 'iccType', header: 'ICC TYPE' },
      { field: 'productFamily', header: 'PRODUCT FAMILY' },
      { field: 'basePrice', header: 'BASE PRICE' },
      { field: 'newItemStatus', header: 'NEW ITEM STATUS' },
      { field: 'moduleStatus', header: 'ATO LEVEL STATUS' }
    ]

    // this.itemCreationService.getItemDetails(this.offerId, 'ALL').subscribe(response => {
    //   console.log('data contains '+JSON.stringify(this.offerId));
    //   this.productDetails = response.data; 
    // })

    this.itemCreationService.getOfferDropdownValues(this.offerId).subscribe(data => {
      this.offerDropdownValues = data;
    });

    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {

      this.derivedMM = offerDetails['derivedMM'];
      this.offerName = offerDetails['offerName'];
      this.primaryBE = offerDetails['primaryBEList'][0];
      this.stakeHolderData = offerDetails['stakeholders'];
      this.processStakeHolderInfo();
      this.getLeadTimeCalculation();
    });

    this.loaderService.startLoading();

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
        }
      }, () => { this.loaderService.stopLoading(); },
        () => { });

      this.offerConstructItems = [...this.offerConstructItems];
    }, () => {
      this.loaderService.stopLoading();
    }, () => {

    });



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
      }, (err) => {
        console.log(err);
        this.loaderService.stopLoading();
      },
        () => (this.createMajorMinorGroup(), this.offerDetailView()));

    });
  }
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
    });
  }

  offerDetailView() {
    // Check if construct details are availbale in the database for the current offer.
    this.offerDetailViewService.retrieveOfferDetails(this.currentOfferId).subscribe(offerDetailRes => {
      if (offerDetailRes.constructDetails.length > 0) {
        this.transformDataToTreeNode(offerDetailRes);
      }
    }, (err) => {
      console.log(err);
      this.loaderService.stopLoading();
    }, () => {
      this.loaderService.stopLoading();
    });
  }

  transformDataToTreeNode(offerDetailRes: any) {
    this.offerConstructItems = [];
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
    console.log('--------------------offerDetailRes.constructDetails', offerDetailRes.constructDetails);

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
    const tempNode = this.itemToTreeNode(obj);
    this.offerConstructItems.push(tempNode);
    this.offerConstructItems = [...this.offerConstructItems];

    if (node.eGenieFlag == false) {
      obj['uniqueNodeId'] = node.constructType + '_' + obj['uniqueKey'];
      this.getQuestionList(obj, true);
    } else {

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
    const tempNode = this.itemToTreeNode(obj);
    parentNode.children.push(tempNode);
    this.offerConstructItems = [...this.offerConstructItems];

    // set question for respective major or minor section
    if (childNode.eGenieFlag == false) {
      obj['uniqueNodeId'] = childNode.constructType + '_' + obj['uniqueKey'];
      this.getQuestionList(obj, true);
    } else {
    }
    return tempNode;
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


    let listOfferQuestions;
    listOfferQuestions = obj.itemDetails;
    const groupinfo = {
      uniqueKey: obj.uniqueKey,
      title: obj.title,
      uniqueNodeId: obj.uniqueNodeId,
      childCount: obj.childCount,
      isMajor: obj.isMajorLineItem,
      isGroupNode: obj.isGroupNode,
      groupName: obj.productName,
      eGenieFlag: false,
      listOfferQuestions: listOfferQuestions
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
    this.onLoad = true;
    this.offerInfo = this.offerConstructService.singleMultipleFormInfo;
    this.majorOfferInfo = this.offerInfo.major;
    this.minorOfferInfo = this.offerInfo.minor;

    console.log("--------------offerConstructService.singleMultipleFormInfo---------", this.offerConstructService.singleMultipleFormInfo);


    this.loaderService.stopLoading();
  }

  saveOfferConstructChanges() {

    // save  loader
    this.loaderService.startLoading();
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
          cd.itemDetails = node.data.itemDetails;
          cd.itemDetails['eGenieFlag'] = cd.eGenieFlag;
          cd.itemDetails['attributeName'] = cd.eGenieFlag;
          cd.itemDetails['eGenieExistingPid'] = cd.eGenieFlag;
        } else {
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
              cd.itemDetails = child.data.itemDetails;
              cd.itemDetails['eGenieFlag'] = cd.eGenieFlag;
              cd.itemDetails['attributeName'] = cd.eGenieFlag;
              cd.itemDetails['eGenieExistingPid'] = cd.eGenieFlag;

            } else {
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
                }
                cds.constructDetails.push(cd);
              });
            }
          }
        });
      }
    });

    console.log('cds', cds);
    /* this.offerConstructCanvasService.saveOfferConstructChanges(cds).subscribe(() => {
      this.loaderService.stopLoading();
    },
      () => {
        this.loaderService.stopLoading();
      }); */
  }


  majorSection() {
    this.ismajorSection = true;
    this.minorLineItemsActive = false;
    this.majorLineItemsActive = true;
    this.selectedTab = 'major';
  }

  minorSection() {
    this.ismajorSection = false;
    this.majorLineItemsActive = false;
    this.minorLineItemsActive = true;
    this.selectedTab = 'minor';
  }



  ngOnDestroy() {

  }

  displaySelectedOffer(dropdownValue: string) {
    this.selectedOffer = dropdownValue;
    if (dropdownValue == 'Overall Offer') {
      dropdownValue = 'ALL';
    }
    this.itemCreationService.getItemDetails(this.offerId, dropdownValue).subscribe(response => {
      this.productDetails = response.data;
    })
  }

  removeProductDetails() {
    // this.selectedProductNodes.forEach(nodeList => {
    //   if (nodeList.data.product !== undefined) {
    //     this.selectedProductNames += nodeList.data.product + ',';
    //   }
    // });
    // this.itemCreationService.removeItemDetails(this.offerId, this.selectedProductNames).subscribe(response => {
    // });
    this.productDetails = [];
  }

  goBackToOfferSetup() {
    this.router.navigate(['/offerSetup', this.offerId, this.caseId, this.selectedOffer]);
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
    this.saveOfferConstructChanges();
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
  showReviewEdit() {
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

  private processStakeHolderInfo() {

    this.stakeholders = {};

    for (let i = 0; i <= this.stakeHolderData.length - 1; i++) {
      if (this.stakeholders[this.stakeHolderData[i]['offerRole']] == null) {
        this.stakeholders[this.stakeHolderData[i]['offerRole']] = [];
      }
      this.stakeholders[this.stakeHolderData[i]['offerRole']].push({
        userName: this.stakeHolderData[i]['name'],
        emailId: this.stakeHolderData[i]['_id'] + '@cisco.com',
        _id: this.stakeHolderData[i]['_id'],
        businessEntity: this.stakeHolderData[i]['businessEntity'],
        functionalRole: this.stakeHolderData[i]['functionalRole'],
        offerRole: this.stakeHolderData[i]['offerRole'],
        stakeholderDefaults: this.stakeHolderData[i]['stakeholderDefaults']
      });
    }

  }

  private getLeadTimeCalculation() {
    this.rightPanelService.displayAverageWeeks(this.primaryBE, this.derivedMM).subscribe((leadTime) => {
      this.noOfWeeksDifference = Number(leadTime['averageOverall']).toFixed(1);
      this.loaderService.stopLoading();
      this.displayLeadTime = true;
    }, () => {
      this.noOfWeeksDifference = 'N/A';
      this.loaderService.stopLoading();
    });
  }
}
