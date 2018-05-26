const LookupRepo = require('./repo');

const repo = new LookupRepo();

module.exports = class LookupController {

  getMany(req, res, next) {
    repo.getOne({type: req.query.lookup})
      .then(doc => res.send(doc.values))
      .catch(next);
  }

}

