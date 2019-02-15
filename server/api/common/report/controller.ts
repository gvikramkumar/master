/*tslint:disable max-line-length  */
import {injectable} from 'inversify';
import * as _ from 'lodash';
import DollarUploadController from '../../prof/dollar-upload/controller';
import MappingUploadController from '../../prof/mapping-upload/controller';
import DeptUploadController from '../../prof/dept-upload/controller';
import PgLookupRepo from '../../pg-lookup/repo';
import {ApiError} from '../../../lib/common/api-error';
import {svrUtil} from '../../../lib/common/svr-util';
import xlsx from 'node-xlsx';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {shUtil} from '../../../../shared/shared-util';
import SubmeasureRepo from '../submeasure/repo';
import AllocationRuleRepo from '../allocation-rule/repo';
import MeasureRepo from '../measure/repo';
import SourceRepo from '../source/repo';
import AnyObj from '../../../../shared/models/any-obj';
import DollarUploadRepo from '../../prof/dollar-upload/repo';
import MappingUploadRepo from '../../prof/mapping-upload/repo';
import DeptUploadRepo from '../../prof/dept-upload/repo';
import {DollarUploadPgRepo} from '../../prof/dollar-upload/pgrepo';
import {MappingUploadPgRepo} from '../../prof/mapping-upload/pgrepo';
import {DeptUploadPgRepo} from '../../prof/dept-upload/pgrepo';
import {Submeasure} from '../../../../shared/models/submeasure';
import {ProductClassUploadPgRepo} from '../../prof/product-class-upload/pgrepo';

@injectable()
export default class ReportController extends ControllerBase {
  rules: AnyObj[];
  submeasures: AnyObj[];
  measures: AnyObj[];
  sources: AnyObj[];

  constructor(
    private dollarUploadPgRepo: DollarUploadPgRepo,
    private mappingUploadPgRepo: MappingUploadPgRepo,
    private deptUploadPgRepo: DeptUploadPgRepo,
    private pgLookupRepo: PgLookupRepo,
    private submeasureRepo: SubmeasureRepo,
    private allocationRuleRepo: AllocationRuleRepo,
    private measureRepo: MeasureRepo,
    private sourceRepo: SourceRepo,
    private productClassUploadPgRepo: ProductClassUploadPgRepo
  ) {
    super(null);
  }


