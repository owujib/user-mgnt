"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeHandler = exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = void 0;
const HttpsResponse_1 = __importDefault(require("../helpers/HttpsResponse"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
function createRouteHandlerDecorator(method) {
    return function (path) {
        return function (target, propertyKey, descriptor) {
            const originalMethod = descriptor.value;
            descriptor.value = function (req, res, next) {
                try {
                    originalMethod.call(this, req, res, next);
                }
                catch (error) {
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
exports.Get = createRouteHandlerDecorator('get');
exports.Post = createRouteHandlerDecorator('post');
exports.Put = createRouteHandlerDecorator('put');
exports.Patch = createRouteHandlerDecorator('patch');
exports.Delete = createRouteHandlerDecorator('delete');
// Define a decorator function for handling route handlers
function routeHandler(path, method) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (req, res) {
            // Check if the request method matches the decorated method
            if (req.method !== method) {
                throw new ApiError_1.default('Method Not Allowed', HttpsResponse_1.default.HTTP_METHOD_NOT_ALLOWED, {
                    message: 'Method Not Allowed',
                });
            }
            // Call the original method
            originalMethod.call(this, req, res);
        };
    };
}
exports.routeHandler = routeHandler;
