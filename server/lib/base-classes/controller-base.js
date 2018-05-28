const ApiError = require('../common/api-error'),
  _ = require('lodash'),
  util = require('../common/util');

module.exports = class ControllerBase {

  constructor(repo) {
    this.repo = repo;
  }

  // if groupField, groups by groupField and gets Latest of each group
  // else if getLatest, returns the lastest value
  getManyPromise(req) {
    let promise;
    if (req.query.groupField) {
      promise = this.repo.getManyByGroupLatest(req.query)
    } else if (req.query.getLatest) {
      promise = this.repo.getOneLatest(req.query)
    } else {
      promise = this.repo.getMany(req.query);
    }
    return promise;
  }

  getMany(req, res, next) {
    this.getManyPromise(req)
      .then(items => res.send(items))
      .catch(next);
  }

  getOne(req, res, next) {
    this.repo.getOneById(req.params.id)
      .then(item => {
        if (item) {
          res.send(item);
        } else {
          res.status(404).end();
        }
      })
      .catch(next)
  }

  // if queryPost querystring: assume all get, not add, query params are in body, just queryPost is in query string
  // insertMany querystring: insertMany
  handlePost(req, res, next) {
    const data = req.body;
    if (req.query.queryPost) {
      req.query = req.body;
      this.getMany(req, res, next);
    } else if (req.query.excelDownload) {
      this.handleExcelDownload(req, res, next);
    } else if (req.query.insertMany) {
      this.repo.addMany(data, req.user.id)
        .then(() => res.end())
        .catch(next);
    } else {
      this.repo.addOne(data, req.user.id)
        .then(item => res.send(item))
        .catch(next);
    }
  }

  update(req, res, next) {
    const data = req.body;
    this.verifyProperties(data, ['id']);
    this.repo.update(data, req.user.id)
      .then(item => {
        res.send(item);
      })
      .catch(next)
  }

  remove(req, res, next) {
    this.repo.remove(req.params.id)
      .then(item => res.send(item))
      .catch(next);
  }

  verifyProperties(data, arr) {
    arr.forEach(prop => {
      if (!data[prop]) {
        throw new ApiError(`Property missing: ${prop}.`, data, 400)
      }
    })
  }

  // for excelDownload we expect:
  // * excelFilename: name of file it will download to
  // * excelProperties: an array of property names to determine the properties downloaded and order
  // * excelHeaders (optional) an array of header names for the first row of download
  // we push headers, convert json to csv using properties, concat csv, join with line terminator and send
  handleExcelDownload(req, res, next) {
    const body = req.body;
    req.query = _.omit(body, ['excelFilename', 'excelProperties', 'excelHeaders']);

    if (!body.excelFilename || !body.excelProperties) {
      next(new ApiError('Missing properties for excelDownload. Require: excelFilename, excelProperties.', null, 400));
      return;
    }
    let arrRtn = [];
    if (body.excelHeaders) {
      arrRtn.push(body.excelHeaders.split(',').map(x => x.trim()).join(','));
    }
    this.getManyPromise(req)
      .then(docs => util.convertJsonToCsv(docs, body.excelProperties.split(',').map(x => x.trim())))
      .then(arrCsv => {
        arrRtn = arrRtn.concat(arrCsv);
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', 'attachment; filename="' + body.excelFilename + '"');
        res.send(arrRtn.join('\n'));
      })
      .catch(next);
  }

}

