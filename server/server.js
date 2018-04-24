const config = require('./config/get-config'),
  process = require('process'),
  path = require('path'),
  https = require('https'),
  http = require('http'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  express = require('express'),
  bodyParser = require('body-parser'),
  // morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  // docsRouter = require('./docs/_router'),
  // usersRouter = require('./api/users/_router'),
  // authenticate = require('./api/login/_authenticate'),
  cors = require('cors'),
  ApiError = require('./lib/common/api-error'),
  notFound = require('./lib/middleware/not-found'),
  errorHandler = require('./lib/middleware/error-handler'),
  logger = require('./lib/middleware/logger'),
  moduleRouter = require('./api/common/module/router'),
  allocationRuleRouter = require('./api/pft/allocation-rule/controller'),
  submeasureRouter = require('./api/pft/submeasure/controller')

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

// config data sources
mongoose.connect(config.mongoUri)
  .then(() => console.log(`mongoose connected on: ${config.mongoUri}`),
    err => console.log(`mongoose connection error: ${config.mongoUri}`, err));

// todo: postgres connection (pg?)

// start express
const app = express();
module.exports = app;

var corsOptions = {
  origin: config.corsOrigin,
  credentials: true
}
app.use(cors(corsOptions));
app.use(function(req, res, next) {
  //todo: placeholder for req.user.userName till security is in
  req.user = {userName: 'dank'};
  next();
})
app.use(bodyParser.json());
app.use(cookieParser());

app.use(logger({mode: 'short'}));
// app.use(morgan('dev'));

// test endpoints
app.get('/cause-error', function (req, res) {
  // const err = new Error('basic error');
  // const err = new ApiError('api error');
  const err = new ApiError('api error with data', {some: 'thing'});
  err.name = 'dank';
  throw err;
})
app.get('/crash-site', function (req, res) {
  process.exit(666);
})

// app.use(docsRouter);
// app.use(authenticate());
// app.use('/api/users', userRouter);
app.use('/api/module', moduleRouter);
app.use('/api/allocation-rule', allocationRuleRouter);
app.use('/api/submeasure', submeasureRouter);

app.use(express.static(path.resolve(__dirname, '../ui/dist')));

app.get('*', (req, res) => {
  console.log('>>>>>> served index.html');
  res.sendFile(path.resolve(__dirname, '../ui/dist') + '/index.html');
});

app.use(notFound());
app.use(errorHandler({showStack: config.showStack}));
// end express

// create server
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

