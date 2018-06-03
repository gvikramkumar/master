const MappingUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base')

const repo = new MappingUploadRepo();

module.exports = class MappingUploadController extends ControllerBase {
  constructor() {
    super(repo);
  }
}
