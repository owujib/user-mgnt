import { Request } from 'express';
import Joi from 'joi';
import ApiError from '../utils/ApiError';
import HttpStatusCode from './HttpsResponse';

class Validator {
  static validateBody(req: Request, validationSchema: any) {
    const schema = Joi.object(validationSchema);
    return schema.validate(req.body);
  }

  static RequestValidationError(payload: any) {
    return new ApiError(
      'Request Validation Error',
      HttpStatusCode.HTTP_BAD_REQUEST,
      payload,
    );
  }
}

export default Validator;
