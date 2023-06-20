import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../utils/ApiError';
import HttpStatusCode from '../helpers/HttpsResponse';
import Helper from '../helpers';

interface validatorFunctionType {
  (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void;
}

interface uploadHandlerType {
  fields: { name: string; maxCount: number }[];
  validationFunction: validatorFunctionType;
  limit: number | null;
}

export function uploadFileHandler({
  fields,
  validationFunction,
  limit,
}: uploadHandlerType) {
  let storage = multer.diskStorage({
    destination: (req: Request, file: any, callback: any): void => {
      callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, `${file.fieldname}-image-${uniqueSuffix}${path.extname}`);
    },
  });
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
            new ApiError(
              'Request File Error',
              HttpStatusCode.HTTP_BAD_REQUEST,
              err,
            ),
          );
        } else if (err) {
          throw next(
            new ApiError('Server error', HttpStatusCode.HTTP_BAD_REQUEST, err),
          );
        }

        const filePath = req.files;
        return originalMethod.call(this, req, res);
      });
    };
  };
}
