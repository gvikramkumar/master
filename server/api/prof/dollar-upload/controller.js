const DollarUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base')

const repo = new DollarUploadRepo();

module.exports = class DollarUploadController extends ControllerBase {
  constructor() {
    super(repo);
  }
}
