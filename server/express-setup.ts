import config from './config/get-config';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import notFound from './lib/middleware/not-found';
import {errorHandler} from './lib/middleware/error-handler';
import {moduleLookupRouter} from './api/common/module-lookup/router';
import {reportRouter} from './api/common/report/router';
import {salesSplitUploadRouter} from './api/prof/sales-split-upload/router';
import {deptUploadRouter} from './api/prof/dept-upload/router';
import {mappingUploadRouter} from './api/prof/mapping-upload/router';
import {dollarUploadRouter} from './api/prof/dollar-upload/router';
import {lookupRouter} from './api/lookup/router';
import {submeasureRouter} from './api/common/submeasure/router';
import {allocationRuleRouter} from './api/common/allocation-rule/router';
import {measureRouter} from './api/common/measure/router';
import {moduleRouter} from './api/common/module/router';
import {openPeriodRouter} from './api/common/open-period/router';
import {fileRouter} from './api/file/router';
import {productClassUploadRouter} from './api/prof/product-class-upload/router';
import {profUploadRouter} from './api/prof/upload/router';
import {sourceRouter} from './api/common/source/router';
import {pgLookupRouter} from './api/pg-lookup/router';
import {addSsoUser} from './lib/middleware/add-sso-user';
import {userRouter} from './api/user/router';
import {moduleSourceRouter} from './api/common/module-source/router';
import {databaseRouter} from './api/database/router';
import {addGlobalData} from './lib/middleware/add-global-data';
import {healthcheck} from './lib/middleware/healthcheck';
import {distiDirectUploadRouter} from './api/prof/disti-direct-upload/router';
import {timeoutHandler} from './lib/middleware/timeout-handler';
import {runJobRouter} from './api/run-job/router';
import AnyObj from '../shared/models/any-obj';
import Q from 'q';
import {svrUtil} from './lib/common/svr-util';
import { processDateRouter } from './api/bkgm/processing-date-input/router';


export const app = express();


export function initializeExpress() {

  /*
    app.use(function tap(req, res, next) {
      console.log(req.method, req.url);
      next();
    })
  */

  app.use(timeoutHandler());

  app.use(express.static(path.resolve(__dirname, '../../ui/dist'), {index: false}));

  const corsOptions = {
    origin: config.corsOrigin,
    credentials: true
  };
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());

  /*
      app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
        next();
      });
  */

  app.get('/ping', (req, res) => res.send());
  app.get('/healthcheck', healthcheck());

  app.get('/timeout/:delay', function (req: AnyObj, res, next) {
    const delay = Number(req.params.delay);
    Q().delay(delay)
      .then(() => res.json({delay}));
  });

  app.use(addSsoUser());
  app.use(addGlobalData());

  // app.use(siteRestriction());

  // need this below security so we can show friendly message on page (instead of an error dialog)
  app.get(['/', '/admn/*', '/prof/*', '/prdt/*', '/bkgm/*', '/svct/*', '/tsct/*', '/ascg/*',
    '/cisc/*', '/opex/*', '/defr/*', '/gubr/*', '/bkir/*', '/rrev/*'], (req, res) => {
    // console.log('>>>>>> served index.html');
    res.sendFile(path.resolve(__dirname, '../../ui/dist/index.html'));
  });
if (!svrUtil.isUnitEnv()) {
  app.use(morgan(function (tokens, req, res) {
    return [
      new Date().toISOString(),
      req.user.id,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ');
  }));
}


  /*
    app.get('/cause-error', function (req, res, next) {
      if (svrUtil.isLocalEnv()) {
        const err = new NamedApiError('CauseError', 'api error with data');
        throw err;
      } else {
        next();
      }
    })

      app.get('/crash-site', function (req, res, next) {
        if (svrUtil.isLocalEnv()) {
          process.exit(666);
        } else {
          next();
        }
      })
  */

  app.use('/api/allocation-rule', allocationRuleRouter);
  app.use('/api/database', databaseRouter);
  app.use('/api/file', fileRouter);
  app.use('/api/lookup', lookupRouter);
  app.use('/api/measure', measureRouter);
  app.use('/api/module', moduleRouter);
  app.use('/api/module-lookup', moduleLookupRouter);
  app.use('/api/module-source', moduleSourceRouter);
  app.use('/api/open-period', openPeriodRouter);
  app.use('/api/pg-lookup', pgLookupRouter);
  app.use('/api/report', reportRouter);
  app.use('/api/run-job', runJobRouter);
  app.use('/api/source', sourceRouter);
  app.use('/api/submeasure', submeasureRouter);
  app.use('/api/user', userRouter);

  // prof:
  app.use('/api/prof/dept-upload', deptUploadRouter);
  app.use('/api/prof/dollar-upload', dollarUploadRouter);
  app.use('/api/prof/mapping-upload', mappingUploadRouter);
  app.use('/api/prof/product-class-upload', productClassUploadRouter);
  app.use('/api/prof/sales-split-upload', salesSplitUploadRouter);
  app.use('/api/prof/upload', profUploadRouter);
  app.use('/api/prof/disti-direct-upload', distiDirectUploadRouter);

  //bkgm:
  app.use('/api/bkgm/processing-date-input', processDateRouter);

  app.use(notFound());
  app.use(errorHandler({showStack: config.showStack}));

  return app;
}

