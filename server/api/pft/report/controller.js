const _ = require('lodash'),
  DollarUploadController = require('../dollar-upload/controller'),
  MappingUploadController = require('../mapping-upload/controller'),
  util = require('../../../lib/common/util'),
  ApiError = require('../../../lib/common/api-error'),
  pgdb = require('../../../lib/database/postgres-conn').pgdb;

const dollarUploadCtrl = new DollarUploadController(),
  mappingUploadCtrl = new MappingUploadController();

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
        promise = pgdb.query(`select technology_group_id, 
                                business_unit_id, 
                                product_family_id
                                from fdscon.vw_fds_products
                                group by 1,2,3 order by 1,2,3`);
        break
      case 'sales-hierarchy':
        promise = pgdb.query(`select l1_sales_territory_descr,
          l2_sales_territory_descr,
          l3_sales_territory_descr,
          l4_sales_territory_descr,
          l5_sales_territory_descr,
          l6_sales_territory_descr
          from fdscon.vw_fds_sales_hierarchy
          where sales_territory_type_code in ('CORP. REVENUE')
          group by 1,2,3,4,5,6
          order by 1,2,3,4,5,6
        `);
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

