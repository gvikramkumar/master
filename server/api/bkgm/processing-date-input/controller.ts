import {injectable} from 'inversify';
import ProcessDateInputRepo from './repo';
import {ApiError} from '../../../lib/common/api-error';


@injectable()
export default class ProcessDateInputController {

  constructor(private repo: ProcessDateInputRepo) {
  }

  add(req, res, next){
    this.repo.addOne(req.body,'vgurumoo')
      .then(values => {
        res.json(values);
      })
      .catch(next);
  }
}

