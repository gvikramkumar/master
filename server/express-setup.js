const config = require('./config/get-config'),
  process = require('process'),
  path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  NamedApiError = require('./lib/common/named-api-error'),
  notFound = require('./lib/middleware/not-found'),
  errorHandler = require('./lib/middleware/error-handler'),
  moduleRouter = require('./api/common/module/router'),
  allocationRuleRouter = require('./api/common/allocation-rule/router'),
  submeasureRouter = require('./api/common/submeasure/router'),
  fileRouter = require('./api/common/file/router'),
  User = require('./lib/models/user'),
  authorize = require('./lib/middleware/authorize'),
  dollarUploadRouter = require('./api/pft/dollar-upload/router'),
  mappingUploadRouter = require('./api/pft/mapping-upload/router'),
  measureRouter = require('./api/common/measure/router'),
  openPeriodRouter = require('./api/common/open-period/router'),
  lookupRouter = require('./api/common/lookup/router'),
  reportRouter = require('./api/pft/report/router'),
  uploadRouter = require('./api/pft/upload/router');

// start express
const app = express();
module.exports = app;

var corsOptions = {
  origin: config.corsOrigin,
  credentials: true
}
app.use(cors(corsOptions));
app.use(function(req, res, next) {
  //todo: placeholder for req.user.id till security is in
  req.user = new User('jodoe', 'John Doe', 'dakahle@cisco.com', []);
  next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(morgan('dev'));
app.get('/cause-error', function (req, res, next) {
  if (process.env.NODE_ENV === 'unit') {
    const err = new NamedApiError('CauseError', 'api error with data', {some: 'thing'});
    throw err;
  } else {
    next();
  }
})
app.get('/crash-site', function (req, res, next) {
  if (process.env.NODE_ENV === 'unit') {
    process.exit(666);
  } else {
    next();
  }
})

app.use(authorize('api:access')); // authorize api access
app.use('/api/file', fileRouter);
app.use('/api/open-period', openPeriodRouter);
app.use('/api/module', moduleRouter);
app.use('/api/measure', measureRouter);
app.use('/api/allocation-rule', allocationRuleRouter);
app.use('/api/submeasure', submeasureRouter);
app.use('/api/lookup', lookupRouter);
// profitability:
app.use('/api/pft/dollar-upload', dollarUploadRouter);
app.use('/api/pft/mapping-upload', mappingUploadRouter);
app.use('/api/pft/report', reportRouter);
app.use('/api/pft/upload', uploadRouter);


app.use(express.static(path.resolve(__dirname, '../ui/dist')));

app.get(['/', '/pft/*'], (req, res) => {
  console.log('>>>>>> served index.html');
  res.sendFile(path.resolve(__dirname, '../ui/dist') + '/index.html');
});

app.use(notFound());
app.use(errorHandler({showStack: config.showStack}));
