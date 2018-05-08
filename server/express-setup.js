const config = require('./config/get-config'),
  process = require('process'),
  path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  ApiError = require('./lib/common/api-error'),
  notFound = require('./lib/middleware/not-found'),
  errorHandler = require('./lib/middleware/error-handler'),
  logger = require('./lib/middleware/logger'),
  moduleRouter = require('./api/common/module/router'),
  allocationRuleRouter = require('./api/pft/allocation-rule/router'),
  submeasureRouter = require('./api/pft/submeasure/router'),
  fileRouter = require('./api/common/file/router'),
  User = require('./lib/models/user'),
  authorize = require('./lib/middleware/authorize');



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
  req.user = new User('jodoe', 'John Doe', []);
  next();
})
app.use(bodyParser.json());
app.use(cookieParser());

app.use(morgan('dev'));
app.get('/cause-error', function (req, res, next) {
  if (process.env.NODE_ENV === 'unit') {
    const err = new ApiError('api error with data', {some: 'thing'});
    err.name = 'dank';
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

app.use(authorize('api_access')); // authorize api access
app.use('/api/module', moduleRouter);
app.use('/api/allocation-rule', allocationRuleRouter);
app.use('/api/submeasure', submeasureRouter);
app.use('/api/file', fileRouter);

app.use(express.static(path.resolve(__dirname, '../ui/dist')));

app.get(['/', '/pft/*'], (req, res) => {
  console.log('>>>>>> served index.html');
  res.sendFile(path.resolve(__dirname, '../ui/dist') + '/index.html');
});

app.use(notFound());
app.use(errorHandler({showStack: config.showStack}));
