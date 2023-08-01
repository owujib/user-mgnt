import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';

import 'dotenv/config';

import ApiError from './utils/ApiError';
import HttpStatusCode from './helpers/HttpsResponse';

// const db = require('./models');
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

    this.app.set('PORT', process.env.PORT || 5500);
    this.app.set('NODE_ENV', process.env.NODE_ENV);
  }

  middlewares() {
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'ejs');

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(morgan('combined'));
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  webhooks() {}

  routes() {}

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
    return '';
  }
}

export default new Kernel().app;
