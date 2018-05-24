const MeasureRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base');

const repo = new MeasureRepo();

module.exports = class MeasureController extends ControllerBase {
  constructor() {
    super(repo);
  }

}

