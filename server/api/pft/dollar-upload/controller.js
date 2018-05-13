const DollarUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/models/controller-base'),
  xlsx = require('node-xlsx'),
  DollarUploadImport = require('./template'),
  NamedApiError = require('../../../lib/common/named-api-error'),
  submeasureRepo = require('../submeasure/repo');

const repo = new DollarUploadRepo();

module.exports = class DollarUploadController extends ControllerBase {


  constructor() {
    super(repo);
  }

  upload(req, res, next) {
    this.userId = req.user.id;
    const sheets = xlsx.parse(req.file.buffer);
    this.rows = sheets[0].data.slice(5).filter(row => row.length > 1); // might be comment row in there

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

    // return this.repo.getOneById(.file.id))
    //   .then(files => res.send(files))
    //   .catch(next);

  }

  validateSheet() {
    let chain = Promise.resolve();
    this.rows.forEach((row, idx) => {
      chain = chain.then(() => validate(row, idx + 1));
    });
    return chain;
  }

  validate(row, rowNum) {
    this.errors = [];
    this.rowNum = rowNum;
    this.temp = new DollarUploadImport(row);

    return Promise.all(
      this.validateSubmeasure(),
      this.validateProductValue(),
      this.validateSalesValue())
      .then(() => {
        if (this.errors.length) {
          return Promise.reject(new NamedApiError('UploadValidationError',
            `Validation Errors in row: ${rowNum}`, this.errors, 400));
        }
      })
      .catch(err => Promise.reject(err));
  }

  validateSubmeasure() {

    if (!this.temp.submeasureName) {
      this.errors.add({property: 'Sub Measure Name', error: 'Required'});
      return Promise.resolve();
    } else {
      return Promise.all(
        this.userHasAccessToMeasure(),
        this.verifySubmeasureNameExists());
    }

  }

  userHasAccessToMeasure() {
    // use this.req.user.userId and this.temp.submeasureName to get measure (from where?)
    // and then goto onramp table to see if they have access to measure
  }

  verifySubmeasureNameExists() {
    // use this.temp.submeasureName and verify a submeasure of that name exist
    // can do this now right?
    return submeasureRepo.getOneByName(temp.submeasureName)
      .then(result => {
        if (!result) {
          this.errors.push({property: 'Sub Measure Name', error: 'No Sub Measure exists by this name.'})
        }
      })
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

