import LookupRepo from '../../api/lookup/repo';
import {mgc} from '../database/mongoose-conn';
import PgLookupRepo from '../../api/pg-lookup/repo';
import config from '../../config/get-config';
import {finRequest} from '../common/fin-request';
import AnyObj from '../../../shared/models/any-obj';
import {ApiError} from '../common/api-error';
import {NamedApiError} from '../common/named-api-error';
import * as Q from 'q';
import {handleQAllSettled} from '../common/q-allSettled';
import * as _ from 'lodash';

const lookupRepo = new LookupRepo();
const pgLookupRepo = new PgLookupRepo();

export function healthcheck () {

  return (req, res, next) => {
    // none of these can fail, why all called here are in try/catch. we need to catch the exceptions and report them in the output
    Q.allSettled([
      pingMongo(),
      pingPostgres(),
      pingSso()
    ])
      .then(results => {
        const rtn = {
          api: results[0].state === 'fulfilled' ? `build: ${results[0].value[0][0]}` : '',
          mongo: results[0].state === 'fulfilled' ? `dfa-version: ${results[0].value[0][1]}, mongo-version: ${results[0].value[1].version}` : `DOWN: ${results[0].reason}`,
          pg: results[1].state === 'fulfilled' ? results[1].value : `DOWN: ${results[1].reason}`,
          sso: results[2].state === 'fulfilled' ? results[2].value : `DOWN: ${results[2].reason}`
        };
        const status = results.filter(result => result.state === 'rejected').length ? 503 : 200;
        res.status(status).json(rtn);
      })
      .catch(e => next(e));
  };
}

function pingMongo() {
  try {
    // throw new Error('mongo');
    return Promise.all([
      lookupRepo.getValues(['build-number', 'database-version']),
      mgc.db.admin().serverInfo()
    ]);
  } catch (e) {
    return Promise.reject(e.message || e);
  }
}

function pingPostgres() {
  try {
    // throw new Error('pg');
    return pgLookupRepo.getDbVersion();
  } catch (e) {
    return Promise.reject(e.message || e);
  }
}

function pingSso() {
  try {
    // throw new Error('sso');
    if (config.ssoUrl) {
      return finRequest({url: config.ssoUrl})
        .then((resp: AnyObj): any => {
          const msg = `status: ${resp.resp.statusCode}`;
          if (resp.resp.statusCode === 200) {
            return msg;
          } else {
            return Promise.reject(msg);
          }
        })
        .catch(e => {
          return Promise.reject(_.get(e, 'data.error.message') || e.message || e);
        });
    } else {
      return Promise.resolve('Bypassed');
    }
  } catch (e) {
    return Promise.reject(_.get(e, 'data.error.message') || e.message || e);
  }
}

