import {serverPromise} from '../../server/server';


beforeAll((done) => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  // just in case we want to initialize server
  serverPromise.then(() => done());
});

