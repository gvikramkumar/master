import {injectable} from 'inversify';
import ProcessDateInputRepo from './repo';
import {ApiError} from '../../../lib/common/api-error';


@injectable()
export default class ProcessDateInputController {

  constructor(private repo: ProcessDateInputRepo) {
  }

  getValues(req, res, next) {
    this.repo.getValues(req.query.keys.split(','))
      .then(values => {
        res.json(values);
      })
      .catch(next);
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

  // post /call-method/:method
  callMethod(req, res, next) {
    const method = this[req.params.method];
    if (!method) {
      throw new ApiError(`PgLookupController: no method found for ${req.params.method}.`);
    }
    method.call(this, req, res, next);
  }

  getRequestHeaders(req, res) {
    res.json(req.headers);
  }

  upsert(req, res, next) {
    const data = req.body;
    this.verifyProperties(data, ['key']);
    this.repo.upsert(data)
      .then(item => {
        res.json(item);
      })
      .catch(next);
  }

  remove(req, res, next) {
    return this.repo.getDoc(req.params.key)
      .then(item => {
        if (!item) {
          res.status(204).end();
        } else {
          this.repo.remove(item)
            .then(val => res.json(val));
        }
      })
      .catch(next);
  }

  verifyProperties(data, arr) {
    const missingProps = [];
    arr.forEach(prop => {
      if (!data[prop]) {
        missingProps.push(prop);
      }
    });
    if (missingProps.length) {
      throw new ApiError(`Properties missing: ${missingProps.join(', ')}.`, data, 400);
    }
  }

}

