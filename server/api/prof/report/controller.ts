import {injectable} from 'inversify';
import * as _ from 'lodash';
import DollarUploadController from '../dollar-upload/controller';
import MappingUploadController from '../mapping-upload/controller';
import DeptUploadController from '../dept-upload/controller';
import PgLookupRepo from '../../common/pg-lookup/repo';
import {ApiError} from '../../../lib/common/api-error';
import {svrUtil} from '../../../lib/common/svr-util';

@injectable()
export default class ReportController {

  constructor(
    private dollarUploadCtrl: DollarUploadController,
    private mappingUploadCtrl: MappingUploadController,
    private deptUploadCtrl: DeptUploadController,
    private postgresRepo: PgLookupRepo
  ) {}
  // for getReport we expect:
  // * excelFilename: name of file it will download to
  // * excelProperties: an array of property names to determine the properties downloaded and order
  // * excelHeaders (optional) an array of header names for the first row of download
  // we push headers, convert json to csv using properties, concat csv, join with line terminator and send
  getReport(req, res, next) {
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

