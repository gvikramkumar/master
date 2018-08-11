import { Component, OnInit } from '@angular/core';
import {UiUtil} from '../../../core/services/ui-util';
import {DialogType} from '../../../core/models/ui-enums';

@Component({
  selector: 'fin-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private uiUtil: UiUtil) { }

  ngOnInit() {
  }





}
