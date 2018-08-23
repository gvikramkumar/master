import { Component, OnInit } from '@angular/core';
import {UiUtil} from '../../../core/services/ui-util';
import {DialogType} from '../../../core/models/ui-enums';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'fin-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private uiUtil: UiUtil) { }

  ngOnInit() {
    this.downloadReport();
  }

  downloadReport() {
    const url = `${environment.apiUrl}/api/prof/report/call-method/reportTest`;
    console.log(url);
    UiUtil.submitForm(url, {});
  }




}
