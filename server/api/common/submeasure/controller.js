const SubmeasureRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base');

const repo = new SubmeasureRepo();

module.exports = class SubmeasureController extends ControllerBase {
  constructor() {
    super(repo);
  }
}

