const config = require('./config/get-config'),
  process = require('process'),
  path = require('path'),
  https = require('https'),
  http = require('http'),
  fs = require('fs'),
  mg = require('mongoose'),
  mgConn = require('./lib/database/mongoose-conn'),
  pgConn = require('./lib/database/postgres-conn');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

// wait for database connections, then all middleware will have a connection to work with (instead of a promise)
Promise.all([mgConn.promise, pgConn.promise])
  .then(({db, mongo}, pgdb) => {

      const app = require('./express-setup');

      let port = process.env.NODE_ENV === 'unit' ? '3001' : process.env.PORT || config.port;
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
        pgdb.end();
      });

      return server.listen(port, function (err) {
        if (err) {
          console.error('server listen creation error:', err);
          mg.connection.close();
          pgdb.end();
          throw(err);
        }
        console.log(`${protocol} server listening on ${port}`);
      })
    }
  )
  .catch(err => {
    console.error('server creation error:', err);
    mg.connection.close();
    if (pgConn.db) {
      pgConn.db.end()
    }
    process.exit(0);
  });



