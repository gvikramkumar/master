const config = require('../../config/get-config'),
  express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  process = require('process'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  // docsRouter = require('./docs/_router'),
  // usersRouter = require('./api/users/_router'),
  // authenticate = require('./api/login/_authenticate'),
  cors = require('cors'),
  notFound = require('./not-found'),
  errorHandler = require('./error-handler'),
  logger = require('./logger'),
  userRouter = require('../../rest/user/router'),
  graphqlHTTP = require('express-graphql'),
  schema = require('../../graphql');


const app = express();
module.exports = app;

var corsOptions = {
  origin: config.corsOrigin,
  credentials: true
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(logger({mode: 'short'}));
// app.use(morgan('dev'));

// test endpoints
app.get('/cause-error', function (req, res) {
  throw new Error('cause-error message');
})
app.get('/crash-site', function (req, res) {
  process.exit(666);
})

// app.use(docsRouter);
// app.use(authenticate());
app.use('/api/users', userRouter);
app.use('/api/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack ? error.stack.split('\n') : [],
    path: error.path
  })
}));

app.use(express.static(path.resolve(__dirname, '../ui/dist')));

/*
app.use('/api/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack ? error.stack.split('\n') : [],
    path: error.path
  })
}));
*/

app.get('*', (req, res) => {
  console.log('>>>>>> served index.html');
  res.sendFile(path.resolve(__dirname, '../ui/dist') + '/index.html');
});

app.use(notFound());
app.use(errorHandler({showStack: config.showStack}));


