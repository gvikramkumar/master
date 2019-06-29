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
import _ from 'lodash';
import {UiUtil} from '../../../../core/services/ui-util';
import {shUtil} from '../../../../../../../shared/misc/shared-util';
import {PgLookupService} from '../../services/pg-lookup.service';
import moment from 'moment';

interface ReportSettings {
  submeasureKey?: number;
  submeasureKeys?: number[];
  fiscalMonth?: number;
  fiscalYear?: number;
  fiscalMonthMultiSels?: number[];
  excelFilename: string;
  moduleId: number;
}

interface Report {
  type: string;
  text: string;
  disabled: boolean;
  filename: string;
  hasNoChoices: boolean;
  hasSubmeasureOnly: boolean;
  hasMultiSubmeasureOnly: boolean;
  hasFiscalMonthOnly: boolean;
  hasFiscalYearOnly: boolean;
  hasMultiFiscalMonthOnly: boolean;
  hasSmAndFiscalMonth: boolean;
  hasMultiSmAndFiscalMonth: boolean;
}

@Component({
  selector: 'fin-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends RoutingComponentBase implements OnInit {
  measureId: number;
  submeasureKey: number;
  submeasureKeys: number[] = [];
  fiscalMonth: number;
  fiscalMonths: { fiscalMonth: number }[] = [];
  fiscalMonthMultiSels: number[];
  fiscalMonthMultis = shUtil.getFiscalMonthListFromDate(new Date(), 15);
  fiscalYear: number;
  fiscalYears: { name: string, value: number }[];
  measures: Measure[] = [];
  measuresAll: Measure[] = [];
  submeasuresAll: Submeasure[] = [];
  submeasuresInData: Submeasure[] = [];
  submeasures: Submeasure[] = [];
  disableDownload = true;

  reports: any[] = [
    {
      type: 'product-hierarchy', hasNoChoices: true, text: 'Valid Product Hierarchy', disabled: false,
      filename: 'Product_Hierarchy_Report'
    },
    {
      type: 'sales-hierarchy', hasNoChoices: true, text: 'Valid Sales Hierarchy', disabled: false,
      filename: 'Sales_Hierarchy_Report'
    },
    {
      type: 'valid-driver', hasNoChoices: true, text: 'Valid Driver', disabled: false,
      filename: 'Valid_Driver_Report'
    },
    // REMEMBER, YOU HAVE TO CHANGE THE HTML PAGE TO INDEX 8 FROM 7 IN 2 PLACES OF ngFor
    // {
    //   type: 'valid-slpf-driver', hasMultiSmAndFiscalMonth: true, text: 'Valid SL/PF Driver Report', disabled: false,
    //   filename: 'Valid_SL_PF_Driver_Report'
    // },
    {
      type: 'submeasure', hasNoChoices: true, text: 'Sub-Measure Updates', disabled: false,
      filename: 'Submeasure_Update_Report'
    },
    {
      type: 'submeasure-grouping', hasNoChoices: true, text: 'Sub-Measure Grouping', disabled: false,
      filename: 'Submeasure_Grouping_Report'
    },
    {
      type: 'allocation-rule', hasNoChoices: true, text: 'Rule Updates', disabled: false,
      filename: 'Rule_Update_Report'
    },
    {
      type: 'rule-submeasure', hasMultiFiscalMonthOnly: true, text: 'Rule to Sub-Measure History', disabled: false,
      filename: 'Rule_Submeasure_Report'
    },
    {
      type: 'dollar-upload', hasMultiSmAndFiscalMonth: true, text: 'Input Dollar Adjustments Data', disabled: false,
      filename: 'Manual_Uploaded_Data_Report'
    },
    {
      type: 'mapping-upload', hasMultiSmAndFiscalMonth: true, text: 'Manual Mapping Split Percentage', disabled: false,
      filename: 'Manual_Mapping_Data_Report'
    },
    {
      type: 'dept-upload', hasMultiSubmeasureOnly: true, text: 'Department/Account Exclusion Mapping', disabled: false,
      filename: 'Department_Mapping_Data_Report'
    },
    {
      type: 'sales-split-percentage', hasFiscalMonthOnly: true, text: 'Sales Level Split Percentage', disabled: false,
      filename: 'Sales_Split_Percentage_Report'
    },
    {
      type: 'product-classification',
      hasFiscalMonthOnly: true,
      text: 'Product Classification (SW/HW Mix)',
      disabled: false,
      filename: 'Product_Classification_Report'
    },
    {
      type: 'alternate-sl2', hasFiscalMonthOnly: true, text: 'Alternate SL2 Mapping', disabled: false,
      filename: 'Alternate_SL2_Report'
    },
    {
      type: 'corp-adjustment', hasFiscalMonthOnly: true, text: 'Corp Adjustments Mapping', disabled: false,
      filename: 'Corp_Adjustment_Report'
    },
    {
      type: 'disti-direct', hasFiscalMonthOnly: true, text: 'Disty to Direct Mapping', disabled: false,
      filename: 'Disty_to_Direct_Mapping_Report'
    },
    {
      type: 'service-map', hasFiscalMonthOnly: true, text: 'Service Mapping Split Percentage', disabled: false,
      filename: 'Service_Mapping_Report'
    },
    {
      type: 'service-training', hasFiscalYearOnly: true, text: 'Service Training Split Percentage', disabled: false,
      filename: 'Service_Training_Report'
    },
  ];
  report: Report;

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
    this.reset(true);
  }

  reset(init?) {
    this.measureId = undefined;
    this.submeasureKey = undefined;
    this.submeasureKeys = [];
    this.fiscalMonth = undefined;
    this.fiscalMonthMultiSels = [this.fiscalMonthMultis[0].fiscalMonth];
    this.submeasures = [];
    this.fiscalMonths = [];
    this.fiscalYears = [];
    if (this.report && (this.report.hasNoChoices || this.report.type === 'rule-submeasure')) {
      this.disableDownload = false;
    } else {
      this.disableDownload = true;
    }
    if (!init) {
      this.getInitialData();
    }
  }

  getInitialData() {
    let prmFiscalMonth;
    let prmFiscalYear;
    let prmMeasure;
    switch (this.report.type) {
      case 'sales-split-percentage':
        prmFiscalMonth = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_sales_split_pctmap_upld', 'fiscal_month_id').toPromise();
        break;
      case 'product-classification':
        prmFiscalMonth = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_swalloc_manualmix_upld', 'fiscal_month_id').toPromise();
        break;
      case 'alternate-sl2':
        prmFiscalMonth = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_scms_triang_altsl2_map_upld', 'fiscal_month_id').toPromise();
        break;
      case 'corp-adjustment':
        prmFiscalMonth = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_scms_triang_corpadj_map_upld', 'fiscal_month_id').toPromise();
        break;
      case 'disti-direct':
        prmFiscalMonth = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_disti_to_direct_map_upld', 'fiscal_month_id').toPromise();
        break;
      case 'service-map':
        prmFiscalMonth = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_service_map_upld', 'fiscal_month_id').toPromise();
        break;
      case 'service-training':
        prmFiscalYear = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_service_trngsplit_pctmap_upld', 'fiscal_year').toPromise();
        break;
      case 'valid-slpf-driver':
      case 'dollar-upload':
        prmMeasure = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_input_amnt_upld', 'sub_measure_key', true).toPromise();
        break;
      case 'mapping-upload':
        prmMeasure = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_manual_map_upld', 'sub_measure_key', true).toPromise();
        break;
      case 'dept-upload':
        prmMeasure = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_dept_acct_map_upld', 'sub_measure_key', true).toPromise();
        break;
    }
    const promises = [prmFiscalMonth, prmFiscalYear, prmMeasure].filter(x => !!x);
    if (promises.length) {
      this.store.showSpinner = true;
      shUtil.promiseChain(promises)
        .then(results => {
          const result = results[0];
          this.store.showSpinner = false;
          if (prmFiscalMonth) {
            this.fiscalMonths = result.map(fm => Number(fm)).sort().reverse().slice(0, 24)
              .map(fiscalMonth => ({name: shUtil.getFiscalMonthLongNameFromNumber(fiscalMonth), fiscalMonth}));
            if (this.fiscalMonths.length) {
              this.fiscalMonth = this.fiscalMonths[0].fiscalMonth;
              this.disableDownload = false;
            }
          }
          if (prmFiscalYear) {
            this.fiscalYears = result.map(fy => ({name: `FY${fy}`, value: fy}));
            this.fiscalYears = _.orderBy(this.fiscalYears, ['value'], ['desc']);
            if (this.fiscalYears.length) {
              this.fiscalYear = this.fiscalYears[0].value;
              this.disableDownload = false;
            }

          }
          if (prmMeasure) {
            const smKeys = result;
            this.submeasuresInData = this.submeasuresAll.filter(sm => _.includes(smKeys, sm.submeasureKey));
            this.measures = this.measuresAll.filter(m => _.includes(_.uniq(this.submeasuresInData.map(sm => sm.measureId)), m.measureId));
            if (this.measures.length) {
              this.measureId = this.measures[0].measureId;
              this.measureChange();
            }
          }
        })
        .catch(() => this.store.showSpinner = false);
    }

  }

  measureChange() {
    this.disableDownload = true;
    this.submeasureKey = undefined;
    this.submeasureKeys = [];
    this.fiscalMonth = undefined;
    this.submeasures = [];
    this.fiscalMonths = [];
    this.submeasures = _.filter(this.submeasuresInData, {measureId: this.measureId});
  }

  submeasureChange() {
    if (!this.submeasureKey) {
      this.disableDownload = true;
    } else if (this.report.hasSubmeasureOnly && this.submeasureKey) {
      this.disableDownload = false;
    } else if (this.report.hasSmAndFiscalMonth && this.submeasureKey) {
      this.disableDownload = true;
      this.fiscalMonth = undefined;
      this.fiscalMonths = [];
      /*
            // these moved to multisubmeasure choice, but save for reference
            let obs;
            switch (this.report.type) {
              case 'dollar-upload':
                obs = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_input_amnt_upld', 'fiscal_month_id',
                  `sub_measure_key = ${this.submeasureKey}`);
                break;
              case 'mapping-upload':
                obs = this.pgLookupService.getSortedListFromColumn('fpadfa.dfa_prof_manual_map_upld', 'fiscal_month_id',
                  `sub_measure_key = ${this.submeasureKey}`);
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
      */
    }
  }

  handleHasMultiSmAndFiscalMonth() {
    let obs;
    switch (this.report.type) {
      case 'dollar-upload':
      case 'valid-slpf-driver':
        obs = this.pgLookupService.callRepoMethod('getDollarUploadFiscalMonthsFromSubmeasureKeys', {submeasureKeys: this.submeasureKeys});
        break;
      case 'mapping-upload':
        obs = this.pgLookupService.callRepoMethod('getMappingUploadFiscalMonthsFromSubmeasureKeys', {submeasureKeys: this.submeasureKeys});
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
  }

  submeasureMultiChange() {
    if (this.report.hasMultiSubmeasureOnly && !this.submeasureKeys.length) { // if they clear the values, disable the
      this.disableDownload = true;
    } else if (this.report.hasMultiSubmeasureOnly && this.submeasureKeys.length) {
      this.disableDownload = false;
    } else if (this.report.hasMultiSmAndFiscalMonth && !this.submeasureKeys.length) {
      this.disableDownload = true;
      this.fiscalMonth = undefined;
      this.fiscalMonths = [];
    } else if (this.report.hasMultiSmAndFiscalMonth && this.submeasureKeys.length) {
      this.disableDownload = true;
      this.fiscalMonth = undefined;
      this.fiscalMonths = [];
      this.handleHasMultiSmAndFiscalMonth();
    }
  }

  fiscalMonthMultiChange() {
    if (this.fiscalMonthMultiSels.length > 0) {
      this.disableDownload = false;
    } else {
      this.disableDownload = true;
    }
  }

  getFilename() {
    const dateStr = moment().format('YYYY-MM-DD');
    const sm = this.submeasureKey ? _.find(this.submeasures, {submeasureKey: this.submeasureKey}) : null;
    if (this.report.hasSmAndFiscalMonth) {
      return this.report.filename + `_${_.snakeCase(sm.name)}_${this.fiscalMonth}.xlsx`;
    } else if (this.report.hasSubmeasureOnly) {
      return this.report.filename + `_${_.snakeCase(sm.name)}_${dateStr}.xlsx`;
    } else if (this.report.hasFiscalMonthOnly || this.report.hasMultiSmAndFiscalMonth) {
      return this.report.filename + `_${this.fiscalMonth}.xlsx`;
    } else if (this.report.hasFiscalYearOnly) {
      return this.report.filename + `_${this.fiscalYear}.xlsx`;
    } else {
      return this.report.filename + `_${dateStr}.xlsx`;
    }
  }

  downloadReport() {
    const params = <ReportSettings>{
      excelFilename: this.getFilename()
    };
    if (this.report.hasSubmeasureOnly || this.report.hasSmAndFiscalMonth) {
      params.submeasureKey = this.submeasureKey;
    }
    if (this.report.hasMultiSubmeasureOnly || this.report.hasMultiSmAndFiscalMonth) {
      params.submeasureKeys = this.submeasureKeys;
    }
    if (this.report.hasSmAndFiscalMonth || this.report.hasMultiSmAndFiscalMonth || this.report.hasFiscalMonthOnly) {
      params.fiscalMonth = this.fiscalMonth;
    }
    if (this.report.hasMultiFiscalMonthOnly) {
      params.fiscalMonthMultiSels = this.fiscalMonthMultiSels;
    }
    if (this.report.hasFiscalYearOnly) {
      params.fiscalYear = this.fiscalYear;
    }
    params.moduleId = this.store.module.moduleId;
    const url = `${environment.apiUrl}/api/report/${this.report.type}`;
    UiUtil.submitForm(url, params);
  }

}

