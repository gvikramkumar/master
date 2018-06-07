const DeptUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base')

const repo = new DeptUploadRepo();

module.exports = class DeptUploadController extends ControllerBase {
  constructor() {
    super(repo);
  }
}
