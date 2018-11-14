import {Component, OnInit} from '@angular/core';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {MeasureService} from '../../services/measure.service';
import {Measure} from '../../models/measure';
import {Submeasure} from '../../models/submeasure';
import {SubmeasureService} from '../../services/submeasure.service';
import {DollarUploadService} from '../../../prof/services/dollar-upload.service';
import {MappingUploadService} from '../../../prof/services/mapping-upload.service';
import {environment} from '../../../../../environments/environment';
import * as _ from 'lodash';
import {UiUtil} from '../../../../core/services/ui-util';
import {shUtil} from '../../../../../../../shared/shared-util';

interface ReportSettings {
  submeasureName: string;
  fiscalMonth?: number;
  excelSheetname: string;
  excelFilename: string;
  excelProperties: string;
  excelHeaders: string;
  moduleId: number;
}

@Component({
  selector: 'fin-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends RoutingComponentBase implements OnInit {
  measureId: number;
  submeasureName: string;
  fiscalMonth: number;
  measures: Measure[] = [];
  submeasures: Submeasure[] = [];
  fiscalMonths: {fiscalMonth: number}[] = [];
  disableDownload = true;

  reports: any[] = [
    {
      type: 'dollar-upload', hasFiscalMonth: true, text: 'Manual Uploaded Data', disabled: false,
      filename: 'manual_uploaded_data'
    },
    {
      type: 'mapping-upload', hasFiscalMonth: true, text: 'Manual Mapping Data', disabled: false,
      filename: 'manual_mapping_data'
    },
    {
      type: 'product-hierarchy', text: 'Valid Product Hierarchy', disabled: false,
      filename: 'product_hierarchy.xlsx'
    },
    {
      type: 'sales-hierarchy', text: 'Valid Sales Hierarchy', disabled: false,
      filename: 'sales_hierarchy.xlsx'
    },
    {
      type: 'dept-upload', hasSubmeasure: true, text: 'Department Mapping Report', disabled: false,
      filename: 'department_mapping_data'
    },
    {
      type: 'submeasure-grouping', text: 'Submeasure Grouping Report', disabled: false,
      filename: 'Submeasure_Grouping_Report.xlsx'
    },
    {
      type: '2t-submeasure-list', text: '2T Submeasure List Report', disabled: false,
      filename: 'Sub_Measure_List_Report.xlsx'
    },
    {
      type: 'disti-to-direct', text: 'Disti To Direct Mapping Report', disabled: false,
      filename: 'Disti_to_Direct_Mapping_Report.xlsx'
    },
    {
      type: 'alternate-sl2', text: 'Alternate SL2 Report', disabled: false,
      filename: 'Alternate_SL2_Report.xlsx'
    },
    {
      type: 'corp-adjustment', text: 'Corp Adjustment Report', disabled: false,
      filename: 'Corp_Adjustment_Report.xlsx'
    },
    {
      type: 'sales-split-percentage', text: 'Sales Split Percentage Report', disabled: false,
      filename: 'Sales_Split_Percentage_Report.xlsx'
    },
    {
      type: 'valid-driver', text: 'Valid Driver Report', disabled: false,
      filename: 'Valid_Driver_Report.xlsx'
    },
    {
      type: 'submeasure', text: 'Sub Measure Updates', disabled: false,
      filename: 'Sub_Measure_Updates_Report.xlsx'
    },
    {
      type: 'allocation-rule', text: 'Measure & Sub Measure Hierarchy View', disabled: false,
      filename: 'Hierarchy_View_Report.xlsx'
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
    private store: AppStore
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
    this.measureId = undefined;
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
    this.subMeasureService.getManyLatest('name', {measureId: this.measureId, status: 'A'})
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
      obs.subscribe(fiscalMonths => {
        this.fiscalMonths = fiscalMonths.sort().reverse().slice(0, 24).map(fiscalMonth => ({name: shUtil.getFiscalMonthLongNameFromNumber(fiscalMonth), fiscalMonth}));
      });
    } else {
      this.disableDownload = false;
    }
  }

  fiscalMonthSelected() {
    this.disableDownload = false;
  }

  getFilename() {
    if (this.report.hasFiscalMonth) {
      return this.report.filename + `_${_.snakeCase(this.submeasureName)}_${this.fiscalMonth}.xlsx`;
    } else if (this.report.hasSubmeasure) {
      return this.report.filename + `_${_.snakeCase(this.submeasureName)}.xlsx`;
    } else {
      return this.report.filename;
    }
  }

  downloadReport() {
    const params = <ReportSettings>{
      excelFilename: this.getFilename()
    };

    if (this.report.hasSubmeasure || this.report.hasFiscalMonth) {
      params.submeasureName = this.submeasureName;
    }

    if (this.report.hasFiscalMonth) {
      params.fiscalMonth = this.fiscalMonth;
    }
    params.moduleId = this.store.module.moduleId;
    const url = `${environment.apiUrl}/api/prof/report/${this.report.type}`;
    UiUtil.submitForm(url, params);
  }

}

