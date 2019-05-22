import {injector} from '../../server/lib/common/inversify.config';
import {serverPromise} from '../../server/server';


const inj = injector;

describe('init-mocks.ts', () => {

  beforeAll((done) => {
    // just in case we want to initialize server
    serverPromise.then(() => done());
  });

  it('init-e2e complete', () => {

  });


});
