const DollarUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/models/controller-base'),
  xlsx = require('node-xlsx'),
  DollarUploadImport = require('template'),
  NamedApiError = require('../../../lib/common/named-api-error');

const repo = new DollarUploadRepo();

module.exports = class DollarUploadController extends ControllerBase {


  constructor() {
    super(repo);
  }

  upload(req, res, next) {
    this.userId = req.user.id;
    const sheets = xlsx.parse(req.file.buffer);
    this.rows = sheets[0].data.slice(5).filter(row => row.length > 1); // might be comment row in there
    debugger;
    this.validateSheet()
      .then(() => {
        // import data
        // save file to db
        //util.bufferToStream(req.file.buffer).pipe(gfsWriteStream);
        return this.import();
      })
      .catch(next)

    // validate and if cool, then do mongo.Grid???.createWriteStream()... and get id back hopefully
    // if not fs.fileInfo, then use the id to get that and return.

        // return this.repo.getOne(req.file.id))
        //   .then(files => res.send(files))
        //   .catch(next);

  }

  validateSheet() {
    let chain = Promise.resolve();
    this.rows.forEach((row, idx) => {
      chain = chain.then(() => validate(row, idx + 1));
    });
    chain.catch(({err, rowNum}) => {
        return Promise.reject(new NamedApiError('UploadValidationError', `Validation Errors in row: ${rowNum}`, err, 400));
    });
    return chain;
  }

  validate(row, rowNum) {
    const errors = [];
    errors.rowNum = rowNum;
    const temp = new DollarUploadImport(row);

    if (!temp.submeasureName) {
      errors.add({property: 'Sub Measure Name', error: 'Required'})
    } else {
      const msg = this.userHasAccessToMeasure(this.userId, temp.submeasureName);
      if (msg) {
        errors.add({property: 'Sub Measure Name', error: msg})
      }
      if (!this.verifySubmeasureNameExists(temp.submeasureName)) {
        errors.add({property: 'Sub Measure Name', error: 'Sub Measure doesn\'t exist'});
      }
    }


    // SOMEHOW WAIT FOR ALL THIS AND RETURN ERRORS. promise.all I'm thinking as you want all errors, but in reality... q.allSettled otherwise will stop
    // on first error right?
    // .catch(err => {err, rowNum}
  }

  userHasAccessToMeasure() {
    // look up measure associated with this submeasure and make sure they have access to it. This will be in
    // the onramp data, these measures being a fixed thing. pg or mongo?
    return false;
  }
  // same deal... all these db calls to get info associated with this row
  import(row) {

  }




}

