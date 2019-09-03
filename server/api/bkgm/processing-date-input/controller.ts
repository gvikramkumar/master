import {injectable} from 'inversify';
import ProcessDateInputRepo from './repo';
import {ApiError} from '../../../lib/common/api-error';
import ControllerBase from '../../../lib/base-classes/controller-base';

@injectable()
export default class ProcessDateInputController extends ControllerBase {

  // constructor(private repo: ProcessDateInputRepo) {
  // }
  constructor(
    repo: ProcessDateInputRepo) {
    super(repo);
  }

  add(req, res, next){
    this.repo.getFilteredDate(req.body).then(values=>{
      if(values.length == 0){
        this.repo.addOne(req.body,req.user.id)
        .then(values => {
          res.json(values);
        })
      }else{
        res.json({CREATE_OWNER:'This is not a valid scenario as it falls within already inputted range'}); 
      }
    }).catch(err => {
      throw new ApiError('This is not a valid scenario as it falls within already inputted range', err);
    });
  }
}

