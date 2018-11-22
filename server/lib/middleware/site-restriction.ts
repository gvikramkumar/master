import * as _ from 'lodash';
import LookupRepo from '../../api/lookup/repo';
import {ApiError} from '../common/api-error';
import AnyObj from '../../../shared/models/any-obj';
import {shUtil} from '../../../shared/shared-util';

export function siteRestriction() {

  return (req, res, next) => {
    const lookupRepo = new LookupRepo();
    lookupRepo.getValue('site-allowed-users')
      .then(allowedUsers => {
        if (!allowedUsers) {
          throw new ApiError('No lookup site-allowed-users in database for site restriction.', null, 400);
        }
        if (!_.includes(allowedUsers, (<AnyObj>req).user.id)) {
          res.status(401).send(shUtil.getHtmlForLargeSingleMessage(`Access restricted.`));
        }
        next();
      });
  };

}

