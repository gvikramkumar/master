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

interface ReportSettings {
  submeasureName: string;
  fiscalMonth?: number;
  excelSheetname: string;
  excelFilename: string;
  excelProperties: string;
  excelHeaders: string;
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
      filename: 'manual_uploaded_data',
      excelSheetname: 'Manual Uploaded Data',
      excelHeaders: 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Legal Entity, Int Business Entity, SCMS, Amount',
      excelProperties: 'fiscalMonth, submeasureName, product, sales, legalEntity, intBusinessEntity, scms, amount'
    },
    {
      type: 'mapping-upload', hasFiscalMonth: true, text: 'Manual Mapping Data', disabled: false,
      filename: 'manual_mapping_data',
      excelSheetname: 'Manual Mapping Data',
      excelHeaders: 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Legal Entity, Int Business Entity, SCMS, Percentage',
      excelProperties: 'fiscalMonth, submeasureName, product, sales, legalEntity, intBusinessEntity, scms, percentage'
    },
    {
      type: 'product-hierarchy', text: 'Valid Product Hierarchy', disabled: false,
      filename: 'product_hierarchy.xlsx',
      excelSheetname: 'Product Hierarchy',
      excelHeaders: 'Technology Group, Business Unit, Product Family',
      excelProperties: 'technology_group_id, business_unit_id, product_family_id'
    },
    {
      type: 'sales-hierarchy', text: 'Valid Sales Hierarchy', disabled: false,
      filename: 'sales_hierarchy.xlsx',
      excelSheetname: 'Sales Hierarchy',
      excelHeaders: 'Sales Territory 1, Sales Territory 2, Sales Territory 3, Sales Territory 4, ' +
      'Sales Territory 5, Sales Territory 6',
      excelProperties: 'l1_sales_territory_descr, l2_sales_territory_descr, l3_sales_territory_descr,' +
      'l4_sales_territory_descr, l5_sales_territory_descr, l6_sales_territory_descr'
    },
    {
      type: 'dept-upload', hasSubmeasure: true, text: 'Department Mapping Report', disabled: false,
      filename: 'department_mapping_data',
      excelSheetname: 'Dept Upload',
      excelHeaders: 'Sub-Measure Name, Department Code, Start Account Code, End Account Code',
      excelProperties: 'submeasureName, departmentCode, startAccountCode, endAccountCode'
    },
    {
      type: 'submeasure-grouping', text: 'Submeasure Grouping Report', disabled: false,
      filename: 'Submeasure_Grouping_Report.xlsx',
      excelSheetname: 'Submeasure Grouping',
      excelHeaders: 'Submeasure Name, Group Submeasure Name, Created By, Create Time, ' +
      'Updated By, Update Time',
      excelProperties: 'sub_measure_name, group_sub_measure_name, create_owner,' +
      'create_datetimestamp, update_owner, update_datetimestamp'
    },
    {
      type: '2t-submeasure-list', text: '2T Submeasure List Report', disabled: false,
      filename: 'Sub_Measure_List_Report.xlsx',
      excelSheetname: '2t Submeasure List',
      excelHeaders: 'Submeasure Name, Fiscal Month Id, Created By, Created Date, ' +
      'Last Modified By, Last Modified Date',
      excelProperties: 'submeasure_name, fiscal_month_id, create_owner,' +
      'create_datetimestamp, update_owner, update_datetimestamp'
    },
    {
      type: 'disti-to-direct', text: 'Disti To Direct Mapping Report', disabled: false,
      filename: 'Disti_to_Direct_Mapping_Report.xlsx',
      excelSheetname: 'Disti to Direct',
      excelHeaders: 'Group ID, Node Type, Sales Finance Hierarchy, Node Code, ' +
      'Fiscal Month Id, Created By, Created Date, Last Modified By, Last Modified Date',
      excelProperties: 'group_id, node_type, sales_finance_hierarchy,' +
      'node_code, fiscal_month_id, create_user, create_datetime, update_user, update_datetime'
    },
    {
      type: 'alternate-sl2', text: 'Alternate SL2 Report', disabled: false,
      filename: 'Alternate_SL2_Report.xlsx',
      excelSheetname: 'Alternate SL2',
      excelHeaders: 'Actual SL2, Alternate SL2, Alternate Country, Fiscal Month Id, ' +
      'Created By, Created Date, Last Modified By, Last Modified Date',
      excelProperties: 'actual_sl2_code, alternate_sl2_code, alternate_country_name,' +
      'fiscal_month_id, create_user, create_datetime, update_user, update_datetime'
    },
    {
      type: 'corp-adjustment', text: 'Corp Adjustment Report', disabled: false,
      filename: 'Corp_Adjustment_Report.xlsx',
      excelSheetname: 'Corp Adjustment',
      excelHeaders: 'Country Name, Sales Territory Code, SCMS Value, Fiscal Month Id, ' +
      'Created By, Created Date, Last Modified By, Last Modified Date',
      excelProperties: 'sales_country_name, sales_territory_code, scms_value,' +
      'fiscal_month_id, create_user, create_datetime, update_user, update_datetime'
    },
    {
      type: 'sales-split-percentage', text: 'Sales Split Percentage Report', disabled: false,
      filename: 'Sales_Split_Percentage_Report.xlsx',
      excelSheetname: 'Sales Split Percentage',
      excelHeaders: 'Account Id, Company Code, Sub Account Code, Sales Territory Code, Percentage Value, ' +
      'Fiscal Month Id, Created By, Created Date, Last Modified By, Last Modified Date',
      excelProperties: 'account_code, company_code, sub_account_code, sales_territory_code, split_percentage,' +
      'fiscal_month_id, create_owner, create_datetimestamp, update_owner, update_datetimestamp'
    },
    {
      type: 'valid-driver', text: 'Valid Driver Report', disabled: false,
      filename: 'Valid_Driver_Report.xlsx',
      excelSheetname: ['Adjustment PF Report', 'Driver SL3 Report', 'Shipment Driver PF Report', 'Roll3 Driver With BE'],
      excelHeaders: ['Tech Group, Business Unit, Product Family',
        'Driver Type, Sales Level1 Code, Sales Level1 Description, Sales Level2 Code, Sales Level2 Description, Sales Level3 Code, Sales Level3 Description',
        'Tech Group, Business Unit, Product Family',
        'Driver Type, Tech Group, Business Unit, Product Family, Business Entity, Sub Business Entity'],
      excelProperties: ['technology_group_id, business_unit_id, product_family_id',
        'driver_type, l1_sales_territory_name_code, l1_sales_territory_descr, l2_sales_territory_name_code, l2_sales_territory_descr, l3_sales_territory_name_code, l3_sales_territory_descr',
        'technology_group_id, business_unit_id, product_family_id',
        'driver_type, technology_group_id, business_unit_id, product_family_id, bk_business_entity_name, sub_business_entity_name']
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
    this.subMeasureService.getMany({measureId: this.measureId})
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
        this.fiscalMonths = fiscalMonths.sort().reverse().slice(0, 24).map(fiscalMonth => ({fiscalMonth}));
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
      excelFilename: this.getFilename(),
      excelSheetname: this.report.excelSheetname instanceof Array ? this.report.excelSheetname.join(';;') : this.report.excelSheetname,
      excelHeaders: this.report.excelHeaders instanceof Array ? this.report.excelHeaders.join(';;') : this.report.excelHeaders,
      excelProperties: this.report.excelProperties instanceof Array ? this.report.excelProperties.join(';;') : this.report.excelProperties,
    };

    if (this.report.hasSubmeasure || this.report.hasFiscalMonth) {
      params.submeasureName = this.submeasureName;
    }

    if (this.report.hasFiscalMonth) {
      params.fiscalMonth = this.fiscalMonth;
    }
    const url = `${environment.apiUrl}/api/prof/report/${this.report.type}`;
    UiUtil.submitForm(url, params);
  }

}

