/*tslint:disable max-line-length  */
import {injectable} from 'inversify';
import * as _ from 'lodash';
import DollarUploadController from '../dollar-upload/controller';
import MappingUploadController from '../mapping-upload/controller';
import DeptUploadController from '../dept-upload/controller';
import PgLookupRepo from '../../pg-lookup/repo';
import {ApiError} from '../../../lib/common/api-error';
import {svrUtil} from '../../../lib/common/svr-util';
import xlsx from 'node-xlsx';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {shUtil} from '../../../../shared/shared-util';
import SubmeasureRepo from '../../common/submeasure/repo';
import AllocationRuleRepo from '../../common/allocation-rule/repo';
import MeasureRepo from '../../common/measure/repo';
import SourceRepo from '../../common/source/repo';
import AnyObj from '../../../../shared/models/any-obj';
import DollarUploadRepo from '../dollar-upload/repo';
import MappingUploadRepo from '../mapping-upload/repo';
import DeptUploadRepo from '../dept-upload/repo';
import {DollarUploadPgRepo} from '../dollar-upload/pgrepo';
import {MappingUploadPgRepo} from '../mapping-upload/pgrepo';
import {DeptUploadPgRepo} from '../dept-upload/pgrepo';
import {Submeasure} from '../../../../shared/models/submeasure';

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
    private postgresRepo: PgLookupRepo,
    private submeasureRepo: SubmeasureRepo,
    private allocationRuleRepo: AllocationRuleRepo,
    private measureRepo: MeasureRepo,
    private sourceRepo: SourceRepo
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
        excelHeaders = ['Fiscal Month', 'Sub Measure Name', 'Input Product Value', 'Input Sales Value', 'Legal Entity', 'Int Business Entity', 'SCMS', 'Amount'];
        excelProperties = ['fiscalMonth', 'submeasureName', 'productValue', 'salesValue', 'leValue', 'beValue', 'scmsValue', 'amount'];

        promise = this.submeasureRepo.getManyLatestGroupByNameActive(moduleId)
          .then(submeasures => {
            this.submeasures = submeasures;
            return this.dollarUploadPgRepo.getMany(body)
              .then(docs => docs.map(doc => this.transformAddSubmeasureName(doc)));
          })
        break;
      case 'mapping-upload':
        excelSheetname = ['Manual Mapping Data'];
        excelHeaders = ['Fiscal Month', 'Sub Measure Name', 'Input Product Value', 'Input Sales Value', 'Legal Entity', 'Int Business Entity', 'SCMS', 'Percentage'];
        excelProperties = ['fiscalMonth', 'submeasureName', 'productValue', 'salesValue', 'leValue', 'beValue', 'scmsValue', 'percentage'];
        promise = this.submeasureRepo.getManyLatestGroupByNameActive(moduleId)
          .then(submeasures => {
            this.submeasures = submeasures;
            return this.mappingUploadPgRepo.getMany(body)
              .then(docs => docs.map(doc => this.transformAddSubmeasureName(doc)));
          })

        break;
      case 'product-hierarchy':
        excelSheetname = ['Product Hierarchy'];
        excelHeaders = ['Technology Group', 'Business Unit', 'Product Family'];
        excelProperties = ['technology_group_id', 'business_unit_id', 'product_family_id'];
        promise = this.postgresRepo.getProductHierarchyReport();
        break;
      case 'sales-hierarchy':
        excelSheetname = ['Sales Hierarchy'];
        excelHeaders = ['Sales Territory 1', 'Sales Territory 2', 'Sales Territory 3', 'Sales Territory 4', 'Sales Territory 5', 'Sales Territory 6'];
        excelProperties = ['l1_sales_territory_descr', 'l2_sales_territory_descr', 'l3_sales_territory_descr', 'l4_sales_territory_descr',
          'l5_sales_territory_descr', 'l6_sales_territory_descr'];
        promise = this.postgresRepo.getSalesHierarchyReport();
        break;
      case 'dept-upload':
        excelSheetname = ['Dept Upload'];
        excelHeaders = ['Sub-Measure Name', 'Node Value', 'GL Account'];
        excelProperties = ['submeasureName', 'nodeValue', 'glAccount'];
        promise = this.submeasureRepo.getManyLatestGroupByNameActive(moduleId)
          .then(submeasures => {
            this.submeasures = submeasures;
            return this.deptUploadPgRepo.getMany(body)
              .then(docs => docs.map(doc => this.transformAddSubmeasureName(doc)));
          })

        break
      case 'submeasure-grouping':
        excelSheetname = ['Submeasure Grouping'];
        excelHeaders = ['Submeasure Name', 'Group Submeasure Name', 'Created By', 'Create Time', 'Updated By', 'Update Time'];
        excelProperties = ['sub_measure_name', 'group_sub_measure_name', 'create_owner', 'create_datetimestamp', 'update_owner', 'update_datetimestamp'];
        promise = this.postgresRepo.getSubmeasureGroupingReport();
        break;
      case '2t-submeasure-list':
        excelSheetname = ['2t Submeasure List'];
        excelHeaders = ['Submeasure Name', 'Fiscal Month Id', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'];
        excelProperties = ['sub_measure_name', 'fiscal_month_id', 'create_owner', 'create_datetimestamp', 'update_owner', 'update_datetimestamp'];
        excelFilename = `2T_Sub_Measure_List_Report_${req.dfa.fiscalMonths.prof}.xlsx`;
        promise = this.postgresRepo.get2TSebmeasureListReport(req.dfa.fiscalMonths.prof);
        break;
      case 'disti-direct':
        excelSheetname = ['Disti to Direct'];
        excelHeaders = ['Group ID', 'Node Type', 'Sales Finance Hierarchy', 'Node Code', 'External Theater', 'Fiscal Month Id', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'];
        excelProperties = ['group_id', 'node_type', 'sales_finance_hierarchy', 'node_code', 'ext_theater_name', 'fiscal_month_id', 'create_user', 'create_datetimestamp', 'update_user', 'update_datetimestamp'];
        promise = this.postgresRepo.getDistiToDirectMappingReport();
        break;
      case 'alternate-sl2':
        excelSheetname = ['Alternate SL2'];
        excelHeaders = ['Actual SL2', 'Alternate SL2', 'Alternate Country', 'Fiscal Month Id', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'];
        excelProperties = ['actual_sl2_code', 'alternate_sl2_code', 'alternate_country_name', 'fiscal_month_id', 'create_user', 'create_datetimestamp', 'update_user', 'update_datetimestamp'];
        promise = this.postgresRepo.getAlternateSL2Report(body.fiscalMonth);
        break;
      case 'corp-adjustment':
        excelSheetname = ['Corp Adjustment'];
        excelHeaders = ['Country Name', 'Sales Territory Code', 'SCMS Value', 'Fiscal Month Id', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'];
        excelProperties = ['sales_country_name', 'sales_territory_code', 'scms_value', 'fiscal_month_id', 'create_user', 'create_datetimestamp', 'update_user', 'update_datetimestamp'];
        promise = this.postgresRepo.getCorpAdjustmentReport(body.fiscalMonth);
        break;
      case 'sales-split-percentage':
        excelSheetname = ['Sales Split Percentage'];
        excelHeaders = ['Account Id', 'Company Code', 'Sub Account Code', 'Sales Territory Code', 'Percentage Value', 'Fiscal Month Id', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'];
        excelProperties = ['account_code', 'company_code', 'sub_account_code', 'sales_territory_code', 'split_percentage', 'fiscal_month_id', 'create_owner', 'create_datetimestamp', 'update_owner', 'update_datetimestamp'];
        promise = this.postgresRepo.getSalesSplitPercentageReport(body.fiscalMonth);
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
          this.postgresRepo.getAdjustmentPFReport(),
          this.postgresRepo.getDriverSL3Report(),
          this.postgresRepo.getShipmentDriverPFReport(),
          this.postgresRepo.getRoll3DriverWithBEReport()
        ]);
        break;
      case 'submeasure':
        multiSheetReport = true;
        excelSheetname = [['Original'], ['SM History'], ['As Of Now']];
        excelHeaders = [['Measure Name', 'Sub Measure Name', 'Description', 'Source', 'Adjustment Type Id', 'Sales Level', 'Product Level', 'SCMS Level', 'Legal Entity Level', 'BE Level', 'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing', 'P/L Node',
          'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3', 'Manual Sales Level', 'Manual Product Level', 'Manual SCMS Level', 'Manual Legal Entity Level', 'Manual BE Level'
          , 'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Grouping Submeasure', 'Submeasure Type', 'Retained Earnings', 'Transition', 'CorpRevenue', 'DualGapp', '2Tier'
          , 'Status', 'Approval Status', 'Approved By', 'Approval Date', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'],

          ['Measure Name', 'Sub Measure Name', 'Description', 'Source', 'Adjustment Type Id', 'Sales Level', 'Product Level', 'SCMS Level', 'Legal Entity Level', 'BE Level', 'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing', 'P/L Node',
            'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3', 'Manual Sales Level', 'Manual Product Level', 'Manual SCMS Level', 'Manual Legal Entity Level', 'Manual BE Level', 'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Grouping Submeasure', 'Submeasure Type', 'Retained Earnings', 'Transition', 'CorpRevenue', 'DualGapp', '2Tier'
            , 'Status', 'Approval Status', 'Approved By', 'Approval Date', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'],

          ['Measure Name', 'Sub Measure Name', 'Description', 'Source', 'Adjustment Type Id', 'Sales Level', 'Product Level', 'SCMS Level', 'Legal Entity Level', 'BE Level', 'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing', 'P/L Node',
            'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3', 'Manual Sales Level', 'Manual Product Level', 'Manual SCMS Level', 'Manual Legal Entity Level', 'Manual BE Level', 'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Grouping Submeasure', 'Submeasure Type', 'Retained Earnings', 'Transition', 'CorpRevenue', 'DualGapp', '2Tier'
            , 'Status', 'Approval Status', 'Approved By', 'Approval Date', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date']];

        excelProperties = [['measureName', 'name', 'desc', 'sourceName', 'sourceSystemAdjTypeId', 'inputFilterLevel.salesLevel', 'inputFilterLevel.productLevel', 'inputFilterLevel.scmsLevel', 'inputFilterLevel.legalEntityLevel', 'inputFilterLevel.beLevel', 'startFiscalMonth', 'endFiscalMonth', 'processingTime', 'pnlnodeGrouping',
          'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]', 'manualMapping.salesLevel', 'manualMapping.productLevel', 'manualMapping.scmsLevel', 'manualMapping.legalEntityLevel', 'manualMapping.beLevel', 'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'groupingSubmeasureName', 'categoryType', 'indicators.retainedEarnings', 'indicators.transition', 'indicators.corpRevenue', 'indicators.dualGaap', 'indicators.twoTier', 'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

          ['measureName', 'name', 'desc', 'sourceName', 'sourceSystemAdjTypeId', 'inputFilterLevel.salesLevel', 'inputFilterLevel.productLevel', 'inputFilterLevel.scmsLevel', 'inputFilterLevel.legalEntityLevel', 'inputFilterLevel.beLevel', 'startFiscalMonth', 'endFiscalMonth', 'processingTime', 'pnlnodeGrouping',
            'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]', 'manualMapping.salesLevel', 'manualMapping.productLevel', 'manualMapping.scmsLevel', 'manualMapping.legalEntityLevel', 'manualMapping.beLevel', 'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'groupingSubmeasureName', 'categoryType', 'indicators.retainedEarnings', 'indicators.transition', 'indicators.corpRevenue', 'indicators.dualGaap', 'indicators.twoTier', 'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

          ['measureName', 'name', 'desc', 'sourceName', 'sourceSystemAdjTypeId', 'inputFilterLevel.salesLevel', 'inputFilterLevel.productLevel', 'inputFilterLevel.scmsLevel', 'inputFilterLevel.legalEntityLevel', 'inputFilterLevel.beLevel', 'startFiscalMonth', 'endFiscalMonth', 'processingTime', 'pnlnodeGrouping',
            'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]', 'manualMapping.salesLevel', 'manualMapping.productLevel', 'manualMapping.scmsLevel', 'manualMapping.legalEntityLevel', 'manualMapping.beLevel', 'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'groupingSubmeasureName', 'categoryType', 'indicators.retainedEarnings', 'indicators.transition', 'indicators.corpRevenue', 'indicators.dualGaap', 'indicators.twoTier', 'status', 'approvedOnce', 'approvedBy', 'approvedDate', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate']];
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
                .then(docs => docs.map(doc => this.transformSubmeasure(doc))),
              this.submeasureRepo.getMany({setSort: 'name', moduleId})
                .then(docs => docs.map(doc => this.transformSubmeasure(doc))),
              this.submeasureRepo.getManyLatestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
                .then(docs => docs.map(doc => this.transformSubmeasure(doc))),
            ]);

          })

        break;
      case 'allocation-rule':
        multiSheetReport = true;
        excelSheetname = [['Original'], ['Rule History'], ['As Of Now']];
        excelHeaders = [['RuleName', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'Legal Entity Match', 'BE Match',
                          'Sales Select', 'SCMS Select', 'BE Select', 'Status', 'Created By', 'Created Date', 'Updated By', 'Updated Date'],

                        ['RuleName', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'Legal Entity Match', 'BE Match',
                          'Sales Select', 'SCMS Select', 'BE Select', 'Status', 'Created By', 'Created Date', 'Updated By', 'Updated Date'],

                        ['RuleName', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'Legal Entity Match', 'BE Match',
                          'Sales Select', 'SCMS Select', 'BE Select', 'Status', 'Created By', 'Created Date', 'Updated By', 'Updated Date']];

        excelProperties = [['name', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'legalEntityMatch', 'beMatch',
                          'sl1Select', 'scmsSelect', 'beSelect', 'status', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

                            ['name', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'legalEntityMatch', 'beMatch',
                              'sl1Select', 'scmsSelect', 'beSelect', 'status', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'],

                            ['name', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'legalEntityMatch', 'beMatch',
                              'sl1Select', 'scmsSelect', 'beSelect', 'status', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate']];
        promise = Promise.all([
          this.allocationRuleRepo.getManyEarliestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
            .then(docs => docs.map(doc => this.transformRule(doc))),
          this.allocationRuleRepo.getMany({setSort: 'name', moduleId})
            .then(docs => docs.map(doc => this.transformRule(doc))),
          this.allocationRuleRepo.getManyLatestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
            .then(docs => docs.map(doc => this.transformRule(doc))),
        ]);
        break;

      case 'rule-submeasure':
        // multiSheetReport = true; ?? if multisheet report uncomment this line
        excelSheetname = ['History'];
        excelHeaders = ['START_FISCAL_PERIOD_ID', 'END_FISCAL_PERIOD_ID', 'Sub_Measure_Key', 'SUB_MEASURE_NAME', 'MEASURE_NAME', 'SOURCE_SYSTEM_NAME', 'Sales Level', 'Product Level', 'SCMS Level', 'Legal Entity Level', 'BE Level',
          'RuleName', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'Legal Entity Match', 'BE Match', 'Sales Select', 'SCMS Select', 'BE Select', 'Status', 'Updated By', 'Updated Date'];

        excelProperties = ['startFiscalMonth', 'endFiscalMonth', 'submeasureKey', 'name', 'measureName', 'sourceName', 'salesLevel', 'productLevel', 'scmsLevel', 'legalEntityLevel', 'beLevel',
          'ruleName', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'legalEntityMatch', 'beMatch', 'sl1Select', 'scmsSelect', 'beSelect', 'status', 'updatedBy', 'updatedDate'];

        promise = Promise.all([
          this.measureRepo.getManyActive({moduleId}),
          this.sourceRepo.getManyActive(),
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
                this.submeasureRepo.getManyLatestGroupByNameActive(moduleId, {updatedDate: {$lt: new Date(shUtil.getCutoffDateStrFromFiscalMonth(fimo))}}),
                this.allocationRuleRepo.getManyLatestGroupByNameActive(moduleId, {updatedDate: {$lt: new Date(shUtil.getCutoffDateStrFromFiscalMonth(fimo))}}),
              ]));
            });
            return Promise.all(promises);
          })
          .then(results => {
            const rows: AnyObj[] = [];
            results.forEach(result => {
              this.submeasures = result[0];
              this.rules = _.sortBy(result[1], 'name');
              const sms = this.submeasures.map(sm => this.transformSubmeasure(sm)); // update this for more props if needed
              const rules = this.rules.map(rule => this.transformRule(rule)); // update this for more props if needed
              let ruleSms: AnyObj[];
              rules.forEach(rule => {
                ruleSms = _.sortBy(sms.filter(sm => _.includes(sm.rules, rule.name)), 'name');
                ruleSms.forEach(sm => {
                  rows.push({
                    startFiscalMonth: sm.startFiscalMonth,
                    endFiscalMonth: sm.endFiscalMonth,
                    submeasureKey: sm.submeasureKey,
                    name: sm.name,
                    measureName: sm.measureName,
                    sourceName: sm.sourceName,
                    salesLevel: sm.inputFilterLevel.salesLevel,
                    productLevel: sm.inputFilterLevel.productLevel,
                    scmsLevel: sm.inputFilterLevel.scmsLevel,
                    legalEntityLevel: sm.inputFilterLevel.legalEntityLevel,
                    beLevel: sm.inputFilterLevel.beLevel,

                    ruleName: rule.name,
                    driverName: rule.driverName,
                    period: rule.period,
                    salesMatch: rule.salesMatch,
                    productMatch: rule.productMatch,
                    scmsMatch: rule.scmsMatch,
                    legalEntityMatch: rule.legalEntityMatch,
                    beMatch: rule.beMatch,
                    sl1Select: rule.sl1Select,
                    scmsSelect: rule.scmsSelect,
                    beSelect: rule.beSelect,
                    status: rule.status,
                    updatedBy: rule.updatedBy,
                    updatedDate: rule.updatedDate
                    // etc, etc,

                  });
                });
              });
            });
            return rows;
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

  transformAddSubmeasureName(obj) {
    obj = svrUtil.docToObject(obj);
    const sm = _.find(this.submeasures, {submeasureKey: obj.submeasureKey});
    obj.submeasureName = sm && sm.name;
    return obj;
  }

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
        promise = this.postgresRepo.getProductHierarchyReport();
        break
      case 'sales-hierarchy':
        promise = this.postgresRepo.getSalesHierarchyReport();
        break
      case 'dept-upload':
        delete req.query.moduleId;
        promise = this.deptUploadCtrl.getManyPromise(req);
        break
      case 'submeasure-grouping':
        promise = this.postgresRepo.getSubmeasureGroupingReport();
        break
      case '2t-submeasure-list':
        promise = this.postgresRepo.get2TSebmeasureListReport();
        break
      case 'disti-direct':
        promise = this.postgresRepo.getDistiToDirectMappingReport();
        break
      case 'alternate-sl2':
        promise = this.postgresRepo.getAlternateSL2Report();
        break
      case 'corp-adjustment':
        promise = this.postgresRepo.getCorpAdjustmentReport();
        break
      case 'sales-split-percentage':
        promise = this.postgresRepo.getSalesSplitPercentageReport();
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

