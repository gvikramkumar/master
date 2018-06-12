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
  dollarUploadRouter = require('./api/prof/dollar-upload/router'),
  mappingUploadRouter = require('./api/prof/mapping-upload/router'),
  deptUploadRouter = require('./api/prof/dept-upload/router'),
  salesSplitUploadRouter = require('./api/prof/sales-split-upload/router'),
  productClassUploadRouter = require('./api/prof/product-class-upload/router'),
  measureRouter = require('./api/common/measure/router'),
  openPeriodRouter = require('./api/common/open-period/router'),
  lookupRouter = require('./api/common/lookup/router'),
  reportRouter = require('./api/prof/report/router'),
  uploadRouter = require('./api/prof/upload/router');

// start express
const app = express();
module.exports = app;

/*
app.use(function tap(req, res, next) {
  console.log(req.method, req.url);
  next();
})
*/

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
app.use('/api/prof/dollar-upload', dollarUploadRouter);
app.use('/api/prof/mapping-upload', mappingUploadRouter);
app.use('/api/prof/dept-upload', deptUploadRouter);
app.use('/api/prof/sales-split-upload', salesSplitUploadRouter);
app.use('/api/prof/product-class-upload', productClassUploadRouter);
app.use('/api/prof/report', reportRouter);
app.use('/api/prof/upload', uploadRouter);


app.use(express.static(path.resolve(__dirname, '../ui/dist')));

app.get(['/', '/prof/*'], (req, res) => {
  console.log('>>>>>> served index.html');
  res.sendFile(path.resolve(__dirname, '../ui/dist') + '/index.html');
});

app.use(notFound());
app.use(errorHandler({showStack: config.showStack}));
