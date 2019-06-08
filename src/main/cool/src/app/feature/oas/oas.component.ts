import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { NgForm, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';


export class OasPrimaryFactors {

  primaryFactorName: string;
  primaryCharactertsics: OasSecondaryFactors[];

  constructor(primaryFactorName: string, primaryCharactertsics: OasSecondaryFactors[]) {
    this.primaryFactorName = primaryFactorName;
    this.primaryCharactertsics = primaryCharactertsics;
  }

}

export class OasSecondaryFactors {

  secondaryFactorName: string;
  additionalAttributes: string[];
  secondaryCharactertsics: string[];

  constructor(secondaryFactorName: string, secondaryCharactertsics: string[], additionalAttributes: string[]) {
    this.secondaryFactorName = secondaryFactorName;
    this.additionalAttributes = additionalAttributes;
    this.secondaryCharactertsics = secondaryCharactertsics;
  }

}



@Component({
  selector: 'app-oas',
  templateUrl: './oas.component.html',
  styleUrls: ['./oas.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class OasComponent implements OnInit {

  cols: any[];
  items: MenuItem[];
  activeItem: MenuItem;
  @ViewChild('f') form: NgForm;

  showDialog: boolean;
  showChallenges: boolean;

  msgs: Message[] = [];
  attribute: string;
  selectedAttribute = [];
  selectedCheckBoxValues = [];
  oasPrimaryFactorsList: OasPrimaryFactors[] = [];
  oasSecondaryFactorsList: OasSecondaryFactors[] = [];

  offerFactors: string[] = ['UnSupported Offer Factors', 'Supported Offer Factors', 'Advanced Offer Factors', 'All Offer Factors'];
  secondaryOfferFactors: string[] = ['Offer Construct', 'Commercial Set Up', 'Commercial Delivery', 'Customer Experience'];

  selectedPrimaryOffer = this.offerFactors[3];
  selectedSecondaryOffer = this.secondaryOfferFactors[0];
  oasFormGroupArray: Array<FormGroup> = new Array();

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _location: Location) {

    this.showDialog = false;
    this.showChallenges = false;

  }
/*
[
  {
    factorName: 'Offer Construct',

  }
]
*/
  ngOnInit() {


    this.selectedCheckBoxValues = ['Non Appliance', 'Manual Solution', 'Exception Applied'];
    const additionalAttributes: string[] = ['Support Services', 'Managed Services', 'Hardware', 'Consulting Services', 'Integration', 'Software'];

    const oasFactorS11 = new OasSecondaryFactors('Offer Construct', ['A1', 'AA1', 'AAA1'], additionalAttributes);
    const oasFactorS12 = new OasSecondaryFactors('Commercial Set Up', ['B1', 'BB1', 'BBB1'], additionalAttributes);
    const oasFactorS13 = new OasSecondaryFactors('Commercial Delivery', ['C1', 'CC1', 'CCC1'], additionalAttributes);
    const oasFactorS14 = new OasSecondaryFactors('Customer Experience', ['D1', 'DD1', 'DDD1'], additionalAttributes);

    const oasFactorS21 = new OasSecondaryFactors('Offer Construct', ['A2', 'AA2', 'AAA2'], additionalAttributes);
    const oasFactorS22 = new OasSecondaryFactors('Commercial Set Up', ['B2', 'BB2', 'BBB2'], additionalAttributes);
    const oasFactorS23 = new OasSecondaryFactors('Commercial Delivery', ['C2', 'CC2', 'CCC2'], additionalAttributes);
    const oasFactorS24 = new OasSecondaryFactors('Customer Experience', ['D2', 'DD2', 'DDD2'], additionalAttributes);

    const oasFactorS31 = new OasSecondaryFactors('Offer Construct', ['A3', 'AA3', 'AAA3'], additionalAttributes);
    const oasFactorS32 = new OasSecondaryFactors('Commercial Set Up', ['B3', 'BB3', 'BBB3'], additionalAttributes);
    const oasFactorS33 = new OasSecondaryFactors('Commercial Delivery', ['C3', 'CC13', 'CCC3'], additionalAttributes);
    const oasFactorS34 = new OasSecondaryFactors('Customer Experience', ['D3', 'DD3', 'DDD3'], additionalAttributes);

    const oasFactorS41 = new OasSecondaryFactors('Offer Construct', ['A4', 'AA4', 'AAA4'], additionalAttributes);
    const oasFactorS42 = new OasSecondaryFactors('Commercial Set Up', ['B4', 'BB4', 'BBB4'], additionalAttributes);
    const oasFactorS43 = new OasSecondaryFactors('Commercial Delivery', ['C4', 'CC4', 'CCC4'], additionalAttributes);
    const oasFactorS44 = new OasSecondaryFactors('Customer Experience', ['D4', 'DD4', 'DDD4'], additionalAttributes);

    const oasFactor1 = new OasPrimaryFactors('UnSupported Offer Factors', [oasFactorS11, oasFactorS12, oasFactorS13, oasFactorS14]);
    const oasFactor2 = new OasPrimaryFactors('Supported Offer Factors', [oasFactorS21, oasFactorS22, oasFactorS23, oasFactorS24]);
    const oasFactor3 = new OasPrimaryFactors('Advanced Offer Factors', [oasFactorS31, oasFactorS32, oasFactorS33, oasFactorS34]);
    const oasFactor4 = new OasPrimaryFactors('All Offer Factors', [oasFactorS41, oasFactorS42, oasFactorS43, oasFactorS44]);

    this.oasPrimaryFactorsList.push(oasFactor1, oasFactor2, oasFactor3, oasFactor4);

    console.log(this.oasPrimaryFactorsList);


    this.items = [
      { label: 'UnSupported Offer Factors', icon: 'fa fa-fw fa-bar-chart' },
      { label: 'Supported Offer Factors', icon: 'fa fa-fw fa-calendar' },
      { label: 'Advanced Offer Factors', icon: 'fa fa-fw fa-book' },
      { label: 'All Offer Factors', icon: 'fa fa-fw fa-support' }
    ];

    this.activeItem = this.items[2];

    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' }
    ];


  }
  initFormGroup(){

  }

  resetForm() {
    this.form.reset();
    this.selectedAttribute = [];
  }

  showDialogBox() {

    if (this.showDialog) {
      this.showDialog = false;
    } else {
      this.showDialog = true;
    }

    this.msgs = [];
    this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });

  }

  viewAllChallenges() {

    if (this.showChallenges) {
      this.showChallenges = false;
    } else {
      this.showChallenges = true;
    }

  }

  addAttribute(attribute) {
    this.selectedAttribute.push(attribute);
  }

  removeAttribute(attribute) {
    const index: number = this.selectedAttribute.indexOf(attribute);
    if (index !== -1) {
      this.selectedAttribute.splice(index, 1);
    }
  }

  goBack() {
    this._location.back();
  }

}