  reportTest(req, res, next) {
    const data1 = [['One', 'Two', 'Three'], [1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
    const data2 = [['four', 'Fve', 'six'], [1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
    // const range = {s: {c: 0, r:0 }, e: {c:0, r:3}}; // A1:A4
    // const option = {'!merges': [ range ]};

    // const buffer = xlsx.build([{name: "mySheetName", data: data}], option);
    const buffer = xlsx.build([{name: 'mySheetName', data: data1}, {name: 'sheet2', data: data2}]);
    res.set('Content-Type', 'application/vnd.ms-excel');
    res.set('Content-Disposition', 'attachment; filename="' + 'myFileName.xlsx' + '"');
    svrUtil.bufferToStream(buffer).pipe(res);
    // res.send('lala');
  }


  // for Csv reports we expect:
  // * excelFilename: name of file it will download to
  // * excelSheetname: name of file it will download to
  // * excelProperties: an array of property names to determine the properties downloaded and order
  // * excelHeaders (optional) an array of header names for the first row of download
  // we push headers, convert json to csv using properties, concat csv, join with line terminator and send
  getExcelReport(req, res, next) {
    this.verifyProperties(req.body, ['excelFilename']);
    const moduleId = req.body.moduleId;
    let excelFilename = req.body.excelFilename;
    const body = _.omit(req.body, ['moduleId', 'excelFilename']);
    let excelSheetname;
    let excelHeaders;
    let excelProperties;
    const dataPromises = [];
    const report = req.params.report;
    let promise;
    let multiSheetReport = false;

    switch (report) {
      case 'dollar-upload':
        // we need moduleId for some reports (hit collections will multiple module data),
        // but for module specific collections like these, having a moduleId will
        // get no results as it's not included in the collection, so we need to remove it from filter
        excelSheetname = ['Manual Uploaded Data'];
        excelHeaders = ['Measure Name', 'Sub-Measure Name', 'Product', 'Sales', 'Legal Business Entity', 'Internal Business Entity',
          'SCMS', 'Amount', 'Revenue Classification', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['measure.name', 'sm.name', 'input_product_value', 'input_sales_value', 'input_entity_value', 'input_internal_be_value',
          'input_scms_value', 'amount_value', 'revenue_classification', 'fiscal_month_id', 'update_owner', 'update_datetimestamp'];
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId),
          this.pgLookupRepo.getDollarUploadReport(body.fiscalMonth, body.submeasureKeys)
        ])
          .then(results => {
            this.measures = results[0];
            this.submeasures = results[1];
            const rtn = results[2].map(obj => this.transformAddMeasureAndSubmeasure(obj));
            return _.orderBy(rtn, ['measure.name', 'sm.name'], ['asc', 'asc']);
          });
        break;

      case 'mapping-upload':
        excelSheetname = ['Manual Mapping Data'];
        excelHeaders = ['Measure Name', 'Sub-Measure Name', 'Product', 'Sales', 'Legal Business Entity', 'Internal Business Entity', 'SCMS', 'Percentage', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['measure.name', 'sm.name', 'input_product_value', 'input_sales_value', 'input_entity_value', 'input_internal_be_value',
          'input_scms_value', 'percentage_value', 'fiscal_month_id', 'update_owner', 'update_datetimestamp'];
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId),
          this.pgLookupRepo.getDollarUploadReport(body.fiscalMonth, body.submeasureKeys)
        ])
          .then(results => {
            this.measures = results[0];
            this.submeasures = results[1];
            const rtn = results[2].map(obj => this.transformAddMeasureAndSubmeasure(obj));
            return _.orderBy(rtn, ['measure.name', 'sm.name'], ['asc', 'asc']);
          });
        break;

      case 'product-hierarchy':
        excelSheetname = ['Product Hierarchy'];
        excelHeaders = ['Technology Group', 'Business Unit', 'Product Family'];
        excelProperties = ['technology_group_id', 'business_unit_id', 'product_family_id'];
        promise = this.pgLookupRepo.getProductHierarchyReport();
        break;

      case 'sales-hierarchy':
        excelSheetname = ['Sales Hierarchy'];
        excelHeaders = ['Sales Territory 1', 'Sales Territory 2', 'Sales Territory 3', 'Sales Territory 4', 'Sales Territory 5', 'Sales Territory 6'];
        excelProperties = ['l1_sales_territory_descr', 'l2_sales_territory_descr', 'l3_sales_territory_descr', 'l4_sales_territory_descr',
          'l5_sales_territory_descr', 'l6_sales_territory_descr'];
        promise = this.pgLookupRepo.getSalesHierarchyReport();
        break;

      case 'dept-upload':
        excelSheetname = ['Dept Upload'];
        excelHeaders = ['Measure Name', 'Sub-Measure Name', 'Sub-Measure Description', 'Department Code', 'Excluded GL Account', 'Start Account', 'End Account', 'Report Level 1', 'Report Level 2', 'Report Level 3', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['measure.name', 'sm.name', 'sm.desc', 'node_value', 'gl_account', 'startAccount', 'endAccount', 'sm.reportingLevels[0]', 'sm.reportingLevels[1]', 'sm.reportingLevels[2]',
          'update_owner', 'update_datetimestamp'];
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId),
          this.pgLookupRepo.getDeptUploadReport(body.submeasureKeys)
        ])
          .then(results => {
            this.measures = results[0];
            this.submeasures = results[1];
            const rtn = results[2].map(obj => {
              obj.startAccount = obj.gl_account ? '' : 60000;
              obj.endAccount = obj.gl_account ? '' : 69999;
              return this.transformAddMeasureAndSubmeasure(obj);
            });
            return _.orderBy(rtn, ['measure.name', 'sm.name', 'node_value'], ['asc', 'asc', 'asc']);
          });
        break;

