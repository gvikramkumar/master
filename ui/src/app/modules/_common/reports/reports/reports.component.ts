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
import * as moment from 'moment';

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
  measuresAll: Measure[] = [];
  submeasuresAll: Submeasure[] = [];
  submeasuresInData: Submeasure[] = [];
  submeasures: Submeasure[] = [];
  fiscalMonths: {fiscalMonth: number}[] = [];
  disableDownload = true;

  reports: any[] = [
    {
      type: 'dollar-upload', hasSmAndFiscalMonth: true, text: 'Manual Uploaded Data', disabled: false,
      filename: 'Manual_Uploaded_Data_Report'
    },
    {
      type: 'mapping-upload', hasSmAndFiscalMonth: true, text: 'Manual Mapping Data', disabled: false,
      filename: 'Manual_Mapping_Data_Report'
    },
    {
      type: 'product-hierarchy', text: 'Valid Product Hierarchy', disabled: false,
      filename: 'Product_Hierarchy_Report'
    },
    {
      type: 'sales-hierarchy', text: 'Valid Sales Hierarchy', disabled: false,
      filename: 'Sales_Hierarchy_Report'
    },
    {
      type: 'dept-upload', hasSubmeasureOnly: true, text: 'Department Mapping', disabled: false,
      filename: 'Department_Mapping_Data_Report'
    },
    {
      type: 'submeasure-grouping', text: 'Submeasure Grouping', disabled: false,
      filename: 'Submeasure_Grouping_Report'
    },
    {
      type: '2t-submeasure-list', text: '2T Submeasure List', disabled: false,
      filename: 'Sub_Measure_List_Report'
    },
    {
      type: 'disti-to-direct', text: 'Disti To Direct Mapping', disabled: false,
      filename: 'Disti_to_Direct_Mapping_Report'
    },
    {
      type: 'alternate-sl2', hasFiscalMonthOnly: true, text: 'Alternate SL2', disabled: false,
      filename: 'Alternate_SL2_Report'
    },
    {
      type: 'corp-adjustment', hasFiscalMonthOnly: true, text: 'Corp Adjustment', disabled: false,
      filename: 'Corp_Adjustment_Report'
    },
    {
      type: 'sales-split-percentage', hasFiscalMonthOnly: true, text: 'Sales Split Percentage', disabled: false,
      filename: 'Sales_Split_Percentage_Report'
    },
    {
      type: 'valid-driver', text: 'Valid Driver', disabled: false,
      filename: 'Valid_Driver_Report'
    },
    {
      type: 'submeasure', text: 'Sub Measure Updates', disabled: false,
      filename: 'Submeasure_Update_Report'
    },
    {
      type: 'allocation-rule', text: 'Rule Updates', disabled: false,
      filename: 'Rule_Update_Report'
    },
    {
      type: 'rule-submeasure', text: 'Rule-Submeasure History', disabled: false,
      filename: 'Rule_Submeasure_Report'
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
      this.measuresAll = _.sortBy(results[0], 'name');
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
    if (this.report.hasSubmeasureOnly || this.report.hasSmAndFiscalMonth || this.report.hasFiscalMonthOnly) {
      this.disableDownload = true;
    } else {
      this.disableDownload = false;
    }
    this.getInitialData();
  }

  getInitialData() {
    let obsFiscalMonth;
    switch (this.report.type) {
      case 'sales-split-percentage':
        obsFiscalMonth = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_sales_split_pctmap_upld', 'fiscal_month_id');
        break;
      case 'alternate-sl2':
        obsFiscalMonth = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_scms_triang_altsl2_map_upld', 'fiscal_month_id');
        break;
      case 'corp-adjustment':
        obsFiscalMonth = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_scms_triang_corpadj_map_upld', 'fiscal_month_id');
        break;
    }
    if (obsFiscalMonth) {
      obsFiscalMonth.subscribe(fiscalMonths => {
        this.fiscalMonths = fiscalMonths.map(fm => Number(fm)).sort().reverse().slice(0, 24)
          .map(fiscalMonth => ({name: shUtil.getFiscalMonthLongNameFromNumber(fiscalMonth), fiscalMonth}));
        if (this.fiscalMonths.length) {
          this.fiscalMonth = this.fiscalMonths[0].fiscalMonth;
          this.disableDownload = false;
        }
      });
    }

    let obsMeasure;
    switch (this.report.type) {
      case 'dollar-upload':
        obsMeasure = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_input_amnt_upld', 'sub_measure_key', null, true);
        break;
      case 'mapping-upload':
        obsMeasure = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_manual_map_upld', 'sub_measure_key', null, true);
        break;
      case 'dept-upload':
        obsMeasure = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_dept_acct_map_upld', 'sub_measure_key', null, true);
        break;
    }
    if (obsMeasure) {
      obsMeasure.subscribe(smKeys => {
        this.submeasuresInData = this.submeasuresAll.filter(sm => _.includes(smKeys, sm.submeasureKey));
        this.measures = this.measuresAll.filter(m => _.includes(this.submeasuresInData.map(sm => sm.measureId), m.measureId));
      });
    }
  }

  measureChange() {
    this.disableDownload = true;
    this.submeasureName = undefined;
    this.fiscalMonth = undefined;
    this.submeasures = [];
    this.fiscalMonths = [];
    this.submeasures = _.filter(this.submeasuresInData, {measureId: this.measureId});
  }

  submeasureChange() {
    if (this.report.hasSmAndFiscalMonth) {
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
        if (this.fiscalMonths.length) {
          this.fiscalMonth = this.fiscalMonths[0].fiscalMonth;
          this.disableDownload = false;
        }
      });
    } else {
      this.disableDownload = false;
    }
  }

  fiscalMonthChange() {
  }

  disableFiscalMonth() {
    if (this.report.hasSmAndFiscalMonth) {
      return !this.submeasureName;
    }
  }

  getFilename() {
    const dateStr = new Date().toISOString().substr(0, 10);
    if (this.report.hasSmAndFiscalMonth) {
      return this.report.filename + `_${_.snakeCase(this.submeasureName)}_${this.fiscalMonth}.xlsx`;
    } else if (this.report.hasSubmeasureOnly) {
      return this.report.filename + `_${_.snakeCase(this.submeasureName)}_${dateStr}.xlsx`;
    } else if (this.report.hasFiscalMonthOnly) {
      return this.report.filename + `_${this.fiscalMonth}.xlsx`;
    } else {
      return this.report.filename + `_${dateStr}.xlsx`;
    }
  }

  downloadReport() {
    const params = <ReportSettings>{
      excelFilename: this.getFilename()
    };

    if (this.report.hasSubmeasureOnly || this.report.hasSmAndFiscalMonth) {
      params.submeasureKey = _.find(this.submeasuresInData, {name: this.submeasureName}).submeasureKey;
    }

    if (this.report.hasSmAndFiscalMonth || this.report.hasFiscalMonthOnly) {
      params.fiscalMonth = this.fiscalMonth;
    }
    params.moduleId = this.store.module.moduleId;
    const url = `${environment.apiUrl}/api/prof/report/${this.report.type}`;
    UiUtil.submitForm(url, params);
  }

}

