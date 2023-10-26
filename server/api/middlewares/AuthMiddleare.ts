import { NextFunction, Request, RequestHandler, Response } from 'express';
import { promisify } from 'util';
import jwt, { JwtPayload } from 'jsonwebtoken';
import moment from 'moment';
import path from 'path';
import dotenv from 'dotenv';
import ApiError from '../../utils/ApiError';
import { HttpStatusCode } from 'axios';
import JwtAccessTokens from '../../models/JwtAccessToken';
import User from '../../models/User';
import Roles from '../../models/Role';
import UserHasRoles from '../../models/UserHasRole';
import HandleAsync from '../../utils/HandleAsync';

dotenv.config({ path: path.resolve('../../.env') });

class AuthMiddleware {
  public async VerifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      // 1) Getting token and check of it's there
      let token: string | undefined;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      // check is token is present in header
      if (!token) {
        return next(
          new ApiError(
            'You do not an cctive session',
            HttpStatusCode.Unauthorized,
            { message: 'Please login' },
          ),
        );
      }

      // check for token
      const jwtToken = await JwtAccessTokens.findOne({
        token,
        revoked: false,
      });

      if (!jwtToken) {
        return next(
          new ApiError('Unauthorized access', HttpStatusCode.Unauthorized, {
            message: 'Unauthorized Access Please log in',
          }),
        );
      }

      const expiredAt = moment(jwtToken.expires_at);
      const currentDate = moment(Date.now());

      if (currentDate.isAfter(expiredAt)) {
        await JwtAccessTokens.updateOne(
          { token: jwtToken.token },
          {
            revoked: true,
          },
        );

        return next(
          new ApiError(
            'session has expired please log in again',
            HttpStatusCode.Unauthorized,
            {
              message: 'Session has expired',
            },
          ),
        );
      }

      // 2) docode token
      const decoded = jwt.verify(token, <any>process.env.APP_KEY) as JwtPayload;

      // 2) Verification token
      const user = await User.findById((<any>decoded).id);

      // check if user exists
      if (!user) {
        return next(
          new ApiError(
            'data invalid as user does not exist',
            HttpStatusCode.Unauthorized,
            { message: 'User could not be found' },
          ),
        );
      }

      (<any>req).user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  public ProtectRouteFor(role: string) {
    return HandleAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const roleValue = await Roles.findOne({ name: role });

        const userRoles = await UserHasRoles.findOne({
          user_id: (<any>req).user._id,
          role_id: roleValue?._id,
        });

        if (!userRoles) {
          return next(
            new ApiError(
              'You do not have permission to perform this action',
              HttpStatusCode.Forbidden,
              {
                message: 'You do not have access to this resource',
              },
            ),
          );
        }

        return next();
      },
    );
  }

  public async RestrictTo(role: string): Promise<RequestHandler> {
    return HandleAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const roleValue = await Roles.findOne({ name: role });

        const userRoles = await UserHasRoles.findOne({
          user_id: (<any>req).user._id,
          role_id: roleValue?._id,
        });

        if (userRoles) {
          return next(
            new ApiError(
              'You do not have permission to perform this action',
              HttpStatusCode.Forbidden,
              {
                message: 'You do not have access to this resource',
              },
            ),
          );
        }

        return next();
      },
    );
  }
}

export default new AuthMiddleware();
