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
    'Adjustments - Dollar Upload',
    'Indirect Adjustments Split Percentage Upload',
    'Sales Level Split Percentage Upload',
    'Manual Mapping Split Percentage Upload',
    'Product Classification (SW/HW Mix) Upload'
  ];

  constructor(private store: Store, private route: ActivatedRoute) {
    super(store, route);
  }

  changeMeasure() {
  }

  ngOnInit() {
  }

}
