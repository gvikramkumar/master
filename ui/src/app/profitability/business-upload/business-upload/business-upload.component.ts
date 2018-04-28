import { Component, OnInit } from '@angular/core';

import { MatRadioChange } from '@angular/material/radio';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {Store} from '../../../store/store';

@Component({
  selector: 'fin-business-upload',
  templateUrl: './business-upload.component.html',
  styleUrls: ['./business-upload.component.scss']
})
export class BusinessUploadComponent extends RoutingComponentBase implements OnInit {

  fileName: string;
  //@Output() private changeTestEmitter: EventEmitter<MatRadioChange>;

  //for radio button list in sidebar:
  selectedRadio: string;
  //todo: these need to have role-based access (likely stored in Mongo)
  radios = [
    {value: 'AdjustmentsDollarUpload', text: 'Adjustments - Dollar Upload'},
    {value: 'IndirectAdjustmentsSplitPercentageUpload', text: 'Indirect Adjustments Split Percentage Upload'},
    {value: '', text: 'Sales Level Split Percentage Upload'},
    {value: '', text: 'Manual Mapping Split Percentage Upload'},
    {value: '', text: 'Product Classification (SW/HW Mix) Upload'}
  ];

  constructor(private store: Store, private route: ActivatedRoute) {
    super(store, route);
  }

  changeMeasure() {
  }

  ngOnInit() {
  }

}
