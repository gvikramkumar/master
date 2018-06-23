import {injectable} from 'inversify';
import LookupRepo from './repo';


@injectable()
export default class LookupController {

  constructor(private repo: LookupRepo) {}

  getValues(req, res, next) {
    this.repo.getValuesByType(req.params.type)
      .then(values => res.send(values))
      .catch(next);
  }

}

