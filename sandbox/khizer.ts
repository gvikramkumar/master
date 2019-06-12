import {shUtil} from '../shared/misc/shared-util';
import {difference, flatten} from 'lodash';

const roles = [
  'profitability allocations:business admin',
  'profitability allocations:super user',
  'profitability allocations:business user',
  'profitability allocations:end user'
];

const genericRoles = [
  'itadmin',
  'biz-admin',
  'super-user',
  'biz-user',
  'end-user'
];

const modules = [

]

if (!(difference(roles, genericRoles.concat(['it administrator']).concat(flatten(modules.map(m => shUtil.stringToArray(m.roles))))).length === 0)) {
  throw new Error(`Some roles don't exist: ${roles.join(',')}`);
}
