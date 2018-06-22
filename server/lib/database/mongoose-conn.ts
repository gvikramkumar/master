import config from '../../config/get-config';
import mg from 'mongoose';
import AnyObj from '../models/any-obj';

const options = {
  autoIndex: false,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD
};

export const mgc: {promise: Promise<AnyObj>, db: AnyObj, mongo: AnyObj} = <any>{};

mgc.promise = mg.connect(config.mongoUri, options)
  .then(() => {
    console.log(`mongoose connected on: ${config.mongoUri}`);
    mg.connection.on('disconnected', () => console.log('mongoose disconnected'));
    mgc.db = mg.connection.db;
    mgc.mongo = mg.mongo;
    return mgc;
  })
  .catch(err => {
    console.error(`mongoose connection error: ${config.mongoUri}`, err);
    return Promise.reject(err);
  });


