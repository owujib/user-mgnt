import jwt from 'jsonwebtoken';
import crypto from 'crypto-js';

import { randomUUID } from 'crypto';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import path from 'path';

import bcrypt from 'bcryptjs';

import HttpStatusCode from './HttpsResponse';
import ApiError from '../utils/ApiError';
import JwtAccessToken from '../models/JwtAccessToken';
import { UserAttributes } from 'interface/models';

export default class Helper {
  static signToken(payload: any): { token: string } {
    const token = jwt.sign(payload, (<any>process.env).APP_KEY, {
      expiresIn: (<any>process).env.JWT_EXPIRES_IN,
    });
    return { token };
  }

  static veifyToken(payload: any): { token: any } {
    const token = jwt.verify(payload, (<any>process.env).APP_KEY);
    return { token };
  }

  static hash(value: string, saltValue: number) {
    return bcrypt.hashSync(value, saltValue);
  }

  static correctPassword(inputPassword: string, userPassword: string) {
    return bcrypt.compareSync(inputPassword, userPassword);
  }

  static addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static getPublicId(imageURL: string): string {
    const [, publicIdWithExtensionName] = imageURL.split('upload/');
    const extensionName = path.extname(publicIdWithExtensionName);
    const publicId = publicIdWithExtensionName
      .replace(extensionName, '')
      .split('/')
      .slice(1)
      .join('/');

    return publicId;
  }

  static async createAccessToken(user: UserAttributes) {
    try {
      const { token } = Helper.signToken({
        id: user._id,
        email: user.email,
      });
      const date = Helper.addDays(new Date(), 2);
      const jwtToken = await JwtAccessToken.create({
        token,
        user_id: user._id,
        revoked: false,
        expires_at: date,
        expires_at_ms: date.getTime(),
      });

      return jwtToken?.token;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description one byte = 1000000
   * to convert to megabyte times by byte
   * to convert to gigabyte time by 1e9
   */
  static convertToBytes(value: number) {
    const BYTES = 1000000;
    return value * BYTES;
  }

  static generateUniqueFilename(filename: string) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${filename.split('.')[0]}-${uniqueSuffix}${path.extname(filename)}`;
  }

  /**
   * ```markdown
   * `supportedFiles = ['image/jpeg', 'image/png', 'application/pdf'];`
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
   * ```
   */
  static requestFileValidation(supportedFiles: string[]) {
    return (
      _: Request,
      file: Express.Multer.File,
      callback: FileFilterCallback,
    ) => {
      if (supportedFiles.includes(file.mimetype)) {
        return callback(null, true);
      } else {
        return callback(
          new ApiError(
            'Unsupported file format',
            HttpStatusCode.HTTP_BAD_REQUEST,
            {},
          ),
        );
      }
    };
  }

  static calculateTimeZoneWithPlusOneGMT(date: Date, timeZone: number) {
    // Get the current time in GMT
    const gmtTime = date.toUTCString();

    // Create a new Date object with the GMT time and add 1 hour
    const plusOneGMTTime = new Date(gmtTime);
    plusOneGMTTime.setHours(plusOneGMTTime.getHours() + timeZone);

    // Return the new Date object
    return plusOneGMTTime;
  }

  static randomStringGenerator(length: number): string {
    let result = '';
    const Characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const CharactersLength = Characters.length;

    // NOTE: Max Length Allowed Is 500...
    if (length >= 500) {
      length = 500;
    }

    // Shuffle The Characters String According To The Passed In The Length...
    for (let i = 0; i < length; i++) {
      result += Characters.charAt(Math.floor(Math.random() * CharactersLength));
    }

    // Return The Generated String...
    return result;
  }
}
