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

  reports: any[] = [
    {
      type: 'dollar-upload', hasFiscalMonth: true, text: 'Manual Uploaded Data', disabled: false,
      filename: 'manual_uploaded_data',
      excelHeaders: 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Legal Entity, Int Business Entity, SCMS, Amount',
      excelProperties: 'fiscalMonth, submeasureName, product, sales, legalEntity, intBusinessEntity, scms, amount'
    },
    {
      type: 'mapping-upload', hasFiscalMonth: true, text: 'Manual Mapping Data', disabled: false,
      filename: 'manual_mapping_data',
      excelHeaders: 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Legal Entity, Int Business Entity, SCMS, Percentage',
      excelProperties: 'fiscalMonth, submeasureName, product, sales, legalEntity, intBusinessEntity, scms, percentage'
    },
    {
      type: 'product-hierarchy', text: 'Valid Product Hierarchy', disabled: false,
      filename: 'product_hierarchy.csv',
      excelHeaders: 'Technology Group, Business Unit, Product Family',
      excelProperties: 'technology_group_id, business_unit_id, product_family_id'
    },
    {
      type: 'sales-hierarchy', text: 'Valid Sales Hierarchy', disabled: false,
      filename: 'sales_hierarchy.csv',
      excelHeaders: 'Sales Territory 1, Sales Territory 2, Sales Territory 3, Sales Territory 4, ' +
      'Sales Territory 5, Sales Territory 6',
      excelProperties: 'l1_sales_territory_descr, l2_sales_territory_descr, l3_sales_territory_descr,' +
      'l4_sales_territory_descr, l5_sales_territory_descr, l6_sales_territory_descr'
    },
    {
      type: 'department-mapping', hasSubmeasure: true, text: 'Department Mapping Report', disabled: false,
      filename: 'department_mapping_data',
      excelHeaders: 'Measure Name, *Sub-Measure Name, Sub Measure Description, Sub Measure Key, ' +
      'Department Code, Start Account, End Account, Report Level 1, Report Level 2, Report Level 3',
      excelProperties: 'l1_sales_territory_descr, l2_sales_territory_descr, l3_sales_territory_descr,' +
      'l4_sales_territory_descr, l5_sales_territory_descr, l6_sales_territory_descr, l6_sales_territory_descr,'+
        'l6_sales_territory_descr, l6_sales_territory_descr, l6_sales_territory_descr'
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
    if (this.report.hasSubmeasure || this.report.hasFiscalMonth) {
      this.disableDownload = true;
    } else {
      this.disableDownload = false;
    }
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
    } else if (this.report.hasSubmeasure) {
      return this.report.filename + `_${_.snakeCase(this.submeasureName)}.csv`;
    } else {
      return this.report.filename;
    }
  }

  downloadReport() {
    const params = <ReportSettings>{
      excelFilename: this.getFilename(),
      excelHeaders: this.report.excelHeaders,
      excelProperties: this.report.excelProperties
    };

    if (this.report.hasSubmeasure || this.report.hasFiscalMonth) {
      params.submeasureName = this.submeasureName;
    }

    if (this.report.hasFiscalMonth) {
      params.fiscalMonth = this.fiscalMonth;
    }
    const url = `${environment.apiUrl}/api/pft/report/${this.report.type}`;
    this.util.submitForm(url, params);
  }

}

