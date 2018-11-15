import {injectable} from 'inversify';
import * as _ from 'lodash';
import DollarUploadController from '../dollar-upload/controller';
import MappingUploadController from '../mapping-upload/controller';
import DeptUploadController from '../dept-upload/controller';
import PgLookupRepo from '../../common/pg-lookup/repo';
import {ApiError} from '../../../lib/common/api-error';
import {svrUtil} from '../../../lib/common/svr-util';
import xlsx from 'node-xlsx';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {shUtil} from '../../../../shared/shared-util';
import SubmeasureRepo from "../../common/submeasure/repo";
import AllocationRuleRepo from "../../common/allocation-rule/repo";

@injectable()
export default class ReportController extends ControllerBase {

  constructor(
    private dollarUploadCtrl: DollarUploadController,
    private mappingUploadCtrl: MappingUploadController,
    private deptUploadCtrl: DeptUploadController,
    private postgresRepo: PgLookupRepo,
    private subMeasureRepo: SubmeasureRepo,
    private allocationRuleRepo: AllocationRuleRepo
  ) {
    super(null);
  }


  reportTest(req, res, next) {
    const data1 = [['One', 'Two', 'Three'], [1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
    const data2 = [['four', 'Fve', 'six'], [1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
    // const range = {s: {c: 0, r:0 }, e: {c:0, r:3}}; // A1:A4
    // const option = {'!merges': [ range ]};

    // const buffer = xlsx.build([{name: "mySheetName", data: data}], option);
    const buffer = xlsx.build([{name: "mySheetName", data: data1}, {name: "sheet2", data: data2}]);
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
    const body = req.body; // post request, params are in the body
    const moduleId = req.body.moduleId;
    req.query = _.omit(body, ['excelFilename']);
    let excelSheetname;
    let excelHeaders;
    let excelProperties;

    this.verifyProperties(body, ['excelFilename']);

    let promise;
    switch (req.params.report) {
      case 'dollar-upload':
        // we need moduleId for some reports (hit collections will multiple module data),
        // but for module specific collections like these, having a moduleId will
        // get no results as it's not included in the collection, so we need to remove it from filter
        delete req.query.moduleId;
        excelSheetname = ['Manual Uploaded Data'];
        excelHeaders = ['Fiscal Month', 'Sub Measure Name', 'Input Product Value', 'Input Sales Value', 'Legal Entity', 'Int Business Entity', 'SCMS', 'Amount'];
        excelProperties = ['fiscalMonth', 'submeasureName', 'product', 'sales', 'legalEntity', 'intBusinessEntity', 'scms', 'amount'];
        promise = this.dollarUploadCtrl.getManyPromise(req);
        break;
      case 'mapping-upload':
        delete req.query.moduleId;
        excelSheetname = ['Manual Mapping Data'];
        excelHeaders = ['Fiscal Month', 'Sub Measure Name', 'Input Product Value', 'Input Sales Value', 'Legal Entity', 'Int Business Entity', 'SCMS', 'Percentage'];
        excelProperties = ['fiscalMonth', 'submeasureName', 'product', 'sales', 'legalEntity', 'intBusinessEntity', 'scms', 'percentage'];
        promise = this.mappingUploadCtrl.getManyPromise(req);
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
        delete req.query.moduleId;
        excelSheetname = ['Dept Upload'];
        excelHeaders = ['Sub-Measure Name', 'Department Code', 'Start Account Code', 'End Account Code'];
        excelProperties = ['submeasureName', 'departmentCode', 'startAccountCode', 'endAccountCode'];
        promise = this.deptUploadCtrl.getManyPromise(req);
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
        excelProperties = ['submeasure_name', 'fiscal_month_id', 'create_owner', 'create_datetimestamp', 'update_owner', 'update_datetimestamp'];
        promise = this.postgresRepo.get2TSebmeasureListReport();
        break;
      case 'disti-to-direct':
        excelSheetname = ['Disti to Direct'];
        excelHeaders = ['Group ID', 'Node Type', 'Sales Finance Hierarchy', 'Node Code', 'Fiscal Month Id', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'];
        excelProperties = ['group_id', 'node_type', 'sales_finance_hierarchy', 'node_code', 'fiscal_month_id', 'create_user', 'create_datetime', 'update_user', 'update_datetime'];
        promise = this.postgresRepo.getDistiToDirectMappingReport();
        break;
      case 'alternate-sl2':
        excelSheetname = ['Alternate SL2'];
        excelHeaders = ['Actual SL2', 'Alternate SL2', 'Alternate Country', 'Fiscal Month Id', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'];
        excelProperties = ['actual_sl2_code', 'alternate_sl2_code', 'alternate_country_name', 'fiscal_month_id', 'create_user', 'create_datetime', 'update_user', 'update_datetime'];
        promise = this.postgresRepo.getAlternateSL2Report();
        break;
      case 'corp-adjustment':
        excelSheetname = ['Corp Adjustment'];
        excelHeaders = ['Country Name', 'Sales Territory Code', 'SCMS Value', 'Fiscal Month Id', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'];
        excelProperties = ['sales_country_name', 'sales_territory_code', 'scms_value', 'fiscal_month_id', 'create_user', 'create_datetime', 'update_user', 'update_datetime'];
        promise = this.postgresRepo.getCorpAdjustmentReport();
        break;
      case 'sales-split-percentage':
        excelSheetname = ['Sales Split Percentage'];
        excelHeaders = ['Account Id', 'Company Code', 'Sub Account Code', 'Sales Territory Code', 'Percentage Value', 'Fiscal Month Id', 'Created By', 'Created Date', 'Last Modified By', 'Last Modified Date'];
        excelProperties = ['account_code', 'company_code', 'sub_account_code', 'sales_territory_code', 'split_percentage', 'fiscal_month_id', 'create_owner', 'create_datetimestamp', 'update_owner', 'update_datetimestamp'];
        promise = this.postgresRepo.getSalesSplitPercentageReport();
        break;
      case 'valid-driver':
        excelSheetname = [['Adjustment PF Report'], ['Driver SL3 Report'], ['Shipment Driver PF Report'], ['Roll3 Driver With BE']],
          excelHeaders = [['Tech Group', 'Business Unit', 'Product Family'],
                          ['Driver Type', 'Sales Level1 Code', 'Sales Level1 Description', 'Sales Level2 Code', 'Sales Level2 Description', 'Sales Level3 Code', 'Sales Level3 Description'],
                          ['Tech Group', 'Business Unit', 'Product Family'],
                          ['Driver Type', 'Tech Group', 'Business Unit', 'Product Family', 'Business Entity', 'Sub Business Entity']];
        excelProperties = [['technology_group_id', 'business_unit_id', 'product_family_id'],
                          ['driver_type', 'l1_sales_territory_name_code', 'l1_sales_territory_descr', 'l2_sales_territory_name_code', 'l2_sales_territory_descr', 'l3_sales_territory_name_code', 'l3_sales_territory_descr'],
                          ['technology_group_id', 'business_unit_id', 'product_family_id'],
                          ['driver_type', 'technology_group_id', 'business_unit_id', 'product_family_id', 'bk_business_entity_name', 'sub_business_entity_name']];
        promise = [
          this.postgresRepo.getAdjustmentPFReport(),
          this.postgresRepo.getDriverSL3Report(),
          this.postgresRepo.getShipmentDriverPFReport(),
          this.postgresRepo.getRoll3DriverWithBEReport()
        ];
        break;
      case 'submeasure':
        excelSheetname = [['Original'], ['History'], ['As Of Now']];
        excelHeaders = [['Measure Name', 'Sub Measure Name', 'Description', 'Source', 'Adjustment Type Id', 'Input Filter Hierarchy', 'Input Filter Hierarchy Level', 'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing',
                        'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3', 'Manual Mapping Hierarchy', 'Manual Mapping Hierarchy Level', 'Status', 'Approval Status', 'Approval Date', 'Created By', 'Created Date', 'Last Modified By',
                        'Last Modified Date', 'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Grouping Submeasure', 'Submeasure Type', 'Submeasure category type', 'approved by'],

                        ['Measure Name', 'Sub Measure Name', 'Description', 'Source', 'Adjustment Type Id', 'Input Filter Hierarchy', 'Input Filter Hierarchy Level', 'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing',
                          'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3', 'Manual Mapping Hierarchy', 'Manual Mapping Hierarchy Level', 'Status', 'Approval Status', 'Approval Date', 'Created By', 'Created Date', 'Last Modified By',
                          'Last Modified Date', 'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Grouping Submeasure', 'Submeasure Type', 'Submeasure category type', 'approved by'],

                        ['Measure Name', 'Sub Measure Name', 'Description', 'Source', 'Adjustment Type Id', 'Input Filter Hierarchy', 'Input Filter Hierarchy Level', 'Effective Month', 'End Month', 'Frequency/Timing of Sub-measure Processing',
                          'Reporting Level 1', 'Reporting Level 2', 'Reporting Level 3', 'Manual Mapping Hierarchy', 'Manual Mapping Hierarchy Level', 'Status', 'Approval Status', 'Approval Date', 'Created By', 'Created Date', 'Last Modified By',
                          'Last Modified Date', 'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Grouping Submeasure', 'Submeasure Type', 'Submeasure category type', 'approved by']];

        excelProperties = [['measureId', 'name', 'desc', 'sourceId', 'sourceSystemAdjTypeId', '', '', 'startFiscalMonth', 'endFiscalMonth', 'processingTime',
                          'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]', '', '', 'status', 'approvedOnce', 'updatedDate', 'createdBy', 'createdDate', 'updatedBy',
                          'updatedDate', 'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'pnlnodeGrouping', 'categoryType', '', 'updatedBy'],

                          ['measureId', 'name', 'desc', 'sourceId', 'sourceSystemAdjTypeId', '', '', 'startFiscalMonth', 'endFiscalMonth', 'processingTime',
                            'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]', '', '', 'status', 'approvedOnce', 'updatedDate', 'createdBy', 'createdDate', 'updatedBy',
                            'updatedDate', 'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'pnlnodeGrouping', 'categoryType', '', 'updatedBy'],

                          ['measureId', 'name', 'desc', 'sourceId', 'sourceSystemAdjTypeId', '', '', 'startFiscalMonth', 'endFiscalMonth', 'processingTime',
                            'reportingLevels[0]', 'reportingLevels[1]', 'reportingLevels[2]', '', '', 'status', 'approvedOnce', 'updatedDate', 'createdBy', 'createdDate', 'updatedBy',
                            'updatedDate', 'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'pnlnodeGrouping', 'categoryType', '', 'updatedBy']];
        promise = [
          this.subMeasureRepo.getManyEarliestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
            .then(docs => docs.map(doc => this.transformSubmeasure(doc))),
          this.subMeasureRepo.getMany({setSort: 'name', moduleId})
            .then(docs => docs.map(doc => this.transformSubmeasure(doc))),
          this.subMeasureRepo.getManyLatestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
            .then(docs => docs.map(doc => this.transformSubmeasure(doc))),
        ];
        break;
      case 'allocation-rule':
        excelSheetname = ['History'];
        excelHeaders = ['START_FISCAL_PERIOD_ID', 'END_FISCAL_PERIOD_ID', 'Sub_Measure_Key', 'SUB_MEASURE_NAME', 'MEASURE_NAME', 'SOURCE_SYSTEM_NAME', 'INPUT_HIER_LEVEL', 'INPUT_FILTER_HIER_NAME', 'RuleName'];
        excelProperties = ['startFiscalMonth', 'endFiscalMonth', 'submeasureKey', 'name', 'measureId', 'sourceId', '', '', ''];
        promise = this.allocationRuleRepo.getMany({setSort: 'name', moduleId})
            .then(docs => docs.map(doc => this.transformRule(doc)));
        break;
      default:
        next(new ApiError('Bad report type', null, 400));
        return;
    }

    if (promise instanceof Array) { // multiple sheets
      if ((excelHeaders && excelHeaders.length !== promise.length) || excelSheetname.length !== promise.length
        || excelProperties.length !== promise.length) {
        next(new ApiError(`excelHeaders, excelProperties, excelSheetname array lengths not equal to report sheet length: ${promise.length}`, body, 400));
        return;
      }
      Promise.all(promise)
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
          res.set('Content-Disposition', 'attachment; filename="' + body.excelFilename + '"');
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
          res.set('Content-Disposition', 'attachment; filename="' + body.excelFilename + '"');
          svrUtil.bufferToStream(buffer).pipe(res);

        })
        .catch(next);
    }


  }

  transformSubmeasure(sm) {
    sm.ruleNames = sm.rules.join(', ');
    return sm;
  }

  transformRule(rule) {
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
      case 'disti-to-direct':
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

