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
import {databaseUpdate} from './database-update';
import {approvalEmailReminder} from './lib/common/approval-email-reminder';


process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, t(hrowing an error, or other logic here
});

// wait for database connections, then all middleware will have a connection to work with (instead of a promise)
export const serverPromise = Promise.all([mgc.promise, pgc.promise])
  .then(databaseUpdate)
  .then(() => {

    const app = expressSetup();

    const port = process.env.NODE_ENV === 'unit' ? '3001' : process.env.PORT || config.port;
      let server, protocol;
      if (config.ssl) {
        try {
          protocol = 'https';
          const options = {
            key: fs.readFileSync(path.resolve(__dirname, config.ssl.key)),
            cert: fs.readFileSync(path.resolve(__dirname, config.ssl.cert))
          };
          server = https.createServer(options, app);
        } catch (e) {
          console.error(e);
          console.log('https fail, falling back to http...');
          protocol = 'http';
          server = http.createServer(app);
        }
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

      // to lock down to localhost only:
      // return server.listen(port, '127.0.0.1', function (err) {
      return server.listen(port, function (err) {
        if (err) {
          console.error('server listen creation error:', err);
          mg.connection.close();
          if (pgc.pgdb) {
            pgc.pgdb.end();
          }
          throw(err);
        }
        console.log('BUILD_NUMBER:', process.env.BUILD_NUMBER);
        console.log(`${protocol} server listening on ${port}`);
        approvalEmailReminder();
      });
    }
  )
  .catch(err => {
    console.error('server creation error:', err);
    mg.connection.close();
    if (pgc.pgdb) {
      pgc.pgdb.end();
      console.log('postgres disconnected');
    }
    process.exit(0);
  });