      case 'product-classification':
        excelSheetname = ['Product Classification'];
        excelHeaders = ['Measure Name', 'Sub-Measure Name', 'Split Category', 'Split Percentage', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['measure.name', 'sm.name', 'splitCategory', 'splitPercentage', 'fiscalMonth', 'updatedBy', 'updatedDate'];
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId),
          this.productClassUploadPgRepo.getMany(body)
        ])
          .then(results => {
            this.measures = results[0];
            this.submeasures = results[1];
            const rtn = results[2].map(doc => this.transformAddMeasureAndSubmeasure(doc));
            return _.orderBy(rtn, ['measure.name', 'sm.name', 'splitCategory'], ['asc', 'asc', 'asc']);
          });
        break;

      case 'submeasure-grouping':
        excelSheetname = ['Sub-Measure Grouping'];
        excelHeaders = ['Measure Name', 'Sub-Measure Name', 'Group Sub-Measure Name', 'Created By', 'Create Time', 'Updated By', 'Update Time'];
        excelProperties = ['measureName', 'name', 'groupingSubmeasureName', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'];
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId)
        ])
          .then(results => {
            this.measures = results[0];
            this.submeasures = results[1];
            const rtn = this.submeasures.filter(doc => !!doc.groupingSubmeasureId)
              .map(sm => this.transformSubmeasure(sm));
            return _.orderBy(rtn, ['measureName', 'name']);
          })

        break;

      case '2t-submeasure-list':
        excelSheetname = ['2t Submeasure List'];
        excelHeaders = ['Measure Name', 'Submeasure Name', 'Fiscal Month', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'];
        excelProperties = ['measureName', 'name', 'fiscalMonth', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'];
        excelFilename = `2T_Sub_Measure_List_Report_${req.dfa.fiscalMonths.prof}.xlsx`;
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId)
        ])
          .then(results => {
            this.measures = results[0];
            this.submeasures = results[1];
            const rtn = this.submeasures.filter(doc => doc.indicators.twoTier === 'Y')
              .map(sm => this.transformSubmeasure(sm))
              .map(sm => {
                sm.fiscalMonth = req.dfa.fiscalMonths.prof;
                return sm;
              });
            return _.orderBy(rtn, ['measureName', 'name']);
          })

        break;

      case 'disti-direct':
        excelSheetname = ['Disti to Direct'];
        excelHeaders = ['Group ID', 'Node Type', 'Sales Finance Hierarchy', 'Node Code', 'External Theater', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['group_id', 'node_type', 'sales_finance_hierarchy', 'node_code', 'ext_theater_name', 'fiscal_month_id', 'update_owner', 'update_datetimestamp'];
        promise = this.pgLookupRepo.getDistiToDirectMappingReport(body.fiscalMonth);
        break;

      case 'alternate-sl2':
        excelSheetname = ['Alternate SL2'];
        excelHeaders = ['Actual SL2', 'Alternate SL2', 'Alternate Country', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['actual_sl2_code', 'alternate_sl2_code', 'alternate_country_name', 'fiscal_month_id', 'update_owner', 'update_datetimestamp'];
        promise = this.pgLookupRepo.getAlternateSL2Report(body.fiscalMonth)
          .then(rows => _.orderBy(rows, ['actual_sl2_code'], ['asc']));
        break;

      case 'corp-adjustment':
        excelSheetname = ['Corp Adjustment'];
        excelHeaders = ['Country Name', 'Sales Territory Code', 'SCMS Value', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['sales_country_name', 'sales_territory_code', 'scms_value', 'fiscal_month_id', 'update_owner', 'update_datetimestamp'];
        promise = this.pgLookupRepo.getCorpAdjustmentReport(body.fiscalMonth)
          .then(rows => _.orderBy(rows, ['sales_country_name', 'sales_territory_code', 'scms_value'], ['asc', 'asc', 'asc']));
        break;

      case 'sales-split-percentage':
        excelSheetname = ['Sales Split Percentage'];
        excelHeaders = ['Account Id', 'Company Code', 'Sub Account Code', 'Sales Territory Code', 'Percentage Value', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['account_code', 'company_code', 'sub_account_code', 'sales_territory_code', 'split_percentage', 'fiscal_month_id', 'update_owner', 'update_datetimestamp'];
        promise = this.pgLookupRepo.getSalesSplitPercentageReport(body.fiscalMonth);
        break;

      case 'valid-driver':
        multiSheetReport = true;
        excelSheetname = [['Adjustment PF Report'], ['Driver SL3 Report'], ['Shipment Driver PF Report'], ['Roll3 Driver With BE']],
          excelHeaders = [['Tech Group', 'Business Unit', 'Product Family'],
                          ['Driver Type', 'Sales Level1 Code', 'Sales Level1 Description', 'Sales Level2 Code', 'Sales Level2 Description', 'Sales Level3 Code', 'Sales Level3 Description'],
                          ['Tech Group', 'Business Unit', 'Product Family'],
                          ['Driver Type', 'Tech Group', 'Business Unit', 'Product Family', 'Business Entity', 'Sub Business Entity']];
        excelProperties = [['technology_group_id', 'business_unit_id', 'product_family_id'],
                          ['driver_type', 'l1_sales_territory_name_code', 'l1_sales_territory_descr', 'l2_sales_territory_name_code', 'l2_sales_territory_descr', 'l3_sales_territory_name_code', 'l3_sales_territory_descr'],
                          ['technology_group_id', 'business_unit_id', 'product_family_id'],
                          ['driver_type', 'technology_group_id', 'business_unit_id', 'product_family_id', 'bk_business_entity_name', 'sub_business_entity_name']];
        promise = Promise.all([
          this.pgLookupRepo.getAdjustmentPFReport(),
          this.pgLookupRepo.getDriverSL3Report(),
          this.pgLookupRepo.getShipmentDriverPFReport(),
          this.pgLookupRepo.getRoll3DriverWithBEReport()
        ]);
        break;

      case 'submeasure':
        multiSheetReport = true;
        excelSheetname = [['Original'], ['SM History'], ['As Of Now']];
        excelHeaders = [['Measure Name', 'Sub-Measure Name', 'Description', 'Source',
          'IFL Sales Level', 'IFL Product Level', 'IFL SCMS Level', 'IFL Legal Entity Level', 'IFL BE Level',
          'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing', 'P/L Node', 'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3',
          'Manual Mapping', 'MM Sales Level', 'MM Product Level', 'MM SCMS Level', 'MM Legal Entity Level', 'MM BE Level',
          'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Rule 6', 'Rule 7', 'Rule 8', 'Rule 9', 'Rule 10', 'Rule 11', 'Rule 12', 'Rule 13', 'Rule 14', 'Rule 15',
          'Is Group Sub-Measure', 'Allocation Required', 'Grouping Sub-Measure', 'Sub-Measure Type', 'Retained Earnings', 'Transition', 'Service', 'Pass Through', 'Corp Revenue', 'DualGaap', '2Tier'
          , 'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'],

          ['Measure Name', 'Sub-Measure Name', 'Description', 'Source',
            'IFL Sales Level', 'IFL Product Level', 'IFL SCMS Level', 'IFL Legal Entity Level', 'IFL BE Level',
            'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing', 'P/L Node', 'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3',
            'Manual Mapping', 'MM Sales Level', 'MM Product Level', 'MM SCMS Level', 'MM Legal Entity Level', 'MM BE Level',
            'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Rule 6', 'Rule 7', 'Rule 8', 'Rule 9', 'Rule 10', 'Rule 11', 'Rule 12', 'Rule 13', 'Rule 14', 'Rule 15',
            'Is Group Sub-Measure', 'Allocation Required', 'Grouping Sub-Measure', 'Sub-Measure Type', 'Retained Earnings', 'Transition', 'Service', 'Pass Through', 'Corp Revenue', 'DualGaap', '2Tier'
            , 'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'],

          ['Measure Name', 'Sub-Measure Name', 'Description', 'Source',
            'IFL Sales Level', 'IFL Product Level', 'IFL SCMS Level', 'IFL Legal Entity Level', 'IFL BE Level',
            'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing', 'P/L Node', 'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3',
            'Manual Mapping', 'MM Sales Level', 'MM Product Level', 'MM SCMS Level', 'MM Legal Entity Level', 'MM BE Level',
            'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Rule 6', 'Rule 7', 'Rule 8', 'Rule 9', 'Rule 10', 'Rule 11', 'Rule 12', 'Rule 13', 'Rule 14', 'Rule 15',
            'Is Group Sub-Measure', 'Allocation Required', 'Grouping Sub-Measure', 'Sub-Measure Type', 'Retained Earnings', 'Transition', 'Service', 'Pass Through', 'Corp Revenue', 'DualGaap', '2Tier'
            , 'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date']];

        excelProperties = [['measureName', 'name', 'desc', 'sourceName',
          'inputFilterLevel.salesLevel', 'inputFilterLevel.productLevel', 'inputFilterLevel.scmsLevel', 'inputFilterLevel.entityLevel', 'inputFilterLevel.internalBELevel',
          'startFiscalMonth', 'endFiscalMonth', 'processingTime', 'pnlnodeGrouping', 'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]',
          'indicators.manualMapping', 'manualMapping.salesLevel', 'manualMapping.productLevel', 'manualMapping.scmsLevel', 'manualMapping.entityLevel', 'manualMapping.internalBELevel',
          'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'rules[5]', 'rules[6]', 'rules[7]', 'rules[8]', 'rules[9]', 'rules[10]', 'rules[11]', 'rules[12]', 'rules[13]', 'rules[14]',
          'indicators.groupFlag', 'allocationRequired', 'groupingSubmeasureName', 'categoryType', 'indicators.retainedEarnings', 'indicators.transition', 'indicators.service', 'indicators.passThrough', 'indicators.corpRevenue', 'indicators.dualGaap', 'indicators.twoTier', 'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

          ['measureName', 'name', 'desc', 'sourceName',
            'inputFilterLevel.salesLevel', 'inputFilterLevel.productLevel', 'inputFilterLevel.scmsLevel', 'inputFilterLevel.entityLevel', 'inputFilterLevel.internalBELevel',
            'startFiscalMonth', 'endFiscalMonth', 'processingTime', 'pnlnodeGrouping', 'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]',
            'indicators.manualMapping', 'manualMapping.salesLevel', 'manualMapping.productLevel', 'manualMapping.scmsLevel', 'manualMapping.entityLevel', 'manualMapping.internalBELevel',
            'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'rules[5]', 'rules[6]', 'rules[7]', 'rules[8]', 'rules[9]', 'rules[10]', 'rules[11]', 'rules[12]', 'rules[13]', 'rules[14]',
            'indicators.groupFlag', 'allocationRequired', 'groupingSubmeasureName', 'categoryType', 'indicators.retainedEarnings', 'indicators.transition', 'indicators.service', 'indicators.passThrough', 'indicators.corpRevenue', 'indicators.dualGaap', 'indicators.twoTier', 'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

          ['measureName', 'name', 'desc', 'sourceName',
            'inputFilterLevel.salesLevel', 'inputFilterLevel.productLevel', 'inputFilterLevel.scmsLevel', 'inputFilterLevel.entityLevel', 'inputFilterLevel.internalBELevel',
            'startFiscalMonth', 'endFiscalMonth', 'processingTime', 'pnlnodeGrouping', 'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]',
            'indicators.manualMapping', 'manualMapping.salesLevel', 'manualMapping.productLevel', 'manualMapping.scmsLevel', 'manualMapping.entityLevel', 'manualMapping.internalBELevel',
            'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'rules[5]', 'rules[6]', 'rules[7]', 'rules[8]', 'rules[9]', 'rules[10]', 'rules[11]', 'rules[12]', 'rules[13]', 'rules[14]',
            'indicators.groupFlag', 'allocationRequired', 'groupingSubmeasureName', 'categoryType', 'indicators.retainedEarnings', 'indicators.transition', 'indicators.service', 'indicators.passThrough', 'indicators.corpRevenue', 'indicators.dualGaap', 'indicators.twoTier', 'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate']];
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.sourceRepo.getManyActive(),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId)
        ])
          .then(results => {
            this.measures = results[0];
            this.sources = results[1];
            this.submeasures = results[2];
            return Promise.all([
              this.submeasureRepo.getManyEarliestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
                .then(docs => docs.map(doc => this.transformSubmeasure(doc)))
                .then(vals => _.orderBy(vals, ['measureName', 'name'], ['asc', 'asc'])),
              this.submeasureRepo.getMany({setSort: 'name', moduleId})
                .then(docs => docs.map(doc => this.transformSubmeasure(doc)))
                .then(vals => _.orderBy(vals, ['measureName', 'name'], ['asc', 'asc'])),
              this.submeasureRepo.getManyLatestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
                .then(docs => docs.map(doc => this.transformSubmeasure(doc)))
                .then(vals => _.orderBy(vals, ['measureName', 'name'], ['asc', 'asc']))
            ]);

          })
        break;

      case 'allocation-rule':
        multiSheetReport = true;
        excelSheetname = [['Original'], ['Rule History'], ['As Of Now']];
        excelHeaders = [['RuleName', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'Legal Entity Match', 'BE Match', 'Country', 'External Theater', 'GL Segments',
          'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'BE Select',
          'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Updated By', 'Updated Date'],

          ['RuleName', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'Legal Entity Match', 'BE Match', 'Country', 'External Theater', 'GL Segments',
            'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'BE Select',
            'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Updated By', 'Updated Date'],

          ['RuleName', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'Legal Entity Match', 'BE Match', 'Country', 'External Theater', 'GL Segments',
            'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'BE Select',
            'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Updated By', 'Updated Date']];

        excelProperties = [['name', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'legalEntityMatch', 'beMatch', 'countryMatch', 'extTheaterMatch', 'glSegmentsMatch',
          'sl1Select', 'sl2Select', 'sl3Select', 'prodTGSelect', 'prodBUSelect', 'prodPFSelect', 'scmsSelect', 'beSelect',
          'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

          ['name', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'legalEntityMatch', 'beMatch', 'countryMatch', 'extTheaterMatch', 'glSegmentsMatch',
            'sl1Select', 'sl2Select', 'sl3Select', 'prodTGSelect', 'prodBUSelect', 'prodPFSelect', 'scmsSelect', 'beSelect',
            'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

          ['name', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'legalEntityMatch', 'beMatch', 'countryMatch', 'extTheaterMatch', 'glSegmentsMatch',
            'sl1Select', 'sl2Select', 'sl3Select', 'prodTGSelect', 'prodBUSelect', 'prodPFSelect', 'scmsSelect', 'beSelect',
            'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate']];

        promise = Promise.all([
          this.allocationRuleRepo.getManyEarliestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
            .then(docs => docs.map(doc => this.transformRule(doc)))
            .then(vals => _.orderBy(vals, ['name'], ['asc'])),
          this.allocationRuleRepo.getMany({setSort: 'name', moduleId})
            .then(docs => docs.map(doc => this.transformRule(doc)))
            .then(vals => _.orderBy(vals, ['name'], ['asc'])),
          this.allocationRuleRepo.getManyLatestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
            .then(docs => docs.map(doc => this.transformRule(doc)))
            .then(vals => _.orderBy(vals, ['name'], ['asc']))
        ]);
        break;

      case 'rule-submeasure':
        excelSheetname = ['History'];
        excelHeaders = ['Fiscal Month', 'Start Fiscal Month', 'End Fiscal Month', 'Sub-Measure Name', 'Measure Name', 'Source System',
          'Sales Level', 'Product Level', 'SCMS Level', 'Legal Entity Level', 'BE Level',
          'SM Status', 'SM Updated By', 'SM Updated Date',
          'RuleName', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'Legal Entity Match', 'BE Match', 'Country Match', 'Ext Theater Match', 'GL Segments',
          'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'BE Select', 'Rule Status', 'Rule Updated By', 'Rule Updated Date'];

        excelProperties = [
          'fiscalMonth', 'sm.startFiscalMonth', 'sm.endFiscalMonth', 'sm.name', 'sm.measureName', 'sm.sourceName',
          'sm.inputFilterLevel.salesLevel', 'sm.inputFilterLevel.productLevel', 'sm.inputFilterLevel.scmsLevel', 'sm.inputFilterLevel.entityLevel', 'sm.inputFilterLevel.internalBELevel',
          'sm.status', 'sm.updatedBy', 'sm.updatedDate',
          'rule.name', 'rule.driverName', 'rule.period', 'rule.salesMatch', 'rule.productMatch', 'rule.scmsMatch', 'rule.legalEntityMatch', 'rule.beMatch', 'rule.countryMatch', 'rule.extTheaterMatch', 'rule.glSegmentsMatch',
          'rule.sl1Select', 'rule.sl2Select', 'rule.sl2Select', 'rule.prodTGSelect', 'rule.prodBUSelect', 'rule.prodPFSelect', 'rule.scmsSelect', 'rule.beSelect',
          'rule.status', 'rule.updatedBy', 'rule.updatedDate'
        ];
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.sourceRepo.getManyActive()
        ])
          .then(results => {
            this.measures = results[0];
            this.sources = results[1];
            const promises = [];
            const fiscalMonthMultiSels = shUtil.stringToArray(body.fiscalMonthMultiSels, 'number').sort().reverse();
            fiscalMonthMultiSels.forEach(fimo => {
              // get upper date for filter
              // refactor getManyLatestGroupByNameActive to take filter or do new function or just use getmanyLatest
              promises.push(Promise.all([
                Promise.resolve(fimo),
                this.submeasureRepo.getManyLatestGroupByNameActive(moduleId, {updatedDate: {$lt: new Date(shUtil.getCutoffDateStrFromFiscalMonth(fimo))}}),
                this.allocationRuleRepo.getManyLatestGroupByNameActive(moduleId, {updatedDate: {$lt: new Date(shUtil.getCutoffDateStrFromFiscalMonth(fimo))}}),
              ]));
            });
            return Promise.all(promises);
          })
          .then(results => {
            const rows: AnyObj[] = [];
            results.forEach(result => {
              const fiscalMonth = result[0];
              this.submeasures = _.sortBy(result[1], 'name');
              this.rules = result[2];
              const sms = this.submeasures.map(sm => this.transformSubmeasure(sm)); // update this for more props if needed
              const rules = this.rules.map(rule => this.transformRule(rule)); // update this for more props if needed
              sms.forEach(sm => {
                const smRules = sm.rules.map(ruleName => {
                  const rule = _.find(rules, {name: ruleName});
                  return rule || {name: ruleName};
                });
                if (!smRules.length) {
                  rows.push({fiscalMonth, sm, rule: {}});
                } else {
                  smRules.forEach(rule => {
                    rows.push({fiscalMonth, sm, rule});
                  });
                }
              });
            });
            return _.orderBy(rows, ['fiscalMonth', 'sm.measureName', 'sm.name'], ['asc', 'asc', 'asc']);
          })
        break;

      default:
        next(new ApiError('Bad report type', null, 400));
        return;
    }

      if (multiSheetReport) {
        if ((excelHeaders && excelHeaders.length < 2) || excelSheetname.length < 2 || excelProperties.length < 2) {
          next(new ApiError(`excelHeaders, excelProperties, excelSheetname array lengths must be > 1 for multisheet report`, body, 400));
          return;
        }
        promise
          .then(resultArr => {
            const sheetArr = [];
            resultArr.forEach((results, idx) => {
              let objs = results.rows || results;
              objs = objs.map(obj => excelProperties[idx]
                .map(prop => {
                  const val = _.get(obj, prop);
                  if (val instanceof Date) {
                    const str = val.toISOString();
                    return str.substr(0, str.length - 5).replace('T', '  ');
                  } else {
                    return val;
                  }
                }));

              let data = [];
              if (excelHeaders && excelHeaders[idx]) {
                data.push(excelHeaders[idx]);
              }
              data = data.concat(objs);
              sheetArr.push({name: excelSheetname[idx], data});
            });
            const buffer = xlsx.build(sheetArr);
            res.set('Content-Type', 'application/vnd.ms-excel');
            res.set('Content-Disposition', 'attachment; filename="' + excelFilename + '"');
            svrUtil.bufferToStream(buffer).pipe(res);
          });
      } else { // single sheet
        promise
          .then(results => results.rows || results)
          .then(objs => {
            return objs.map(obj => excelProperties.map(prop => {
              const val = _.get(obj, prop);
              if (val instanceof Date) {
                const str = val.toISOString();
                return str.substr(0, str.length - 5).replace('T', '  ');
              } else {
                return val;
              }
            }));
          })
          .then(objs => {
            let data = [];
            if (excelHeaders) {
              data.push(excelHeaders);
            }
            data = data.concat(objs);
            const buffer = xlsx.build([{name: excelSheetname, data}]);
            res.set('Content-Type', 'application/vnd.ms-excel');
            res.set('Content-Disposition', 'attachment; filename="' + excelFilename + '"');
            svrUtil.bufferToStream(buffer).pipe(res);

          })
          .catch(next);
      }

  }

  // postgres sm
  transformAddMeasureAndSubmeasure(obj) {
    obj = svrUtil.docToObject(obj);
    // sm could be from pg  query or mongo so check for both keys
    obj.sm = _.find(this.submeasures, {submeasureKey: obj.submeasureKey || Number(obj.sub_measure_key)});
    // some tables have measure_id (dollar), some don't (dept), so get it from sm always
    obj.measure = _.find(this.measures, {measureId: obj.sm && obj.sm.measureId});
    return obj;
  }

  // mongo sm
  transformSubmeasure(sm) {
    sm = svrUtil.docToObject(sm);
    const measure = _.find(this.measures, {measureId: sm.measureId});
    const source = _.find(this.sources, {sourceId: sm.sourceId});
    sm.measureName = measure && measure.name;
    sm.sourceName = source && source.name;
    if (sm.groupingSubmeasureId) {
      const parent = _.find(this.submeasures, {submeasureKey: sm.groupingSubmeasureId});
      sm.groupingSubmeasureName = parent && parent.name;
    }
    return sm;
  }

  transformRule(rule) {
    rule = svrUtil.docToObject(rule);

    return rule;
  }



  // CSV REPORT: once we moved to multiple sheet reports, the csv report was replaced by excel report.
  // this code continues to stagnate and would need considerably update to be current, but we'll
  // leave it for reverence in case we need a csv output for some reason.

  // for Csv reports we expect:
  // * excelFilename: name of file it will download to
  // * excelProperties: an array of property names to determine the properties downloaded and order
  // * excelHeaders (optional) an array of header names for the first row of download
  // we push headers, convert json to csv using properties, concat csv, join with line terminator and send
  /*
  getCsvReport(req, res, next) {
    const body = req.body; // post request, params are in the body
    req.query = _.omit(body, ['excelFilename', 'excelProperties', 'excelHeaders']);

    if (!excelFilename || !excelProperties) {
      next(new ApiError('Missing properties for excelDownload. Require: excelFilename, excelProperties.', null, 400));
      return;
    }
    let arrRtn = [];
    if (excelHeaders) {
      arrRtn.push(svrUtil.cleanCsv(excelHeaders));
    }

    let promise;
    switch (req.params.report) {
      case 'dollar-upload':
        delete req.query.moduleId;
        promise = this.dollarUploadCtrl.getManyPromise(req);
        break;
      case 'mapping-upload':
        delete req.query.moduleId;
        promise = this.mappingUploadCtrl.getManyPromise(req);
        break;
      case 'product-hierarchy':
        promise = this.pgLookupRepo.getProductHierarchyReport();
        break
      case 'sales-hierarchy':
        promise = this.pgLookupRepo.getSalesHierarchyReport();
        break
      case 'dept-upload':
        delete req.query.moduleId;
        promise = this.deptUploadCtrl.getManyPromise(req);
        break
      case 'submeasure-grouping':
        promise = this.pgLookupRepo.getSubmeasureGroupingReport();
        break
      case '2t-submeasure-list':
        promise = this.pgLookupRepo.get2TSubmeasureListReport();
        break
      case 'disti-direct':
        promise = this.pgLookupRepo.getDistiToDirectMappingReport();
        break
      case 'alternate-sl2':
        promise = this.pgLookupRepo.getAlternateSL2Report();
        break
      case 'corp-adjustment':
        promise = this.pgLookupRepo.getCorpAdjustmentReport();
        break
      case 'sales-split-percentage':
        promise = this.pgLookupRepo.getSalesSplitPercentageReport();
        break
      default:
        next(new ApiError('Bad report type', null, 400));
        return;
    }

    promise
      .then(results => results.rows || results)
      .then(docs => svrUtil.convertJsonToCsv(docs, svrUtil.cleanCsvArr(excelProperties)))
      .then(arrCsv => {
        arrRtn = arrRtn.concat(arrCsv);
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', 'attachment; filename="' + excelFilename + '"');
        res.send(arrRtn.join('\n'));
      })
      .catch(next);
  }
*/

}

