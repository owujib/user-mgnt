import { Response, Request, NextFunction } from 'express';
import Controller from '.';

import Helper from '../../helpers';
import HttpStatusCode from '../../helpers/HttpsResponse';
import Validator from '../../helpers/Validator';
import Joi from 'joi';

import db from '../../models';
import ApiError from '../../utils/ApiError';
import AuthMail from '../../mail/Authmail';

class AuthController extends Controller {
  constructor() {
    super();
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = Validator.validateBody(req, {
        email: Joi.string().email().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        password: Joi.string().required(),
      });

      if (error) {
        return next(Validator.RequestValidationError(error.message));
      }

      if (
        await db.User.findOne({
          where: {
            email: req.body.email,
          },
        })
      ) {
        return next(
          new ApiError(
            'A user with the given email already exists',
            HttpStatusCode.HTTP_BAD_REQUEST,
            {
              message: 'Account exists',
            },
          ),
        );
      }

      const user = await db.User.create({
        ...req.body,
        password: Helper.hash(req.body.password, 10),
      });

      await new AuthMail(user).sendWelcome({ title: 'welcome' });
      return super.sendSuccessResponse(
        res,
        {
          id: user.id,
          emai: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        },
        'Account has been created',
        HttpStatusCode.HTTP_CREATED,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      return super.sendSuccessResponse(
        res,
        {},
        'Login successfull',
        HttpStatusCode.HTTP_OK,
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();
