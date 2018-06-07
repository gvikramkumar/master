const SalesSplitUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base')

const repo = new SalesSplitUploadRepo();

module.exports = class SalesSplitUploadController extends ControllerBase {
  constructor() {
    super(repo);
  }
}
