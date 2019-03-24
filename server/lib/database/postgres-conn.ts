import { Pool } from 'pg';
import _config from '../../config/get-config';
import AnyObj from '../../../shared/models/any-obj';
const config = _config.postgres;

const pool = new Pool({
  host: config.host,
  database: config.database,
  port: config.port,
  keepAlive: true,
  max: 50, // set pool max size to 50
  min: 10, // set min pool size to 10
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 10000, // return an error after 10 seconds if connection could not be established
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})

export const pgc: AnyObj = {pgdb: pool};

if (process.env.NO_POSTGRES === 'true') {
  pgc.promise = Promise.resolve()
    .then(() => {
      console.log(`POSTGRES NOT CONNECTED, USING NO_POSTGRES ENV VAR`);
      pgc.pgdb = {};
      return pgc;
    });
} else {
  pgc.promise = pool.connect()
    .then(() => {
      console.log(`postgres connected on: ${config.host}:${config.port}/${config.database}`)
      return pgc;
    })
    .catch(err => {
      console.error('failed to connect to postgres');
      return Promise.reject(err);
    });
}


