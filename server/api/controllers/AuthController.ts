import { Response, Request, NextFunction } from 'express';
import Controller from '.';

import Helper from '../../helpers';
import HttpStatusCode from '../../helpers/HttpsResponse';
import Validator from '../../helpers/Validator';
import Joi from 'joi';

import ApiError from '../../utils/ApiError';
import AuthMail from '../../mail/Authmail';
import { CreateUserDto } from 'api/dto';
import User from 'models/User';

class AuthController extends Controller {
  constructor() {
    super();
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = Validator.validateBody<CreateUserDto>({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().required().min(5).max(15),
      });

      console.log(error?.details);

      if (error) {
        return next(
          Validator.RequestValidationError(
            error?.details.map((err) => err.message),
          ),
        );
      }

      // if (
      // await User.findOne({})
      // ) {
      //   return next(
      //     new ApiError(
      //       'A user with the given email already exists',
      //       HttpStatusCode.HTTP_BAD_REQUEST,
      //       {
      //         message: 'Account exists',
      //       },
      //     ),
      //   );
      // }

      //   const user = await db.User.create({
      //     ...req.body,
      //     password: Helper.hash(req.body.password, 10),
      //   });

      //   await new AuthMail(user).sendWelcome({ title: 'welcome' });
      //   return super.sendSuccessResponse(
      //     res,
      //     {
      //       id: user.id,
      //       emai: user.email,
      //       firstname: user.firstname,
      //       lastname: user.lastname,
      //     },
      //     'Account has been created',
      //     HttpStatusCode.HTTP_CREATED,
      //   );
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
