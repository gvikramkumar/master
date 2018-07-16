import { Component, OnInit } from '@angular/core';
import {UiUtil} from '../../../core/services/ui-util';
import {DialogType} from '../../../core/models/ui-enums';

@Component({
  selector: 'fin-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  items = [
    {name: 'one', value: 1},
    {name: 'two', value: 2},
    {name: 'three', value: 3},
    {name: 'one', value: 1},
    {name: 'two', value: 2},
    {name: 'three', value: 3},
    {name: 'one', value: 1},
    {name: 'two', value: 2},
    {name: 'three', value: 3},
  ]
  results;

  constructor(private uiUtil: UiUtil) { }

  ngOnInit() {
  }

  doit() {
    this.uiUtil.genericDialog('My message fddsafdsa fasd fa dsf dsaf', DialogType.yesNo)
      .subscribe(resp => {
        if (resp) {
          this.results = 'submit';
        } else {
          this.results = 'cancel';
        }
      })
  }

}
