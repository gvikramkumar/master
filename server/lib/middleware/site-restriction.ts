import * as _ from 'lodash';
import LookupRepo from '../../api/common/lookup/repo';
import {ApiError} from '../common/api-error';
import AnyObj from '../../../shared/models/any-obj';

export function siteRestriction() {

  return (req, res, next) => {
    const lookupRepo = new LookupRepo();
    lookupRepo.getValue('site-allowed-users')
      .then(allowedUsers => {
        if (!allowedUsers) {
          throw new ApiError('No lookup site-allowed-users in database for site restriction.', null, 400);
        }
        if (!_.includes(allowedUsers, (<AnyObj>req).user.id)) {
          res.send(`<div style="text-align: center; margin-top: 200px;"><h1>You don't have access to this site.</h1></div>`);
        }
        next();
      });
  };

}

