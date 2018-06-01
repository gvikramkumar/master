import {Component, OnInit, ViewChild} from '@angular/core';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '../../../store/store';
import * as _ from 'lodash';
import {MeasureService} from "../../services/measure.service";
import {Measure} from "../../store/models/measure";
import {Submeasure} from "../../store/models/submeasure";
import {SubmeasureService} from "../../services/submeasure.service";
import {environment} from "../../../../environments/environment";
import {UtilService} from "../../../core/services/common/util";

@Component({
  selector: 'fin-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends RoutingComponentBase implements OnInit {
  measureSelection: string;
  subMeasureSelection: string;
  fiscalMonthSelection: string;
  measureList: Measure[];
  subMeasureList: Submeasure[];
  fiscalMonthList: any;
  downloadFlag : boolean=true;

  downloadTypes = [
    {value: 'mud', text: 'Manual Uploaded Data', disabled: false},
    {value: 'mmd', text: 'Manual Mapping Data', disabled: false},
    {value: 'vph', text: 'Valid Product Hierarchy', disabled: false},
    {value: 'vsh', text: 'Valid Sales Hierarchy', disabled: false}
  ];
  downloadType = this.downloadTypes[0].value;

  constructor(
    private util: UtilService,
    private route: ActivatedRoute,
    private router: Router,
    private measureService: MeasureService,
    private subMeasureService: SubmeasureService,
    private store: Store
  ) {
    super(store, route);

  }

  ngOnInit(){
    this.measureService.getMany().subscribe(data => {
      this.measureList = data;
    });

  }

 /* selectMeasureName() {
    this.subMeasureService.getManySubMeasure(this.measureSelection).subscribe(data => {
      this.subMeasureList = data;
    });
  }

  selectSubMeasureName() {
    this.reportService.getManyFiscalMonth(this.subMeasureSelection).subscribe(data => {
      this.fiscalMonthList = data;
    });
  }
*/

  selectFiscalMonth() {

    this.downloadFlag = false;
  }

  getDownloadTypeText() {
    return _.find(this.downloadTypes, {value: this.downloadType}).text;
  }

  getReport(endpoint) {
    const params = <any>{};
    switch(endpoint) {
      case 'dollar-upload':
        params.submeasureName = this.subMeasureSelection;
        params.fiscalMonth = this.fiscalMonthSelection;
        params.excelHeaders = 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Amount';
        params.excelProperties = 'fiscalMonth,submeasureName, product,sales   ,   amount';
        break;
    }
    params.excelFilename = endpoint + '.csv';
    const url = `${environment.apiUrl}/api/${endpoint}?excelDownload=true`;
    this.util.submitForm(url, params);
  }
}
