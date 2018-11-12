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
        excelSheetname = [];
        excelHeaders = [];
        excelProperties = [];
        promise = this.deptUploadCtrl.getManyPromise(req);
        break
      case 'submeasure-grouping':
        excelSheetname = [];
        excelHeaders = [];
        excelProperties = [];
        promise = this.postgresRepo.getSubmeasureGroupingReport();
        break;
      case '2t-submeasure-list':
        excelSheetname = [];
        excelHeaders = [];
        excelProperties = [];
        promise = this.postgresRepo.get2TSebmeasureListReport();
        break;
      case 'disti-to-direct':
        excelSheetname = [];
        excelHeaders = [];
        excelProperties = [];
        promise = this.postgresRepo.getDistiToDirectMappingReport();
        break;
      case 'alternate-sl2':
        excelSheetname = [];
        excelHeaders = [];
        excelProperties = [];
        promise = this.postgresRepo.getAlternateSL2Report();
        break;
      case 'corp-adjustment':
        excelSheetname = [];
        excelHeaders = [];
        excelProperties = [];
        promise = this.postgresRepo.getCorpAdjustmentReport();
        break;
      case 'sales-split-percentage':
        excelSheetname = [];
        excelHeaders = [];
        excelProperties = [];
        promise = this.postgresRepo.getSalesSplitPercentageReport();
        break;
      case 'valid-driver':
        excelSheetname = [];
        excelHeaders = [];
        excelProperties = [];
        promise = [
          this.postgresRepo.getAdjustmentPFReport(),
          this.postgresRepo.getDriverSL3Report(),
          this.postgresRepo.getShipmentDriverPFReport(),
          this.postgresRepo.getRoll3DriverWithBEReport()
        ];
        break;
      case 'submeasure':
        excelSheetname = [];
        excelHeaders = [];
        excelProperties = [];
        promise = [
          this.subMeasureRepo.getManyEarliestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name')),
          this.subMeasureRepo.getMany({setSort: 'name', moduleId}),
          this.subMeasureRepo.getManyLatestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
        ];
        break;
      case 'allocation-rule':
        excelSheetname = [];
        excelHeaders = [];
        excelProperties = [];
        promise = [
          this.allocationRuleRepo.getManyEarliestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name')),
          this.allocationRuleRepo.getMany({setSort: 'name', moduleId}),
          this.allocationRuleRepo.getManyLatestGroupByNameActive(moduleId).then(docs => _.sortBy(docs, 'name'))
        ];
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
            let records = results.rows || results;
            records = records.map(record => excelProperties[idx]
              .map(prop => {
                const val = record[prop];
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
            data = data.concat(records);
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
        .then(records => {
          return records.map(record => excelProperties.map(prop => {
              const val = record[prop];
              if (val instanceof Date) {
                const str = val.toISOString();
                return str.substr(0, str.length - 5).replace('T', '  ');
              } else {
                return val;
              }
            }));
        })
        .then(records => {
          let data = [];
          if (excelHeaders) {
            data.push(excelHeaders);
          }
          data = data.concat(records);
          const buffer = xlsx.build([{name: excelSheetname, data}]);
          res.set('Content-Type', 'application/vnd.ms-excel');
          res.set('Content-Disposition', 'attachment; filename="' + body.excelFilename + '"');
          svrUtil.bufferToStream(buffer).pipe(res);

        })
        .catch(next);
    }


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

