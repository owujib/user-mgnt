import { Response, Request, NextFunction } from 'express';
import Controller from '.';

import Helper from '../../helpers';
import HttpStatusCode from '../../helpers/HttpsResponse';
import Validator from '../../helpers/Validator';
import Joi from 'joi';

import ApiError from '../../utils/ApiError';
import AuthMail from '../../mail/Authmail';
import User from '../../models/User';
import { CreateUserDto, UpdateUserDto } from 'api/dto';

class UserController extends Controller {
  constructor() {
    super();
  }

  public async UpdateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { error } = Validator.validateBody<UpdateUserDto>(
        {
          email: Joi.string().email(),
          username: Joi.string(),
        },
        req.body,
      );

      if (error) {
        return next(
          Validator.RequestValidationError(
            error?.details.map((err) => err.message),
          ),
        );
      }

      if (
        await User.findOne({
          $or: [{ email: req.body.email }, { username: req.body.username }],
        })
      ) {
        return next(
          new ApiError(
            'Email or Username has already been taken',
            HttpStatusCode.HTTP_BAD_REQUEST,
            {
              message: 'Try again',
            },
          ),
        );
      }
      const user = await User.findOneAndUpdate(
        { email: (<any>req).user.email },
        {
          $set: {
            ...req.body,
          },
        },
      );

      if (!user) {
        return next(
          new ApiError(
            'Sorry Could not find user details',
            HttpStatusCode.HTTP_BAD_REQUEST,
            {
              message: 'Account does not exit',
            },
          ),
        );
      }

      return super.sendSuccessResponse(
        res,
        { email: user.email, _id: user._id, username: user.username },
        'Password Reset Successful',
        HttpStatusCode.HTTP_OK,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async ListUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find();

      return super.sendSuccessResponse(
        res,
        { users },
        'Password Reset Successful',
        HttpStatusCode.HTTP_OK,
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default new UserController();
