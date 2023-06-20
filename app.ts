import express from 'express';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';
import ApiError from './server/utils/ApiError';
import HttpStatusCode from './server/helpers/HttpsResponse';
import serverConfig from './server.config.json';
import ServerFileHandler from './server/utils/ServerFileHandler';

const db = require('./models');
process.env.TZ = 'Africa/Lagos';

class Kernel extends ServerFileHandler {
  app: express.Application;

  constructor() {
    super();
    this.app = express();

    this.setUp();

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

    this.app.use(morgan('combined'));
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  webhooks() {}

  routes() {}

  // registerRoute(
  //   routeMethod: 'get' | 'post' | 'put' | 'patch' | 'delete',
  //   routePath: string,
  //   routeHandler: RouteHandlerDecorator,
  // ) {
  //   this.app[routeMethod](routePath, routeHandler.bind(userController));
  // }

  errorHandler() {
    this.app.use(function (req, res, next) {
      return next(
        new ApiError('Route not found', HttpStatusCode.HTTP_NOT_FOUND, {
          message:
            'The route you are looking for has been moved or does not exist',
        }),
      );
    });

    // this.app.use(globalErrorHandler);
  }

  databaseConnection() {
    return '';
  }

  setUp() {
    for (const key in serverConfig.dirs) {
      console.log(key);
      this.runDirs((<any>serverConfig).dirs[key]);
    }
  }
}

export default new Kernel().app;
