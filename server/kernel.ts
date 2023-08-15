import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import path from 'path';

import ApiError from './utils/ApiError';
import HttpStatusCode from './helpers/HttpsResponse';

import testRoute from './routes/test.routes';
import authRoute from './routes/auth.routes';
import { uploadHelper } from './decorators/FileHandler';
import Helper from './helpers';
import logs, { Logger } from './config/logger';
// const { logs } = require('./config/logger');

import db from './models';
process.env.TZ = 'Africa/Lagos';

class Kernel {
  app: express.Application;

  constructor() {
    this.app = express();

    this.middlewares();

    this.webhooks();
    this.routes();
    this.errorHandler();
    this.databaseConnection();
  }

  middlewares() {
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'ejs');

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.set('PORT', process.env.PORT || 5500);
    this.app.set('NODE_ENV', process.env.NODE_ENV);
    this.app.use(morgan('combined', { stream: logs.stream }));

    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  webhooks() {}

  routes() {
    this.app.use('/api/auth', authRoute);
    this.app.use('/test', testRoute);
    this.app.get('/home', (req, res, next) =>
      res.status(200).json({
        nessage: 'hello',
      }),
    );

    this.app.post(
      '/upload',
      uploadHelper({
        fields: [{ name: 'image', maxCount: 1 }],
        validationFunction: Helper.requestFileValidation([
          'image/jpeg',
          'image/png',
        ]),
        limit: null,
      }),
      (req, res, next) => {
        return res
          .status(200)
          .json({ files: (<any>req).files.image[0], file: req.file });
      },
    );
  }

  errorHandler() {
    /**404 routes */
    this.app.all('*', (req, res, next) => {
      return next(
        new ApiError('Route not found', HttpStatusCode.HTTP_NOT_FOUND, {
          message:
            'The route you are looking for has been moved or does not exist',
        }),
      );
    });

    /**global error handler */
    this.app.use(
      (err: ApiError, req: Request, res: Response, next: NextFunction) => {
        err.statusCode =
          err.statusCode || HttpStatusCode.HTTP_INTERNAL_SERVER_ERROR;
        err.status = err.status || 'error';

        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
          error: err.error,
        });
      },
    );
  }

  databaseConnection() {
    (async function () {
      try {
        await db.sequelize.authenticate();
        Logger.info('Database connection is successful');
      } catch (error) {
        Logger.error('Database connection error: ', error);
      }
    })();
  }
}

export default new Kernel().app;
