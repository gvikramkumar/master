import _config from '../../config/get-config';
import mg from 'mongoose';
import AnyObj from '../../../shared/models/any-obj';

const config = _config.mongo;

const options = {
  autoIndex: false,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 50,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD
};

export const mgc: { promise: Promise<AnyObj>, db: AnyObj, mongo: AnyObj } = <any>{};

mgc.promise = Promise.resolve()
  .then(() => mg.connect(config.uri, options))
  .then(() => {
    console.log(`mongodb connected on: ${config.uri}`);
    mg.connection.on('disconnected', () => console.log('mongoose disconnected'));
    mgc.db = mg.connection.db;
    mgc.mongo = mg.mongo;
    return mgc;
  })
  .catch(err => {
    console.error(`mongoose connection error: ${config.uri}`, err);
    return Promise.reject(err);
  });


