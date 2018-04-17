import { Component, OnInit } from '@angular/core';

import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'fin-business-upload',
  templateUrl: './business-upload.component.html',
  styleUrls: ['./business-upload.component.scss']
})
export class BusinessUploadComponent implements OnInit {

  fileName: string;

  _opened: boolean = true;
  _mode: string = 'push';
  //@Output() private changeTestEmitter: EventEmitter<MatRadioChange>;

  //for radio button list in sidebar:
  selectedRadio: string;
  //todo: these need to have role-based access (likely stored in Mongo)
  radios = [
    'Adjustments - Dollar Upload',
    'Indirect Adjustments Split Percentage Upload',
    'Sales Level Split Percentage Upload',
    'Manual Mapping Split Percentage Upload',
    'Product Classification (SW/HW Mix) Upload'
  ];

  constructor() { }

  changeMeasure() {
    //Runs whenever new radio button is selected (new measure selected)
    console.log("current value: " + this.selectedRadio);
  }

  ngOnInit() {
  }

}
