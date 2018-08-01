import {injectable} from 'inversify';
import PostgresControllerBase from '../../../lib/base-classes/pg-controller-base';
import OpenPeriodPgRepo from './repo';


@injectable()
export default class OpenPeriodPostgresController extends PostgresControllerBase {
  constructor(repo: OpenPeriodPgRepo) {
    super(repo);
  }

}

