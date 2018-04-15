const config = require('./config/get-config'),
  process = require('process'),
  path = require('path'),
  https = require('https'),
  http = require('http'),
  fs = require('fs'),
  mongoose = require('mongoose');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

const mongoUri = 'mongodb://localhost/dkcrud';
mongoose.connect(mongoUri);
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

const app = require('./lib/middleware/set-middleware');

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
server.listen(port, function (err) {
  if (err) {
    throw(err);
  }
  console.log(`${protocol} server listening on ${port}`);
})

module.exports = server; // for supertest

