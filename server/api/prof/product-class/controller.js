const ProductClassUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base')

const repo = new ProductClassUploadRepo();

module.exports = class ProductClassUploadController extends ControllerBase {
  constructor() {
    super(repo);
  }
}
