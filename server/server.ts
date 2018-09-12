import {injector} from './lib/common/inversify.config';
const inj = injector; // required to import reflect-metadata before any injection
import config from './config/get-config';
import process from 'process';
import path from 'path';
import https from 'https';
import http from 'http';
import fs from 'fs';
import mg from 'mongoose';
import {mgc} from './lib/database/mongoose-conn';
import {pgc} from './lib/database/postgres-conn';
import expressSetup from './express-setup';

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

// wait for database connections, then all middleware will have a connection to work with (instead of a promise)
Promise.all([mgc.promise, pgc.promise])
  .then(([{db, mongo}, {pgdb}]) => {

      const app = expressSetup();

      const port = process.env.NODE_ENV === 'unit' ? '3001' : process.env.PORT || config.port;
      let server, protocol;
      if (config.ssl) {
        protocol = 'https';
        const options = {
          key: fs.readFileSync(path.join(__dirname, `keys/${config.ssl.key}`)),
          cert: fs.readFileSync(path.join(__dirname, `keys/${config.ssl.cert}`))
        };
        server = https.createServer(options, app);
      } else {
        protocol = 'http';
        server = http.createServer(app);
      }

      server.on('close', (e) => {
        mg.connection.close();
        if (pgc.pgdb) {
          pgc.pgdb.end();
        }
      });

      return server.listen(port, '127.0.0.1', function (err) {
        if (err) {
          console.error('server listen creation error:', err);
          mg.connection.close();
          if (pgc.pgdb) {
            pgc.pgdb.end();
          }
          throw(err);
        }
        console.log(`${protocol} server listening on ${port}`);
      });
    }
  )
  .catch(err => {
    console.error('server creation error:', err);
    mg.connection.close();
    if (pgc.pgdb) {
      pgc.pgdb.end();
    }
    process.exit(0);
  });



