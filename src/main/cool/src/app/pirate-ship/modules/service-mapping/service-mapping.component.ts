import { Component, OnInit } from '@angular/core';
import { ItemCreationService } from '@app/services/item-creation.service';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ServiceMappingService } from '@app/services/service-mapping.service';

@Component({
  selector: 'app-service-mapping',
  templateUrl: './service-mapping.component.html',
  styleUrls: ['./service-mapping.component.css']
})
export class ServiceMappingComponent implements OnInit {
  productColumns: any[];
  productDetails: TreeNode[];
  offerId: string;
  caseId: string;
  selectedOffer: string;
  selectedAto: string;
  currentOfferId: string;
  offerDropdownValues: any;
  constructor(private itemCreationService: ItemCreationService,
    private activatedRoute: ActivatedRoute, private serviceMappingService: ServiceMappingService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.offerId = params['offerId'];
      this.caseId = params['caseId'];
      this.selectedAto = params['selectedAto'];
    });
  }

  ngOnInit() {
    this.itemCreationService.getOfferDropdownValues(this.offerId).subscribe(data => {
      this.offerDropdownValues = data;
    });
    this.serviceMappingService.getServiceMappingStatus(this.offerId, this.selectedAto).subscribe(response => {
      this.productDetails = response.data;
    })
    this.productColumns = [
      { field: 'product', header: 'ATO' },
      { field: 'newItemStatus', header: 'STATUS' },
      { field: 'download', header: '' }
    ]
    // this.productDetails = [
    //   {
    //     data: {
    //       product: "CTS-MX300-K9-WS",
    //       iccType: "XaaS",
    //       productFamily: "POF000220",
    //       basePrice: "",
    //       newItemStatus: "Not Required",
    //       moduleStatus: "",
    //       existing: false
    //     },
    //     children: []
    //   },
    //   {
    //     data: {
    //       product: "HARDWARE 1CTS-MX30",
    //       iccType: "Hardware",
    //       productFamily: "POF000220",
    //       basePrice: "",
    //       newItemStatus: "Available",
    //       moduleStatus: "",
    //       existing: false
    //     },
    //     children: [
    //       {
    //         data: {
    //           product: "NETWORK-PNP-LIC",
    //           iccType: "License",
    //           productFamily: "POF000220",
    //           basePrice: "",
    //           newItemStatus: "In-Progress",
    //           moduleStatus: "",
    //           existing: true
    //         }
    //       }
    //     ]
    //   }
    // ]
  }

  downloadConfigSheet() {
    console.log('---------download config sheet---------');
    this.serviceMappingService.downloadConfigSheet(this.offerId, this.selectedAto).subscribe(element => {
    })
  }

  showSelectedAtoView(dropDownValue: string) {
    this.selectedAto = dropDownValue;
  }

}
