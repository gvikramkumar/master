const config = require('./config/_get-config'),
  process = require('process'),
  path = require('path'),
  https = require('https'),
  http = require('http'),
  fs = require('fs'),
  setMiddleware = require('./middleware/set-middleware');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

const app = require('./middleware/set-middleware');
module.exports = app; // for supertest

if (config.env !== 'unit') {

  let port = process.env.NODE_ENV === 'unit' ? '3001' : process.env.PORT || config.port;
  console.log('server port', process.env.NODE_ENV, port);

  let server = null;
  if (config.ssl) {
    const options = {
      key: fs.readFileSync(path.join(__dirname, 'keys/key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'keys/server.crt'))
    };
    server = https.createServer(options, app)
      .listen(port, function (err) {
        if (err) {
          reject(err);
        }
        console.log(`https server listening on ${port}`);
        resolve(server);
      })
  } else {
    server = http.createServer(app)
      .listen(port, function (err) {
        if (err) {
          reject(err);
        }
        console.log(`http server listening on ${port}`);
        resolve(server);
      });
  }

}



