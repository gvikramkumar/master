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
      type: 'mud', name: 'dollar-upload', hasFiscalMonth: true, text: 'Manual Uploaded Data', disabled: false,
      excelHeaders: 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Amount',
      excelProperties: 'fiscalMonth, submeasureName, product, sales, amount'
    },
    {
      type: 'mmd', name: 'mapping-upload', hasFiscalMonth: true, text: 'Manual Mapping Data', disabled: false,
      excelHeaders: 'Fiscal Month, Sub Measure Name, Input Product Value, Input Sales Value, Percentage',
      excelProperties: 'fiscalMonth, submeasureName, product, sales, percentage'
    },
    {
      type: 'vph', name: 'product-hierarchy', hasFiscalMonth: false, text: 'Valid Product Hierarchy', disabled: false,
      excelHeaders: 'Item Key, Product ID, Base Product ID, Goods or Service Type',
      excelProperties: 'item_key, product_id, base_product_id, goods_or_service_type'
    },
    {
      type: 'vsh', name: 'sales-hierarchy', hasFiscalMonth: false, text: 'Valid Sales Hierarchy', disabled: false,
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
    this.measureService.getMany().subscribe(data => {
      this.measures = data;
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
      .subscribe(submeasures => this.submeasures = submeasures);
  }

  submeasureSelected() {
    if (this.report.hasFiscalMonth) {
      this.disableDownload = true;
      this.fiscalMonth = undefined;
      this.fiscalMonths = [];
      let obs;
      switch (this.report.type) {
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

  downloadReport() {
    const params = <ReportSettings>{
      submeasureName: this.submeasureName,
      excelFilename: this.report.name + '.csv',
      excelHeaders: this.report.excelHeaders,
      excelProperties: this.report.excelProperties
    };

    if (this.report.hasFiscalMonth) {
      params.fiscalMonth = this.fiscalMonth;
    }
    const url = `${environment.apiUrl}/api/pft/report/${this.report.name}`;
    this.util.submitForm(url, params);
  }

}

