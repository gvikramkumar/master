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
import SubmeasureController from "../../common/submeasure/controller";
import SubmeasureRepo from "../../common/submeasure/repo";

@injectable()
export default class ReportController extends ControllerBase {

  constructor(
    private dollarUploadCtrl: DollarUploadController,
    private mappingUploadCtrl: MappingUploadController,
    private deptUploadCtrl: DeptUploadController,
    private postgresRepo: PgLookupRepo,
    private subMeasureRepo: SubmeasureRepo
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
    req.query = _.omit(body, ['excelFilename', 'excelSheetname', 'excelProperties', 'excelHeaders']);

    if (!body.excelFilename || !body.excelSheetname || !body.excelProperties) {
      next(new ApiError('Missing properties for excelDownload. Require: excelFilename, excelSheetname, excelProperties.', null, 400));
      return;
    }

    let promise;
    switch (req.params.report) {
      case 'dollar-upload':
        promise = this.dollarUploadCtrl.getManyPromise(req);
        break;
      case 'mapping-upload':
        promise = this.mappingUploadCtrl.getManyPromise(req);
        break;
      case 'product-hierarchy':
        promise = this.postgresRepo.getProductHierarchyReport();
        break
      case 'sales-hierarchy':
        promise = this.postgresRepo.getSalesHierarchyReport();
        break
      case 'dept-upload':
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
        break;
      case 'valid-driver':
        promise = [
          promise = this.postgresRepo.getAdjustmentPFReport(),
          promise = this.postgresRepo.getDriverSL3Report(),
          promise = this.postgresRepo.getShipmentDriverPFReport(),
          promise = this.postgresRepo.getRoll3DriverWithBEReport()
        ];
        break;
      case 'submeasure':
        promise = [
          promise = this.subMeasureRepo.getManyEarliestGroupByNameActive(-1).then(docs => _.sortBy(docs, 'name')),
          promise = this.subMeasureRepo.getMany({setSort: 'name', moduleId: -1}),
          //promise = this.subMeasureRepo.getManyEarliestGroupByNameActive(-1).then(docs => _.sortBy(docs, 'name')),
          promise = this.subMeasureRepo.getManyLatestGroupByNameActive(-1).then(docs => _.sortBy(docs, 'name'))
        ];
        break;
      default:
        next(new ApiError('Bad report type', null, 400));
        return;
    }

    if (promise instanceof Array) { // multiple sheets
      if (body.excelHeaders) {
        body.excelHeaders = body.excelHeaders.split(';;');
      }
      body.excelSheetname = body.excelSheetname.split(';;');
      body.excelProperties = body.excelProperties.split(';;');
      if ((body.excelHeaders && body.excelHeaders.length !== promise.length) || body.excelSheetname.length !== promise.length
        || body.excelProperties.length !== promise.length) {
        next(new ApiError(`excelHeaders, excelProperties, excelSheetname array lengths not equal to report sheet length: ${promise.length}`, body, 400));
        return;
      }
      Promise.all(promise)
        .then(resultArr => {
          const sheetArr = [];
          resultArr.forEach((results, idx) => {
            let records = results.rows || results;
            records = records.map(record => shUtil.stringToArray(body.excelProperties[idx])
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
            if (body.excelHeaders && body.excelHeaders[idx]) {
              data.push(shUtil.stringToArray(body.excelHeaders[idx]));
            }
            data = data.concat(records);
            sheetArr.push({name: body.excelSheetname[idx], data});
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
          return records.map(record => shUtil.stringToArray(body.excelProperties)
            .map(prop => {
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
          if (body.excelHeaders) {
            data.push(shUtil.stringToArray(body.excelHeaders));
          }
          data = data.concat(records);
          const buffer = xlsx.build([{name: body.excelSheetname, data}]);
          res.set('Content-Type', 'application/vnd.ms-excel');
          res.set('Content-Disposition', 'attachment; filename="' + body.excelFilename + '"');
          svrUtil.bufferToStream(buffer).pipe(res);

        })
        .catch(next);
    }


  }

  // for Csv reports we expect:
  // * excelFilename: name of file it will download to
  // * excelProperties: an array of property names to determine the properties downloaded and order
  // * excelHeaders (optional) an array of header names for the first row of download
  // we push headers, convert json to csv using properties, concat csv, join with line terminator and send
  getCsvReport(req, res, next) {
    const body = req.body; // post request, params are in the body
    req.query = _.omit(body, ['excelFilename', 'excelProperties', 'excelHeaders']);

    if (!body.excelFilename || !body.excelProperties) {
      next(new ApiError('Missing properties for excelDownload. Require: excelFilename, excelProperties.', null, 400));
      return;
    }
    let arrRtn = [];
    if (body.excelHeaders) {
      arrRtn.push(svrUtil.cleanCsv(body.excelHeaders));
    }

    let promise;
    switch (req.params.report) {
      case 'dollar-upload':
        promise = this.dollarUploadCtrl.getManyPromise(req);
        break;
      case 'mapping-upload':
        promise = this.mappingUploadCtrl.getManyPromise(req);
        break;
      case 'product-hierarchy':
        promise = this.postgresRepo.getProductHierarchyReport();
        break
      case 'sales-hierarchy':
        promise = this.postgresRepo.getSalesHierarchyReport();
        break
      case 'dept-upload':
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
      .then(docs => svrUtil.convertJsonToCsv(docs, svrUtil.cleanCsvArr(body.excelProperties)))
      .then(arrCsv => {
        arrRtn = arrRtn.concat(arrCsv);
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', 'attachment; filename="' + body.excelFilename + '"');
        res.send(arrRtn.join('\n'));
      })
      .catch(next);
  }

}

