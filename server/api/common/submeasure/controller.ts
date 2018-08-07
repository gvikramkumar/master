import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import SubmeasureRepo from './repo';
import {ApiError} from '../../../lib/common/api-error';
import {GroupingSubmeasure} from './grouping-submeasure';
import SubmeasurePgRepo from './pgrepo';
import SubmeasureInputLvlPgRepo from './pg-input_lvl-repo';
import * as _ from 'lodash';

// const pgRepo = new SubmeasurePgRepo();
// const inputLvlPgRepo = new SubmeasureInputLvlPgRepo();

@injectable()
export default class SubmeasureController extends ControllerBase {
  constructor(protected repo: SubmeasureRepo) {
    super(repo);
  }

  getGroupingSubmeasures(req, res, next) {
    const measureId = req.body.measureId;
    if (!measureId) {
      throw new ApiError('getGroupingSubmeasures called with no measureId');
    }
    this.repo.getGroupingSubmeasures(measureId)
      .then(docs => res.json(docs));
  }

  // res.json(item);

/*

// ***** NEED TO GET NEXT sub_measure_key from pg to start it off, so no autoinc field for mongo repo then
  addOne(req, res, next) {
    const data = req.body;
    this.repo.addOne(data, req.user.id)
      .then(item => {
        this.pgRepo.addOne(_.clone(item), req.user.id) // pgRepo changes updated date so clone it
          .then(() => {
            const inputLvls = [];

            //get input levls toegher
            return inputLvlPgRepo.addMany(inputLvls, req.user.id)
              .then(() => res.json(item));
          });
      })
      .catch(next);
  }
*/



}

