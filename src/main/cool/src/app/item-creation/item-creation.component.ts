import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
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
  offerDropdownValues: any;
  offerId: string;
  caseId: string;
  selectedOffer: string;
  expanded: Boolean;
  constructor(private router: Router, private itemCreationService: ItemCreationService, private activatedRoute: ActivatedRoute) {
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
    this.itemCreationService.getItemDetails(this.offerId, 'ALL').subscribe(response => {
      console.log('data contains '+JSON.stringify(this.offerId));
      this.productDetails = response.data; 
    })

    this.itemCreationService.getOfferDropdownValues(this.offerId).subscribe(data => {
       this.offerDropdownValues = data;  
    });
  }

  displaySelectedOffer(dropdownValue: string) {
    this.selectedOffer = dropdownValue;
    this.itemCreationService.getItemDetails(this.offerId, dropdownValue).subscribe(response => {
      console.log('data contains '+JSON.stringify(this.offerId));
      this.productDetails = response.data;
    })
  }

  offerSetupOverView() {
    this.router.navigate(['/offer-setup', this.offerId, this.caseId, this.selectedOffer]);
  }

  goBack(){
    
  }
}
