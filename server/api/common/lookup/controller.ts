import {injectable} from 'inversify';
import LookupRepo from './repo';
import {ApiError} from '../../../lib/common/api-error';


@injectable()
export default class LookupController {

  constructor(private repo: LookupRepo) {
  }

  getValue(req, res, next) {
    return this.repo.getDoc(req.params.key)
      .then(item => {
        if (!item) {
          if (req.query.noerror) {
            res.status(204).end();
          } else {
            next(new ApiError('Item not found.', null, 404));
            return;
          }
        } else {
          res.json(item.value);
        }
      })
      .catch(next);
  }

  add(req, res, next) {
    this.repo.add(req.body)
      .then(item => res.json(item))
      .catch(next);
  }

  update(req, res, next) {
    const data = req.body;
    this.repo.update(data)
      .then(item => {
        res.json(item);
      })
      .catch(next);
  }

  remove(req, res, next) {
    this.repo.remove(req.params.key)
      .then(item => res.json(item))
      .catch(next);
  }

}

