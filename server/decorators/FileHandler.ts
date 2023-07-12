import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../utils/ApiError';
import { HttpStatusCode } from 'axios';
import Helper from '../helpers';
import { uploadHandlerType } from '../types';
import fileConfig from '../config/fileConfig';
import Helpers from '../helpers';

let storage = multer.diskStorage({
  destination: (req: Request, file: any, callback: any): void => {
    callback(null, fileConfig.disks.local.root);
  },
  filename: (req, file, callback) => {
    callback(null, Helpers.generateUniqueFilename(file.originalname));
  },
});

export function uploadFileHandler({
  fields,
  validationFunction,
  limit,
}: uploadHandlerType) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const upload = multer({
      storage: storage,
      fileFilter: validationFunction,
      limits: {
        fileSize: limit || Helper.convertToBytes(2),
      },
    });
    const originalMethod = descriptor.value;
    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      upload.fields(fields)(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
          throw next(
            new ApiError('Request File Error', HttpStatusCode.BadRequest, err),
          );
        } else if (err) {
          throw next(
            new ApiError('Server error', HttpStatusCode.BadRequest, err),
          );
        }

        const filePath = req.files;
        return originalMethod.call(this, req, res, next);
      });
    };
  };
}

export const uploadHelper = ({
  validationFunction,
  fields,
  limit,
}: uploadHandlerType) => {
  const upload = multer({
    storage: storage,
    fileFilter: validationFunction,
    limits: {
      fileSize: limit || Helper.convertToBytes(2),
    },
  });

  return upload.fields(fields);
};
