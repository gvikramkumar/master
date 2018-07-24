import config from './config/get-config';
import process from 'process';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {NamedApiError} from './lib/common/named-api-error';
import notFound from './lib/middleware/not-found';
import errorHandler from './lib/middleware/error-handler';
import User from './lib/models/user';
import {authorize} from './lib/middleware/authorize';
import {moduleLookupRouter} from './api/common/module-lookup/router';
import {reportRouter} from './api/prof/report/router';
import {salesSplitUploadRouter} from './api/prof/sales-split-upload/router';
import {deptUploadRouter} from './api/prof/dept-upload/router';
import {mappingUploadRouter} from './api/prof/mapping-upload/router';
import {dollarUploadRouter} from './api/prof/dollar-upload/router';
import {lookupRouter} from './api/common/lookup/router';
import {submeasureRouter} from './api/common/submeasure/router';
import {allocationRuleRouter} from './api/common/allocation-rule/router';
import {measureRouter} from './api/common/measure/router';
import {moduleRouter} from './api/common/module/router';
import {openPeriodRouter} from './api/common/open-period/router';
import {fileRouter} from './api/common/file/router';
import {productClassUploadRouter} from './api/prof/product-class-upload/router';
import {profUploadRouter} from './api/prof/upload/router';
import {sourceRouter} from './api/common/source/router';


export default function () {

  // start express
  const app = express();
  module.exports = app;

  /*
  app.use(function tap(req, res, next) {
    console.log(req.method, req.url);
    next();
  })
  */

  const corsOptions = {
    origin: config.corsOrigin,
    credentials: true
  }
  app.use(cors(corsOptions));
  app.use(function(req, res, next) {
    // todo: placeholder for req.user.id till security is in
    req['user'] = new User('jodoe', 'John Doe', 'dakahle@cisco.com', []);
    next();
  })

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());

  app.use((req, res, next) => {
    console.log(` ${req['user'].id}: ${req.method} - ${req.url}`);
    next();
  });
  // app.use(morgan('dev'));
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
  app.use('/api/allocation-rule', allocationRuleRouter);
  app.use('/api/file', fileRouter);
  app.use('/api/lookup', lookupRouter);
  app.use('/api/module', moduleRouter);
  app.use('/api/module-lookup', moduleLookupRouter);
  app.use('/api/measure', measureRouter);
  app.use('/api/open-period', openPeriodRouter);
  app.use('/api/source', sourceRouter);
  app.use('/api/submeasure', submeasureRouter);

  // prof:
  app.use('/api/prof/dept-upload', deptUploadRouter);
  app.use('/api/prof/dollar-upload', dollarUploadRouter);
  app.use('/api/prof/mapping-upload', mappingUploadRouter);
  app.use('/api/prof/product-class-upload', productClassUploadRouter);
  app.use('/api/prof/report', reportRouter);
  app.use('/api/prof/sales-split-upload', salesSplitUploadRouter);
  app.use('/api/prof/upload', profUploadRouter);


  app.use(express.static(path.resolve(__dirname, '../../ui/dist')));

  app.get(['/', '/prof/*', '/prdt/*', '/bkgm/*', '/svct/*', '/tsct/*', '/ascg/*',
    '/cisc/*', '/opex/*', '/defr/*', '/gubr/*', '/bkir/*', '/rrev/*'], (req, res) => {
    console.log('>>>>>> served index.html');
    res.sendFile(path.resolve(__dirname, '../../ui/dist/index.html'));
  });

  app.use(notFound());
  app.use(errorHandler({showStack: config.showStack}));

  return app;
}

