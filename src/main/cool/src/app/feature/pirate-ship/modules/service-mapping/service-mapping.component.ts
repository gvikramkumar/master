import { Component, OnInit } from '@angular/core';
import { ItemCreationService } from '@app/services/item-creation.service';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ServiceMappingService } from '@app/services/service-mapping.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { LoaderService } from '@app/core/services/loader.service';
import { ConfigurationService } from '@app/core/services/configuration.service';

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
  derivedMM: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;
  stakeHolderData: any;
  offerName: string;
  primaryBE: string;
  stakeholders: any;
  isPirateShipSubModule: Boolean;
  pirateShipModuleName: string;
  functionalRole: Array<String>;
  permission: Boolean = false;
  constructor(private itemCreationService: ItemCreationService,
    private activatedRoute: ActivatedRoute, private serviceMappingService: ServiceMappingService,
    private stakeholderfullService: StakeholderfullService, private rightPanelService: RightPanelService,
    private loaderService: LoaderService, private configurationService: ConfigurationService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.offerId = params['offerId'];
      this.caseId = params['caseId'];
      this.selectedAto = params['selectedAto'];
    });
  }

  ngOnInit() {
    // Initialize TaskBar Parameters
    this.isPirateShipSubModule = true;
    this.pirateShipModuleName = 'Service Mapping Dashboard';
    this.functionalRole = this.configurationService.startupData.functionalRole;
    if (this.functionalRole.includes('CXPM')) {
      this.permission = true;
    }
    this.itemCreationService.getOfferDropdownValues(this.offerId).subscribe(data => {
      this.offerDropdownValues = data;
    });
    this.getServiceMappingStatus(this.offerId, this.selectedAto);
    this.productColumns = [
      { field: 'product', header: 'ATO\'S' },
      { field: 'newItemStatus', header: 'STATUS' },
      { field: 'download', header: '' }
    ]
    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {
      this.derivedMM = offerDetails['derivedMM'];
      this.offerName = offerDetails['offerName'];
      this.primaryBE = offerDetails['primaryBEList'][0];
      this.stakeHolderData = offerDetails['stakeholders'];
      this.processStakeHolderInfo();
      this.getLeadTimeCalculation();
    });
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

  private getServiceMappingStatus(offerId, ato) {
    this.serviceMappingService.getServiceMappingStatus(offerId, ato).subscribe(response => {
      this.productDetails = response.data;
    });
  }

  downloadATODetails(productData) {
    productData['newItemStatus'] = 'Completed';
    this.serviceMappingService.downloadConfigSheet(this.offerId, productData['product']).subscribe(element => {
    });
  }

  showSelectedAtoView(dropDownValue: string) {
    this.selectedAto = dropDownValue;
    this.getServiceMappingStatus(this.offerId, dropDownValue);
  }

}
