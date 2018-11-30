import {Component, OnInit} from '@angular/core';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {MeasureService} from '../../services/measure.service';
import {Measure} from '../../models/measure';
import {Submeasure} from '../../../../../../../shared/models/submeasure';
import {SubmeasureService} from '../../services/submeasure.service';
import {DollarUploadService} from '../../../prof/services/dollar-upload.service';
import {MappingUploadService} from '../../../prof/services/mapping-upload.service';
import {environment} from '../../../../../environments/environment';
import * as _ from 'lodash';
import {UiUtil} from '../../../../core/services/ui-util';
import {shUtil} from '../../../../../../../shared/shared-util';
import {PgLookupService} from '../../services/pg-lookup.service';

interface ReportSettings {
  submeasureKey: number;
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
  submeasuresAll: Submeasure[] = [];
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
      type: 'dept-upload', hasSubmeasure: true, text: 'Department Mapping', disabled: false,
      filename: 'department_mapping_data'
    },
    {
      type: 'submeasure-grouping', text: 'Submeasure Grouping', disabled: false,
      filename: 'Submeasure_Grouping_Report.xlsx'
    },
    {
      type: '2t-submeasure-list', text: '2T Submeasure List', disabled: false,
      filename: 'Sub_Measure_List_Report.xlsx'
    },
    {
      type: 'disti-to-direct', text: 'Disti To Direct Mapping', disabled: false,
      filename: 'Disti_to_Direct_Mapping_Report.xlsx'
    },
    {
      type: 'alternate-sl2', text: 'Alternate SL2', disabled: false,
      filename: 'Alternate_SL2_Report.xlsx'
    },
    {
      type: 'corp-adjustment', text: 'Corp Adjustment', disabled: false,
      filename: 'Corp_Adjustment_Report.xlsx'
    },
    {
      type: 'sales-split-percentage', text: 'Sales Split Percentage', disabled: false,
      filename: 'Sales_Split_Percentage_Report.xlsx'
    },
    {
      type: 'valid-driver', text: 'Valid Driver', disabled: false,
      filename: 'Valid_Driver_Report.xlsx'
    },
    {
      type: 'submeasure', text: 'Sub Measure Updates', disabled: false,
      filename: 'Sub_Measure_Updates_Report.xlsx'
    },
    {
      type: 'allocation-rule', text: 'Rule Updates', disabled: false,
      filename: 'Rule_Updates_Report.xlsx'
    },
    {
      type: 'rule-master', text: 'Rule Master', disabled: false,
      filename: 'Rule_Master_Report.xlsx'
    }
  ];
  report = this.reports[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private measureService: MeasureService,
    private submeasureService: SubmeasureService,
    private pgLookupService: PgLookupService,
    private store: AppStore
  ) {
    super(store, route);
  }

  ngOnInit() {
    Promise.all([
      this.measureService.getManyActive().toPromise(),
      this.submeasureService.getManyLatestGroupByNameActive().toPromise()
    ])
    .then(results => {
      this.measures = _.sortBy(results[0], 'name');
      this.submeasuresAll = _.sortBy(results[1], 'name');
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

  measureChange() {
    this.disableDownload = true;
    this.submeasureName = undefined;
    this.fiscalMonth = undefined;
    this.submeasures = [];
    this.fiscalMonths = [];
    this.submeasures = _.filter(this.submeasuresAll, {measureId: this.measureId});
  }

  submeasureChange() {
    if (this.report.hasFiscalMonth) {
      this.disableDownload = true;
      this.fiscalMonth = undefined;
      this.fiscalMonths = [];
      let obs;
      switch (this.report.type) {
        case 'dollar-upload':
          obs = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_input_amnt_upld', 'fiscal_month_id',
            `sub_measure_key = ${_.find(this.submeasures, {name: this.submeasureName}).submeasureKey}`);
          break;
        case 'mapping-upload':
          obs = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_manual_map_upld', 'fiscal_month_id',
            `sub_measure_key = ${_.find(this.submeasures, {name: this.submeasureName}).submeasureKey}`);
          break;
      }
      obs.subscribe(fiscalMonths => {
        this.fiscalMonths = fiscalMonths.map(fm => Number(fm)).sort().reverse().slice(0, 24)
          .map(fiscalMonth => ({name: shUtil.getFiscalMonthLongNameFromNumber(fiscalMonth), fiscalMonth}));
      });
    } else {
      this.disableDownload = false;
    }
  }

  fiscalMonthChange() {
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
      params.submeasureKey = _.find(this.submeasuresAll, {name: this.submeasureName}).submeasureKey;
    }

    if (this.report.hasFiscalMonth) {
      params.fiscalMonth = this.fiscalMonth;
    }
    params.moduleId = this.store.module.moduleId;
    const url = `${environment.apiUrl}/api/prof/report/${this.report.type}`;
    UiUtil.submitForm(url, params);
  }

}

