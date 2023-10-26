import { NextFunction, Request, Response, Router } from 'express';
import HttpStatusCode from '../helpers/HttpsResponse';
import ApiError from '../utils/ApiError';
import { ClassDeclaration } from 'typescript';
import kernel from '../kernel';

type RouteHandlerDecorator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

function createRouteHandlerDecorator(
  method: string,
): (path: string) => MethodDecorator {
  return function (path: string): any {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) {
      const originalMethod = descriptor.value;

      descriptor.value = function (
        req: Request,
        res: Response,
        next: NextFunction,
      ) {
        try {
          originalMethod.call(this, req, res, next);
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      };

      // Attach the route path and method as custom properties on the method
      descriptor.value.routePath = path;
      descriptor.value.routeMethod = method.toUpperCase();

      return target;
    };
  };
}

export const Get = createRouteHandlerDecorator('get');
export const Post = createRouteHandlerDecorator('post');
export const Put = createRouteHandlerDecorator('put');
export const Patch = createRouteHandlerDecorator('patch');
export const Delete = createRouteHandlerDecorator('delete');

// Define a decorator function for handling route handlers
export function routeHandler(path: string, method: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (req: Request, res: Response) {
      // Check if the request method matches the decorated method
      if (req.method !== method) {
        throw new ApiError(
          'Method Not Allowed',
          HttpStatusCode.HTTP_METHOD_NOT_ALLOWED,
          {
            message: 'Method Not Allowed',
          },
        );
      }

      // Call the original method
      originalMethod.call(this, req, res);
    };
  };
}
