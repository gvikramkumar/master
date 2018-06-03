import {Component, OnInit} from '@angular/core';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '../../../store/store';
import {MeasureService} from "../../../core/services/measure.service";
import {Measure} from "../../store/models/measure";
import {Submeasure} from "../../store/models/submeasure";
import {SubmeasureService} from "../../../core/services/submeasure.service";
import {DollarUploadService} from '../../services/dollar-upload.service';
import {MappingUploadService} from '../../services/mapping-upload.service';
import {environment} from '../../../../environments/environment';
import {UtilService} from '../../../core/services/util.service';
import * as _ from 'lodash';

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

  reports = [
    {
      type: 'dollar-upload', hasFiscalMonth: true, text: 'Manual Uploaded Data', disabled: false,
      filename: 'manual_uploaded_data',
      excelHeaders: 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Amount',
      excelProperties: 'fiscalMonth, submeasureName, product, sales, amount'
    },
    {
      type: 'mapping-upload', hasFiscalMonth: true, text: 'Manual Mapping Data', disabled: false,
      filename: 'manual_mapping_data',
      excelHeaders: 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Percentage',
      excelProperties: 'fiscalMonth, submeasureName, product, sales, percentage'
    },
    {
      type: 'product-hierarchy', hasFiscalMonth: false, text: 'Valid Product Hierarchy', disabled: false,
      filename: 'product_hierarchy',
      excelHeaders: 'Item Key, Product ID, Base Product ID, Goods or Service Type',
      excelProperties: 'item_key, product_id, base_product_id, goods_or_service_type'
    },
    {
      type: 'sales-hierarchy', hasFiscalMonth: false, text: 'Valid Sales Hierarchy', disabled: false,
      filename: 'sales_hierarchy',
      excelHeaders: 'Sales Territory Key, l0 Name Code, l1 Name Code',
      excelProperties: 'sales_territory_key, l0_sales_territory_name_code, l1_sales_territory_name_code'
    }
  ];
  report = this.reports[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private measureService: MeasureService,
    private subMeasureService: SubmeasureService,
    private dollarUploadService: DollarUploadService,
    private mappingUploadService: MappingUploadService,
    private util: UtilService,
    private store: Store
  ) {
    super(store, route);
  }

  ngOnInit() {
    this.measureService.getMany().subscribe(measures => {
      this.measures = _.sortBy(measures, 'name');
    });
    this.reset();
  }

  reset() {
    this.measureName = undefined;
    this.submeasureName = undefined;
    this.fiscalMonth = undefined;
    this.submeasures = [];
    this.fiscalMonths = [];
    this.disableDownload = true;
  }

  measureSelected() {
    this.disableDownload = true;
    this.submeasureName = undefined;
    this.fiscalMonth = undefined;
    this.submeasures = [];
    this.fiscalMonths = [];
    this.subMeasureService.getMany({measureName: this.measureName})
      .subscribe(submeasures => this.submeasures = _.sortBy(submeasures, 'name'));
  }

  submeasureSelected() {
    if (this.report.hasFiscalMonth) {
      this.disableDownload = true;
      this.fiscalMonth = undefined;
      this.fiscalMonths = [];
      let obs;
      switch (this.report.type) {
        case 'dollar-upload':
          obs = this.dollarUploadService.getDistinct('fiscalMonth',
            {submeasureName: this.submeasureName});
          break;
        case 'mapping-upload':
          obs = this.mappingUploadService.getDistinct('fiscalMonth',
            {submeasureName: this.submeasureName});
          break;
      }
      obs.subscribe(fiscalMonths => this.fiscalMonths = _.sortBy(fiscalMonths, _.identity).reverse().slice(0,24));
    } else {
      this.disableDownload = false;
    }
  }

  fiscalMonthSelected() {
    this.disableDownload = false;
  }

  getFilename() {
    if (this.report.hasFiscalMonth) {
      return this.report.filename + `_${_.snakeCase(this.submeasureName)}_${this.fiscalMonth}.csv`;
    } else {
      return this.report.filename + `_${_.snakeCase(this.submeasureName)}.csv`;
    }
  }

  downloadReport() {
    const params = <ReportSettings>{
      submeasureName: this.submeasureName,
      excelFilename: this.getFilename(),
      excelHeaders: this.report.excelHeaders,
      excelProperties: this.report.excelProperties
    };

    if (this.report.hasFiscalMonth) {
      params.fiscalMonth = this.fiscalMonth;
    }
    const url = `${environment.apiUrl}/api/pft/report/${this.report.type}`;
    this.util.submitForm(url, params);
  }

}

