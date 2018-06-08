const _ = require('lodash'),
  DollarUploadController = require('../dollar-upload/controller'),
  MappingUploadController = require('../mapping-upload/controller'),
  DeptUploadController = require('../dept-upload/controller'),
  util = require('../../../lib/common/util'),
  ApiError = require('../../../lib/common/api-error'),
  PostgresRepo = require('../../../lib/database/repos/postgres-repo');

const dollarUploadCtrl = new DollarUploadController(),
  mappingUploadCtrl = new MappingUploadController(),
  deptUploadCtrl = new DeptUploadController(),
  postgresRepo = new PostgresRepo();

module.exports = class ReportController {

  // for getReport we expect:
  // * excelFilename: name of file it will download to
  // * excelProperties: an array of property names to determine the properties downloaded and order
  // * excelHeaders (optional) an array of header names for the first row of download
  // we push headers, convert json to csv using properties, concat csv, join with line terminator and send
  getReport(req, res, next) {
    const body = req.body;// post request, params are in the body
    req.query = _.omit(body, ['excelFilename', 'excelProperties', 'excelHeaders']);

    if (!body.excelFilename || !body.excelProperties) {
      next(new ApiError('Missing properties for excelDownload. Require: excelFilename, excelProperties.', null, 400));
      return;
    }
    let arrRtn = [];
    if (body.excelHeaders) {
      arrRtn.push(util.cleanCsv(body.excelHeaders));
    }

    let promise;
    switch (req.params.report) {
      case 'dollar-upload':
        promise = dollarUploadCtrl.getManyPromise(req);
        break;
      case 'mapping-upload':
        promise = mappingUploadCtrl.getManyPromise(req);
        break;
      case 'product-hierarchy':
        promise = postgresRepo.getProductHierarchyReport();
        break
      case 'sales-hierarchy':
        promise = postgresRepo.getSalesHierarchyReport();
        break
      case 'dept-upload':
        promise = deptUploadCtrl.getManyPromise(req);
        break
      default:
        next(new ApiError('Bad report type', null, 400));
        return;
    }

    promise
      .then(results => results.rows || results)
      .then(docs => util.convertJsonToCsv(docs, util.cleanCsvArr(body.excelProperties)))
      .then(arrCsv => {
        arrRtn = arrRtn.concat(arrCsv);
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', 'attachment; filename="' + body.excelFilename + '"');
        res.send(arrRtn.join('\n'));
      })
      .catch(next);
  }

}

