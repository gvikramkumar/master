import { Component, OnInit } from '@angular/core';
import {UiUtil} from '../../../../core/services/ui-util';
import {DialogType} from '../../../../core/models/ui-enums';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'fin-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
val: string;
  /*
  sel;
  items = [
    {name: 'dank', age: 50},
    {name: 'carl', age: 60},
  ]
*/

  constructor(private uiUtil: UiUtil) { }

  ngOnInit() {
  }

  doit() {
    // console.log('sel', this.sel);
  }



}
