const config = require('./config/get-config'),
  process = require('process'),
  path = require('path'),
  https = require('https'),
  http = require('http'),
  fs = require('fs'),
  mg = require('mongoose');
// morgan = require('morgan'),
// docsRouter = require('./docs/_router'),
// authenticate = require('./api/login/_authenticate'),

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

// connect mongoose, wait for connection before running middleware
module.exports = mg.connect(config.mongoUri)
  .then(() => {

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
      return server.listen(port, function (err) {
        if (err) {
          throw(err);
        }
        console.log(`${protocol} server listening on ${port}`);
      })
    },
    err => console.log(`mongoose connection error: ${config.mongoUri}`, err)
  );



