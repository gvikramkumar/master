/*tslint:disable max-line-length  */
import {injectable} from 'inversify';
import _ from 'lodash';
import PgLookupRepo from '../../pg-lookup/repo';
import {ApiError} from '../../../lib/common/api-error';
import {svrUtil} from '../../../lib/common/svr-util';
import xlsx from 'node-xlsx';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {shUtil} from '../../../../shared/misc/shared-util';
import SubmeasureRepo from '../submeasure/repo';
import AllocationRuleRepo from '../allocation-rule/repo';
import MeasureRepo from '../measure/repo';
import SourceRepo from '../source/repo';
import AnyObj from '../../../../shared/models/any-obj';
import {DollarUploadPgRepo} from '../../prof/dollar-upload/pgrepo';
import {MappingUploadPgRepo} from '../../prof/mapping-upload/pgrepo';
import {DeptUploadPgRepo} from '../../prof/dept-upload/pgrepo';
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
    const moduleId = req.dfa.moduleId;
    const excelFilename = req.body.excelFilename;
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
        excelSheetname = ['Manual Uploaded Data'];
        excelHeaders = ['Measure Name', 'Sub-Measure Name', 'Product', 'Sales', 'Legal Business Entity', 'Internal Business Entity',
          'SCMS', 'Amount', 'Gross Unbilled Accrued Revenue Flag', 'Deal ID', 'Revenue Classification', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['measure.name', 'sm.name', 'input_product_value', 'input_sales_value', 'input_entity_value', 'input_internal_be_value',
          'input_scms_value', 'amount_value', 'gross_unbilled_accrued_rev_flg', 'deal_id', 'revenue_classification', 'fiscal_month_id', 'update_owner', 'update_datetimestamp'];
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId),
          this.pgLookupRepo.getDollarUploadReport(body.fiscalMonth, body.submeasureKeys)
        ])
          .then(results => {
            this.measures = results[0];
            this.submeasures = results[1];
            const rtn = results[2].map(obj => this.transformAddMeasureAndSubmeasure(obj));
            return _.sortBy(rtn, 'sm.name');
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
          this.pgLookupRepo.getMappingUploadReport(body.fiscalMonth, body.submeasureKeys)
        ])
          .then(results => {
            this.measures = results[0];
            this.submeasures = results[1];
            const rtn = results[2].map(obj => this.transformAddMeasureAndSubmeasure(obj));
            return _.sortBy(rtn, 'sm.name');
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
        excelHeaders = ['Sales Level 1', 'Sales Level 2', 'Sales Level 3', 'Sales Level 4', 'Sales Level 5', 'Sales Level 6',
          'L1 Sales Territory Name Code', 'L2 Sales Territory Name Code', 'L3 Sales Territory Name Code', 'L4 Sales Territory Name Code', 'L5 Sales Territory Name Code', 'L6 Sales Territory Name Code',
          'Sales Territory Name', 'Sales Territory Name Code'];
        excelProperties = ['l1_sales_territory_descr', 'l2_sales_territory_descr', 'l3_sales_territory_descr', 'l4_sales_territory_descr', 'l5_sales_territory_descr', 'l6_sales_territory_descr',
          'l1_sales_territory_name_code', 'l2_sales_territory_name_code', 'l3_sales_territory_name_code', 'l4_sales_territory_name_code', 'l5_sales_territory_name_code', 'l6_sales_territory_name_code',
          'sales_territory_name', 'sales_territory_name_code'];
        promise = this.pgLookupRepo.getSalesHierarchyReport();
        break;

      case 'dept-upload':
        excelSheetname = ['Dept Upload'];
        excelHeaders = ['Measure Name', 'Sub-Measure Name', 'Sub-Measure Description', 'Sub-Measure Key', 'Department Code', 'Excluded GL Account', 'Start Account', 'End Account', 'Report Level 1', 'Report Level 2', 'Report Level 3', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['measure.name', 'sm.name', 'sm.desc', 'sm.submeasureKey', 'node_value', 'gl_account', 'startAccount', 'endAccount', 'sm.reportingLevels[0]', 'sm.reportingLevels[1]', 'sm.reportingLevels[2]',
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
            return _.orderBy(rtn, ['sm.name', 'node_value']);
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
            const rtn = results[2]
              .map(doc => this.transformAddMeasureAndSubmeasure(doc))
              .map(doc => {
                doc.splitPercentage = doc.splitPercentage ? doc.splitPercentage * 100 : doc.splitPercentage;
                return doc;
              });
            return _.orderBy(rtn, ['measure.name', 'sm.name', 'splitCategory']);
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
          });

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
          .then(rows => _.orderBy(rows, ['actual_sl2_code']));
        break;

      case 'corp-adjustment':
        excelSheetname = ['Corp Adjustment'];
        excelHeaders = ['Country Name', 'Sales Territory Code', 'SCMS Value', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['sales_country_name', 'sales_territory_code', 'scms_value', 'fiscal_month_id', 'update_owner', 'update_datetimestamp'];
        promise = this.pgLookupRepo.getCorpAdjustmentReport(body.fiscalMonth)
          .then(rows => _.orderBy(rows, ['sales_country_name', 'sales_territory_code', 'scms_value']));
        break;

      case 'sales-split-percentage':
        excelSheetname = ['Sales Split Percentage'];
        excelHeaders = ['Account Id', 'Company Code', 'Sub Account Code', 'Sales Territory Code', 'Percentage Value', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['account_code', 'company_code', 'sub_account_code', 'sales_territory_code', 'split_percentage', 'fiscal_month_id', 'update_owner', 'update_datetimestamp'];
        promise = this.pgLookupRepo.getSalesSplitPercentageReport(body.fiscalMonth);
        break;

      case 'service-map':
        excelSheetname = ['Service Mapping Upload'];
        excelHeaders = ['Sales Territory Code', 'Sales Level 1 Code', 'Sales Level 2 Code', 'Sales Level 3 Code', 'Sales Level 4 Code', 'Sales Level 5 Code', 'Sales Level 6 Code',
          'Legal Entity', 'Technology Group', 'Business Unit', 'Product Family', 'Split Percentage', 'Fiscal Month', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['sales_territory_code', 'sales_node_level_1_code', 'sales_node_level_2_code', 'sales_node_level_3_code', 'sales_node_level_4_code', 'sales_node_level_5_code',
          'sales_node_level_6_code', 'business_entity', 'technology_group', 'business_unit', 'product_family', 'split_percentage', 'fiscal_month_id', 'update_owner', 'update_datetimestamp'];
        promise = this.pgLookupRepo.getServiceMapReport(body.fiscalMonth);
        break;

      case 'service-training':
        excelSheetname = ['Service Training Upload'];
        excelHeaders = ['Sales Territory Code', 'Sales Level 3 Code', 'External Theater', 'Sales Country', 'Product Family', 'Split Percentage', 'Fiscal Year', 'Uploaded By', 'Uploaded Date'];
        excelProperties = ['sales_territory_code', 'sales_node_level_3_code', 'ext_theater_name', 'sales_country_name', 'product_family', 'split_percentage',
          'fiscal_year', 'update_owner', 'update_datetimestamp'];
        promise = this.pgLookupRepo.getServiceTrainingReport(body.fiscalYear);
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
          this.pgLookupRepo.getDriverSL3Report(req.dfa),
          this.pgLookupRepo.getShipmentDriverPFReport(req.dfa),
          this.pgLookupRepo.getRoll3DriverWithBEReport(req.dfa)
        ]);
        break;

      case 'valid-slpf-driver':
        excelSheetname = ['SLPF Validation'];
        excelHeaders = ['Measure Name', 'Sub-Measure Name', 'Sales Value', 'Product Value',	'SCMS Value',	'Business Entity Value', 'Internal BE Value'];
        excelProperties = ['measure.name', 'sm.name', 'input_sales_value', 'input_product_value', 'input_scms_value', 'input_entity_value', 'input_internal_be_value'];
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId),
          this.pgLookupRepo.getSLPFDriverReport(body.fiscalMonth, body.submeasureKeys)
        ])
          .then(results => {
            this.measures = results[0];
            this.submeasures = results[1];
            return results[2].map(obj => this.transformAddMeasureAndSubmeasure(obj));
          });
        break;

      case 'submeasure':
        multiSheetReport = true;
        excelSheetname = [['Original'], ['SM History'], ['As Of Now']];
        excelHeaders = [['Measure Name', 'Sub-Measure Key', 'Sub-Measure Name', 'Description', 'Source',
          'IFL Sales Level', 'IFL Product Level', 'IFL SCMS Level', 'IFL Legal Entity Level', 'IFL IBE Level', 'IFL GL Segments',
          'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing', 'P/L Node', 'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3',
          'Manual Mapping', 'MM Sales Level', 'MM Product Level', 'MM SCMS Level', 'MM Legal Entity Level', 'MM IBE Level',
          'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Rule 6', 'Rule 7', 'Rule 8', 'Rule 9', 'Rule 10', 'Rule 11', 'Rule 12', 'Rule 13', 'Rule 14', 'Rule 15',
          'Is Group Sub-Measure', 'Is Group - Allocation Required', 'Grouping Sub-Measure', 'Sub-Measure Type', 'Retained Earnings', 'Transition', 'Service', 'Pass Through', 'Corp Revenue', 'DualGaap', '2Tier'
          , 'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'],

          ['Measure Name', 'Sub-Measure Key', 'Sub-Measure Name', 'Description', 'Source',
            'IFL Sales Level', 'IFL Product Level', 'IFL SCMS Level', 'IFL Legal Entity Level', 'IFL IBE Level', 'IFL GL Segments',
            'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing', 'P/L Node', 'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3',
            'Manual Mapping', 'MM Sales Level', 'MM Product Level', 'MM SCMS Level', 'MM Legal Entity Level', 'MM IBE Level',
            'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Rule 6', 'Rule 7', 'Rule 8', 'Rule 9', 'Rule 10', 'Rule 11', 'Rule 12', 'Rule 13', 'Rule 14', 'Rule 15',
            'Is Group Sub-Measure', 'Is Group - Allocation Required', 'Grouping Sub-Measure', 'Sub-Measure Type', 'Retained Earnings', 'Transition', 'Service', 'Pass Through', 'Corp Revenue', 'DualGaap', '2Tier'
            , 'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'],

          ['Measure Name', 'Sub-Measure Key', 'Sub-Measure Name', 'Description', 'Source',
            'IFL Sales Level', 'IFL Product Level', 'IFL SCMS Level', 'IFL Legal Entity Level', 'IFL IBE Level', 'IFL GL Segments',
            'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing', 'P/L Node', 'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3',
            'Manual Mapping', 'MM Sales Level', 'MM Product Level', 'MM SCMS Level', 'MM Legal Entity Level', 'MM IBE Level',
            'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Rule 6', 'Rule 7', 'Rule 8', 'Rule 9', 'Rule 10', 'Rule 11', 'Rule 12', 'Rule 13', 'Rule 14', 'Rule 15',
            'Is Group Sub-Measure', 'Is Group - Allocation Required', 'Grouping Sub-Measure', 'Sub-Measure Type', 'Retained Earnings', 'Transition', 'Service', 'Pass Through', 'Corp Revenue', 'DualGaap', '2Tier'
            , 'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date']];

        excelProperties = [['measureName', 'submeasureKey', 'name', 'desc', 'sourceName',
          'inputFilterLevel.salesLevel', 'inputFilterLevel.productLevel', 'inputFilterLevel.scmsLevel', 'inputFilterLevel.entityLevel', 'inputFilterLevel.internalBELevel', 'inputFilterLevel.glSegLevel',
          'startFiscalMonth', 'endFiscalMonth', 'processingTime', 'pnlnodeGrouping', 'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]',
          'indicators.manualMapping', 'manualMapping.salesLevel', 'manualMapping.productLevel', 'manualMapping.scmsLevel', 'manualMapping.entityLevel', 'manualMapping.internalBELevel',
          'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'rules[5]', 'rules[6]', 'rules[7]', 'rules[8]', 'rules[9]', 'rules[10]', 'rules[11]', 'rules[12]', 'rules[13]', 'rules[14]',
          'indicators.groupFlag', 'indicators.allocationRequired', 'groupingSubmeasureName', 'categoryType', 'indicators.retainedEarnings', 'indicators.transition', 'indicators.service', 'indicators.passThrough', 'indicators.corpRevenue', 'indicators.dualGaap', 'indicators.twoTier', 'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

          ['measureName', 'submeasureKey', 'name', 'desc', 'sourceName',
            'inputFilterLevel.salesLevel', 'inputFilterLevel.productLevel', 'inputFilterLevel.scmsLevel', 'inputFilterLevel.entityLevel', 'inputFilterLevel.internalBELevel', 'inputFilterLevel.glSegLevel',
            'startFiscalMonth', 'endFiscalMonth', 'processingTime', 'pnlnodeGrouping', 'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]',
            'indicators.manualMapping', 'manualMapping.salesLevel', 'manualMapping.productLevel', 'manualMapping.scmsLevel', 'manualMapping.entityLevel', 'manualMapping.internalBELevel',
            'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'rules[5]', 'rules[6]', 'rules[7]', 'rules[8]', 'rules[9]', 'rules[10]', 'rules[11]', 'rules[12]', 'rules[13]', 'rules[14]',
            'indicators.groupFlag', 'indicators.allocationRequired', 'groupingSubmeasureName', 'categoryType', 'indicators.retainedEarnings', 'indicators.transition', 'indicators.service', 'indicators.passThrough', 'indicators.corpRevenue', 'indicators.dualGaap', 'indicators.twoTier', 'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

          ['measureName', 'submeasureKey', 'name', 'desc', 'sourceName',
            'inputFilterLevel.salesLevel', 'inputFilterLevel.productLevel', 'inputFilterLevel.scmsLevel', 'inputFilterLevel.entityLevel', 'inputFilterLevel.internalBELevel', 'inputFilterLevel.glSegLevel',
            'startFiscalMonth', 'endFiscalMonth', 'processingTime', 'pnlnodeGrouping', 'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]',
            'indicators.manualMapping', 'manualMapping.salesLevel', 'manualMapping.productLevel', 'manualMapping.scmsLevel', 'manualMapping.entityLevel', 'manualMapping.internalBELevel',
            'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'rules[5]', 'rules[6]', 'rules[7]', 'rules[8]', 'rules[9]', 'rules[10]', 'rules[11]', 'rules[12]', 'rules[13]', 'rules[14]',
            'indicators.groupFlag', 'indicators.allocationRequired', 'groupingSubmeasureName', 'categoryType', 'indicators.retainedEarnings', 'indicators.transition', 'indicators.service', 'indicators.passThrough', 'indicators.corpRevenue', 'indicators.dualGaap', 'indicators.twoTier', 'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate']];
        if (req.dfa.module.moduleId === 1) {
          excelHeaders[2].splice(43, 0, 'HW Split %', 'SW Split %');
          excelProperties[2].splice(43, 0, 'manualMixHw', 'manualMixSw');
        }

        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.sourceRepo.getManyActive(),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId),
          this.productClassUploadPgRepo.getMany({fiscalMonth: req.dfa.module.fiscalMonth})
        ])
          .then(results => {
            this.measures = results[0];
            this.sources = results[1];
            this.submeasures = results[2];
            const pgManualMixes = results[3];
            return Promise.all([
              this.submeasureRepo.getManyEarliestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
                .then(docs => docs.map(doc => this.transformSubmeasure(doc)))
                .then(vals => _.orderBy(vals, ['measureName', 'name'])),
              this.submeasureRepo.getMany({setSort: 'name', moduleId})
                .then(docs => docs.map(doc => this.transformSubmeasure(doc)))
                .then(vals => _.orderBy(vals, ['measureName', 'name'])),
              this.submeasureRepo.getManyLatestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
                .then(docs => docs.map(doc => {
                  let sm = this.transformSubmeasure(doc);
                  if (req.dfa.module.moduleId === 1) {
                    sm = this.transformAddManualMix(sm, pgManualMixes);
                  }
                  return sm;
                }))
                .then(vals => _.orderBy(vals, ['measureName', 'name']))
            ]);

          });
        break;

      case 'allocation-rule':
        multiSheetReport = true;
        excelSheetname = [['Original'], ['Rule History'], ['As Of Now']];
        excelHeaders = [['Rule Name', 'Old Name', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'IBE Match', 'Legal Entity Match', 'Country', 'External Theater', 'GL Segments',
          'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'IBE Select',
          'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Updated By', 'Updated Date'],

          ['Rule Name', 'Old Name', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'IBE Match', 'Legal Entity Match', 'Country', 'External Theater', 'GL Segments',
            'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'IBE Select',
            'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Updated By', 'Updated Date'],

          ['Rule Name', 'Old Name', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'IBE Match', 'Legal Entity Match', 'Country', 'External Theater', 'GL Segments',
            'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'IBE Select', 'In Use', 'In Use By',
            'Status', 'Approval Status', 'Approved By', 'Approved Date', 'Created By', 'Created Date', 'Updated By', 'Updated Date']];

        excelProperties = [['name', 'oldName', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'beMatch', 'legalEntityMatch', 'countryMatch', 'extTheaterMatch', 'glSegmentsMatch',
          'sl1Select', 'sl2Select', 'sl3Select', 'prodTGSelect', 'prodBUSelect', 'prodPFSelect', 'scmsSelect', 'beSelect',
          'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

          ['name', 'oldName', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'beMatch', 'legalEntityMatch', 'countryMatch', 'extTheaterMatch', 'glSegmentsMatch',
            'sl1Select', 'sl2Select', 'sl3Select', 'prodTGSelect', 'prodBUSelect', 'prodPFSelect', 'scmsSelect', 'beSelect',
            'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

          ['name', 'oldName', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'beMatch', 'legalEntityMatch', 'countryMatch', 'extTheaterMatch', 'glSegmentsMatch',
            'sl1Select', 'sl2Select', 'sl3Select', 'prodTGSelect', 'prodBUSelect', 'prodPFSelect', 'scmsSelect', 'beSelect', 'inUse', 'inUseBy',
            'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate']];
        const rulePromises = [
          this.allocationRuleRepo.getManyEarliestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
            .then(docs => docs.map(doc => this.transformRule(doc)))
            .then(vals => _.orderBy(vals, ['name'])),
          this.allocationRuleRepo.getMany({setSort: 'name', moduleId})
            .then(docs => docs.map(doc => this.transformRule(doc)))
            .then(vals => _.orderBy(vals, ['name']))
        ];

        rulePromises.push(Promise.all([
            this.allocationRuleRepo.getManyLatestGroupByNameActive(moduleId),
            this.submeasureRepo.getManyLatestGroupByNameActive(moduleId)
          ]).then(results => {
            const rules = results[0];
            const sms = results[1];
            rules.forEach(rule => {
              const smsUsingRule = [];
              sms.forEach(sm => {
                if (_.includes(sm.rules, rule.name)) {
                  smsUsingRule.push(sm.name);
                }
              });
              rule['inUse'] = smsUsingRule.length || '';
              rule['inUseBy'] = smsUsingRule;
            });
            return rules;
          }).then(docs => _.sortBy(docs, 'name'))
            .then(docs => docs.map(doc => this.transformRule(doc)))
            .then(vals => _.orderBy(vals, ['name']))
        );
        promise = Promise.all(rulePromises);
        break;

      case 'rule-submeasure':
        excelSheetname = ['History'];
        excelHeaders = ['Fiscal Month', 'Start Fiscal Month', 'End Fiscal Month', 'Sub-Measure Key', 'Sub-Measure Name', 'Description',  'Measure Name', 'Source System',
          'IFL Sales Level', 'IFL Product Level', 'IFL SCMS Level', 'IFL Legal Entity Level', 'IFL IBE Level', 'IFL GL Segments', 'Frequency/Timing of Sub-measure Processing',
          'Manual Mapping', 'MM Sales Level', 'MM Product Level', 'MM SCMS Level', 'MM Legal Entity Level', 'MM IBE Level',
          'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Rule 6', 'Rule 7', 'Rule 8', 'Rule 9', 'Rule 10', 'Rule 11', 'Rule 12', 'Rule 13', 'Rule 14', 'Rule 15',
          'Is Group Sub-Measure', 'Is Group - Allocation Required', 'Grouping Sub-Measure',
          'Sub-Measure Type', 'Retained Earnings', 'Transition', 'Service', 'Pass Through', 'Corp Revenue', 'DualGaap', '2Tier',
          'Approval Status', 'Created By', 'Created Date', 'Updated By', 'Updated Date'];

        excelProperties = [
          'fiscalMonth', 'sm.startFiscalMonth', 'sm.endFiscalMonth', 'sm.submeasureKey', 'sm.name', 'sm.desc', 'sm.measureName', 'sm.sourceName',
          'sm.inputFilterLevel.salesLevel', 'sm.inputFilterLevel.productLevel', 'sm.inputFilterLevel.scmsLevel', 'sm.inputFilterLevel.entityLevel',
          'sm.inputFilterLevel.internalBELevel', 'sm.inputFilterLevel.glSegLevel', 'sm.processingTime', 'sm.indicators.manualMapping',
          'sm.manualMapping.salesLevel', 'sm.manualMapping.productLevel', 'sm.manualMapping.scmsLevel', 'sm.manualMapping.entityLevel', 'sm.manualMapping.internalBELevel',
          'sm.rules[0]', 'sm.rules[1]', 'sm.rules[2]', 'sm.rules[3]', 'sm.rules[4]', 'sm.rules[5]', 'sm.rules[6]', 'sm.rules[7]', 'sm.rules[8]', 'sm.rules[9]', 'sm.rules[10]', 'sm.rules[11]', 'sm.rules[12]', 'sm.rules[13]', 'sm.rules[14]',
          'sm.indicators.groupFlag', 'sm.indicators.allocationRequired', 'sm.groupingSubmeasureName', 'sm.categoryType',
          'sm.indicators.retainedEarnings', 'sm.indicators.transition', 'sm.indicators.service', 'sm.indicators.passThrough', 'sm.indicators.corpRevenue', 'sm.indicators.dualGaap', 'sm.indicators.twoTier', 'sm.status', 'sm.createdBy',
          'sm.createdDate', 'sm.updatedBy', 'sm.updatedDate'];

        if (req.dfa.module.moduleId === 1) {
          excelHeaders.splice(40, 0, 'HW Split %', 'SW Split %');
          excelProperties.splice(40, 0, 'sm.manualMixHw', 'sm.manualMixSw');
        }

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
                this.productClassUploadPgRepo.getMany({fiscalMonth: fimo})
              ]));
            });
            return Promise.all(promises);
          })
          .then(results => {
            const rows: AnyObj[] = [];
            results.forEach(result => {
              const fiscalMonth = result[0];
              this.submeasures = _.sortBy(result[1], 'name');
              const pgManualMixes = result[2];
              let sms = this.submeasures.map(sm => this.transformSubmeasure(sm)); // update this for more props if needed
              if (req.dfa.module.moduleId === 1) {
                sms = this.submeasures.map(sm => this.transformAddManualMix(sm, pgManualMixes));
              }
              sms.forEach(sm => {
                rows.push({fiscalMonth, sm});
              });
            });
            return _.orderBy(rows, ['fiscalMonth', 'sm.measureName', 'sm.name']);
          });
        break;

      case 'input-data':
        excelSheetname = ['Input System Data'];
        excelHeaders = ['Measure Name', 'Sub Measure Name', 'Product', 'Sales', 'Entity', 'SCMS', 'Amount', 'Uploaded By', 'Last Updated Date'];
        excelProperties = ['measure_name', 'sub_measure_name', 'input_product_value', 'input_sales_value', 'input_entity_value', 'input_scms_value', 'amount', 'update_owner', 'update_datetimestamp'];
        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.submeasureRepo.getManyLatestGroupByNameActive(moduleId),
          this.pgLookupRepo.getInputSystemDataReport(body.fiscalMonth, body.submeasureKeys)
        ])
          .then(results => {
            this.measures = results[0];
            this.submeasures = results[1];
            const rtn = results[2].map(obj => this.transformAddMeasureAndSubmeasure(obj));
            return _.sortBy(rtn, 'sm.name');
          });
        break;
      default:
        next(new ApiError('Bad report type.', null, 400));
        return;
    }

    if (multiSheetReport) {
      if ((excelHeaders && excelHeaders.length < 2) || excelSheetname.length < 2 || excelProperties.length < 2) {
        next(new ApiError(`excelHeaders, excelProperties, excelSheetname array lengths must be > 1 for multisheet report.`, body, 400));
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
                  return shUtil.convertToPSTTime(val);
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
              return shUtil.convertToPSTTime(val);
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

  transformAddManualMix(sm, manualMixes) {
    if (shUtil.isManualMix(sm)) {
      const recHw = _.find(manualMixes, {submeasureKey: sm.submeasureKey, splitCategory: 'HARDWARE'});
      const recSw = _.find(manualMixes, {submeasureKey: sm.submeasureKey, splitCategory: 'SOFTWARE'});
      sm.manualMixHw = recHw && recHw.splitPercentage * 100;
      sm.manualMixSw = recSw && recSw.splitPercentage * 100;
    }
    return sm;
  }

  transformRule(rule) {
    rule = svrUtil.docToObject(rule);

    return rule;
  }

}

