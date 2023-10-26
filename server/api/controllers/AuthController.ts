import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';
import moment from 'moment';

import Controller from '.';

import Helper from '../../helpers';
import HttpStatusCode from '../../helpers/HttpsResponse';
import Validator from '../../helpers/Validator';

import ApiError from '../../utils/ApiError';
import AuthMail from '../../mail/Authmail';
import {
  CreateUserDto,
  ResetPasswordDto,
  UpdatePasswordDto,
  UserLoginDto,
} from '../dto';
import User from 'models/User';
import Role from 'models/Role';
import UserHasRole from 'models/UserHasRole';
import PasswordReset from 'models/PasswordReset';

class AuthController extends Controller {
  constructor() {
    super();
  }

  public async Register(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = Validator.validateBody<CreateUserDto>(
        {
          email: Joi.string().email().required(),
          username: Joi.string(),
          password: Joi.string().required().min(5).max(15),
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
            'Email or Username already taken',
            HttpStatusCode.HTTP_BAD_REQUEST,
            {
              message: 'Account exists',
            },
          ),
        );
      }

      const userCount = await User.countDocuments();
      const newUserName = `${req.body.email.split('@')[0]}0${userCount}`;

      const user = new User({
        ...req.body,
        password: Helper.hash(req.body.password, 10),
        username: !req.body.username ? newUserName : req.body.username,
      });

      const token = await Helper.createAccessToken(user);
      //add user roles
      const role = await Role.findOne({ name: 'user' });
      if (!role) {
        return next(
          new ApiError('Server error', HttpStatusCode.HTTP_BAD_GATEWAY, {
            message: 'Please contact support: ROLE_ERROR',
          }),
        );
      }
      const userRole = await UserHasRole.create({
        user_id: user._id,
        role_id: role._id,
      });

      await user.save();
      new AuthMail(user.email).sendWelcome({ title: 'Welcome' });

      //   await new AuthMail(user).sendWelcome({ title: 'welcome' });
      return super.sendSuccessResponse(
        res,
        {
          _id: user._id,
          email: user.email,
          username: user.username,
          access_token: token,
        },
        'Account has been created',
        HttpStatusCode.HTTP_CREATED,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async Login(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = Validator.validateBody<UserLoginDto>(
        {
          identity: Joi.string().required(),
          password: Joi.string().required().min(5).max(15),
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

      const user = await User.findOne({
        $or: [{ email: req.body.identity }, { username: req.body.identity }],
      });

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

      if (!Helper.correctPassword(req.body.password, user.password)) {
        return next(
          new ApiError(
            'Something went wrong',
            HttpStatusCode.HTTP_BAD_REQUEST,
            {
              message: 'Please check you information and try again',
            },
          ),
        );
      }

      const token = await Helper.createAccessToken(user);

      user.last_login = new Date();
      await user.save();

      return super.sendSuccessResponse(
        res,
        {
          _id: user._id,
          last_login: user.last_login,
          username: user.username,
          email: user.email,
          access_token: token,
        },
        'Login successfull',
        HttpStatusCode.HTTP_OK,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async ForgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findOne({ email: req.params.email });

      if (!user) {
        return next(
          new ApiError(
            'Sorry credentials not found',
            HttpStatusCode.HTTP_NOT_FOUND,
            {
              message: 'No record found',
            },
          ),
        );
      }

      let minutes = moment().add(20, 'minutes');
      const date = Helper.calculateTimeZoneWithPlusOneGMT(
        new Date(minutes.toDate()),
        !req.query.tz ? 1 : Number(req.query.tz),
      );
      const code = Helper.randomStringGenerator(5);
      const newResetToken = await PasswordReset.create({
        reset_token: code,
        user_id: user._id,
        reset_token_expires_at: date,
        reset_token_expires_at_ms: date.getTime(),
      });

      await new AuthMail(user.email).forgotPasswordMail({
        title: 'Forgot password Mail',
        code,
      });

      return super.sendSuccessResponse(
        res,
        { email: user.email },
        'Email Sent',
        HttpStatusCode.HTTP_OK,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async ResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = Validator.validateBody<ResetPasswordDto>(
        {
          code: Joi.string().email(),
          password: Joi.string().min(5).max(15),
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

      const resetCode = await PasswordReset.findOne({
        reset_token: req.body.code,
      });

      if (!resetCode) {
        return next(
          new ApiError('Sorry try again', HttpStatusCode.HTTP_NOT_FOUND, {
            message: 'Code not found',
          }),
        );
      }

      let user = await User.findOneAndUpdate(
        { _id: resetCode.user_id },
        { password: Helper.hash(req.body.password, 10) },
      );

      if (!user) {
        return next(
          new ApiError(
            'Sorry credentials not found',
            HttpStatusCode.HTTP_NOT_FOUND,
            {
              message: 'No record found',
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

  public async UpdatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = Validator.validateBody<UpdatePasswordDto>(
        {
          new_password: Joi.string().min(5).max(15),
          current_password: Joi.string().min(5).max(15),
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

      const user = (<any>req).user;

      console.log(user);

      const isCurrentPasswordValid = Helper.correctPassword(
        req.body.current_password,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        return next(
          new ApiError(
            'Current Password is invalid',
            HttpStatusCode.HTTP_NOT_FOUND,
            {
              message: 'Try again',
            },
          ),
        );
      }

      if (req.body.current_password === req.body.new_password) {
        return next(
          new ApiError(
            'Passwords can not be same',
            HttpStatusCode.HTTP_NOT_FOUND,
            {
              message: 'Try again',
            },
          ),
        );
      }

      console.log(user, req.body);
      // Update the user's password in the database
      const hashedNewPassword = Helper.hash(req.body.new_password, 10);
      user.password = hashedNewPassword;
      await user.save();

      // Respond with success
      return super.sendSuccessResponse(
        res,
        { email: user.email, _id: user._id, username: user.username },
        'Password updated successfully',
        HttpStatusCode.HTTP_OK,
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();
