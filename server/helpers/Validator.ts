import { Request } from 'express';
import Joi from 'joi';
import ApiError from '../utils/ApiError';
import HttpStatusCode from './HttpsResponse';

class Validator {
  static validateBody<T>(
    requestDTO: Joi.PartialSchemaMap<T>,
    requestBody: T,
  ): Joi.ValidationResult {
    const schema = Joi.object<T>(requestDTO);
    return schema.validate(requestBody, { abortEarly: false });
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
