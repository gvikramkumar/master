const AllocationRuleRepo = require('./repo'),
  schema = require('./schema'),
  ControllerBase = require('../../../lib/base-classes/controller-base');

const repo = new AllocationRuleRepo();

module.exports = class AllocationRuleController extends ControllerBase {
  constructor() {
    super(repo, schema);
  }

  // 2 ways to go:
  // get all
  // getLatest query val >> groups by name and gets latest in each group
  getMany(req, res, next) {
    if (req.query.getLatest) {
      this.repo.getManyLatest(req.query.limit, req.query.skip)
        .then(items => res.send(items))
        .catch(next);

    } else {
      super.getMany(req, res, next);
    }
  }

}

