import {injectable} from 'inversify';
import OpenPeriodRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {PostgresRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {OpenPeriodPostgresRepo} from './pgrepo';
import PostgresControllerBase from '../../../lib/base-classes/pg-controller-base';


@injectable()
export default class OpenPeriodPostgresController extends PostgresControllerBase {
  constructor(repo: OpenPeriodPostgresRepo) {
    super(repo);
  }

}

