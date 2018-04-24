const SubmeasureRepo = require('./repo'),
  schema = require('./schema'),
  ControllerBase = require('../../../lib/common/controller-base');

const repo = new SubmeasureRepo();

module.exports = class SubmeasureController extends ControllerBase {
  constructor() {
    super(repo, schema);
  }
}

