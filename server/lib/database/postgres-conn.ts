import { Client } from 'pg';
import _config from '../../config/get-config';
const config = _config.postgres;

const client = new Client({
  host: config.host,
  database: config.database,
  port: config.port,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})

export const pgc: any = {pgdb: client};

if (process.env.NO_POSTGRES) {
  pgc.promise = Promise.resolve()
    .then(() => {
      console.log(`POSTGRES NOT CONNECTED, USING NO_POSTGRES ENV VAR`);
      pgc.pgdb = undefined;
      return undefined;
    });
} else {
  pgc.promise = client.connect()
    .then(() => {
      console.log(`postgres connected on: ${config.host}:${config.port}/${config.database}`)
      return pgc;
    })
    .catch(err => {
      console.error('failed to connect to postgres');
      return Promise.reject(err);
    });
}


