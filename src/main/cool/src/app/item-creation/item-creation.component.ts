import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ItemCreationService } from '@app/services/item-creation.service';
import { OfferConstructService } from '@app/services/offer-construct.service';

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
  offerDropdownValues: any;
  offerId: string;
  caseId: string;
  selectedOffer: string;
  expanded: Boolean;
  display:Boolean = false;
  constructor(private router: Router, private itemCreationService: ItemCreationService, 
    private activatedRoute: ActivatedRoute,private offerConstructService:OfferConstructService) {
    this.activatedRoute.params.subscribe(params => {
      this.caseId = params['caseId'];
      this.offerId = params['offerId'];
      this.selectedOffer = params['selectedOffer'];
    });
  }

  ngOnInit() {
    this.productColumns = [
      { field: 'product', header: 'PRODUCTS' },
      { field: 'iccType', header: 'ICC TYPE' },
      { field: 'productFamily', header: 'PRODUCT FAMILY' },
      { field: 'basePrice', header: 'BASE PRICE' },
      { field: 'newItemStatus', header: 'NEW ITEM STATUS' },
      { field: 'moduleStatus', header: 'ATO LEVEL STATUS' }
    ]

    //this.offerId, this.offerType
    this.itemCreationService.getItemDetails('COOL_7047', 'ALL').subscribe(response => {
      console.log('data contains '+JSON.stringify(this.offerId));
      this.productDetails = response.data; 
    })

    this.itemCreationService.getOfferDropdownValues('COOL_7047').subscribe(data => {
       this.offerDropdownValues = data;  
    });
  }

  displaySelectedOffer(dropdownValue: string) {
    this.selectedOffer = dropdownValue;
    this.itemCreationService.getItemDetails('COOL_7047', dropdownValue).subscribe(response => {
      console.log('data contains '+JSON.stringify(this.offerId));
      this.productDetails = response.data;
    })
  }

  offerSetupOverView() {
    this.router.navigate(['/offer-setup', this.offerId, this.caseId, this.selectedOffer]);
  }
  showReviewEdit(){
    /* const offerInfo = this.offerConstructService.singleMultipleFormInfo;
    const majorOfferInfo = [];
    const minorOfferInfo = [];

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

    this.offerConstructService.itemlengthList = { major: majorLength, minor: minorLength }; */
    
    this.display = true;
    this.offerConstructService.closeAddDetails = true;
  }
  goBack(){
    
  }
}
