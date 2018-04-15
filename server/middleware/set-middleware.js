const config = require('../config/_get-config'),
  express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  process = require('process'),
  cookieParser = require('cookie-parser'),
  docsRouter = require('./docs/_router'),
  contactsRouter = require('./api/contacts/_router'),
  usersRouter = require('./api/users/_router'),
  loginRouter = require('./api/login/_login-router'),
  registerRouter = require('./api/login/_register-router'),
  authenticate = require('./api/login/_authenticate'),
  cors = require('cors'),
  notFound = require('./not-found'),
  errorHandler = require('./error-handler');


  const app = express();
  module.exports = app;

// redirect to https in prod
  app.use(function (req, res, next) {
    if (config.env === 'prod' && req.get('x-forwarded-proto') !== 'https') {
      res.redirect('https://' + req.headers.host + req.url);
    } else {
      next();
    }
  })

  var corsOptions = {
    origin: config.corsOrigin,
    credentials: true
  }
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(morgan('dev'));

  // e2e test
  app.get('/cause-error', function (req, res) {
    throw new Error('cause-error message');
  })

  // e2e test
  app.get('/crash-site', function (req, res) {
    process.exit(666);
  })

  app.use(docsRouter);
  app.use('/api/login', loginRouter);
  app.use('/api/register', registerRouter);
  app.use(authenticate());
  app.use('/api/contacts', contactsRouter);
  app.use('/api/users', usersRouter);

  app.use(notFound());
  app.use(errorHandler());


