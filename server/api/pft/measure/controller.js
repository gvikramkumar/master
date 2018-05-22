const MeasureRepo = require('./repo'),
  ControllerBase = require('../../../lib/models/controller-base');

const repo = new MeasureRepo();

module.exports = class MeasureController extends ControllerBase {
  constructor() {
    super(repo);
  }

}

