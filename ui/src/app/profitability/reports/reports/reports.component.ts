import {Component, OnInit, ViewChild} from '@angular/core';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '../../../store/store';
import * as _ from 'lodash';
import {MeasureService} from "../../../core/services/measure.service";
import {Measure} from "../../store/models/measure";
import {Submeasure} from "../../store/models/submeasure";
import {SubmeasureService} from "../../../core/services/submeasure.service";
import {environment} from "../../../../environments/environment";
import {UtilService} from "../../../core/services/util.service";
import {DollarUploadService} from '../../services/dollar-upload.service';
import {MappingUploadService} from '../../services/mapping-upload.service';

interface ReportSettings {
  submeasureName: string,
  fiscalMonth?: number,
  excelFilename: string,
  excelProperties: string,
  excelHeaders: string
}

@Component({
  selector: 'fin-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends RoutingComponentBase implements OnInit {
  measureName: string;
  submeasureName: string;
  fiscalMonth: number;
  measures: Measure[];
  submeasures: Submeasure[];
  fiscalMonths: any;
  disableDownload = true;
  isFiscalMonthDownload = false;

  downloadTypes = [
    {value: 'mud', text: 'Manual Uploaded Data', endpoint: 'dollar-upload', disabled: false},
    {value: 'mmd', text: 'Manual Mapping Data', endpoint: 'mapping-upload', disabled: false},
    {value: 'vph', text: 'Valid Product Hierarchy', disabled: false},
    {value: 'vsh', text: 'Valid Sales Hierarchy', disabled: false}
  ];
  downloadType = this.downloadTypes[0];

  constructor(
    private util: UtilService,
    private route: ActivatedRoute,
    private router: Router,
    private measureService: MeasureService,
    private subMeasureService: SubmeasureService,
    private dollarUploadService: DollarUploadService,
    private mappingUploadService: MappingUploadService,
    private store: Store
  ) {
    super(store, route);
  }

  ngOnInit() {
    this.measureService.getMany().subscribe(data => {
      this.measures = data;
    });
   this.reset();
  }

  reset() {
    console.log('reset')
    this.measureName = undefined;
    this.submeasureName = undefined;
    this.fiscalMonth = undefined;
    this.submeasures = [];
    this.fiscalMonths = [];
    this.disableDownload = true;
    this.isFiscalMonthDownload = _.includes(['mud', 'mmd'], this.downloadType.value)
  }

  measureSelected() {
    this.disableDownload = true;
    this.submeasureName = undefined;
    this.fiscalMonth = undefined;
    this.submeasures = [];
    this.fiscalMonths = [];
    this.subMeasureService.getMany({measureName: this.measureName})
      .subscribe(submeasures => this.submeasures = submeasures);
  }

  submeasureSelected() {
    if (this.isFiscalMonthDownload) {
      this.disableDownload = true;
      this.fiscalMonth = undefined;
      this.fiscalMonths = [];
      let obs;
      switch (this.downloadType.value) {
        case 'mud':
          obs = this.dollarUploadService.getDistinct('fiscalMonth',
            {submeasureName: this.submeasureName});
          break;
        case 'mmd':
          obs = this.mappingUploadService.getDistinct('fiscalMonth',
            {submeasureName: this.submeasureName});
          break;
      }
      obs.subscribe(fiscalMonths => this.fiscalMonths = fiscalMonths);
    } else {
      this.disableDownload = false;
    }
  }

  fiscalMonthSelected() {
    this.disableDownload = false;
  }

  getReport() {
    const endpoint = this.downloadType.endpoint;
    const params = <ReportSettings>{
      submeasureName: this.submeasureName,
      excelFilename: endpoint + '.csv'
    };

    if (this.isFiscalMonthDownload) {
      params.fiscalMonth = this.fiscalMonth;
    }
    switch (this.downloadType.value) {
      case 'mud':
        params.excelHeaders = 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Amount';
        params.excelProperties = 'fiscalMonth, submeasureName, product, sales, amount';
        break;
      case 'mmd':
        params.excelHeaders = 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Percentage';
        params.excelProperties = 'fiscalMonth, submeasureName, product, sales, percentage';
        break;
    }
    const url = `${environment.apiUrl}/api/${endpoint}?excelDownload=true`;
    this.util.submitForm(url, params);
  }

}
