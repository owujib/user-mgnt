"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../config/logger");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const HttpsResponse_1 = __importDefault(require("./HttpsResponse"));
const db = require('../models');
dotenv_1.default.config({ path: path_1.default.resolve('.env') });
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new ApiError_1.default(message, HttpsResponse_1.default.HTTP_BAD_REQUEST, {
        message: errors,
    });
};
const sendErrorDev = (err, req, res) => {
    /** send all error to log file on dev env */
    logger_1.Logger.error({
        url: `${req.method} ${req.originalUrl}`,
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err.error,
    });
    console.error(err.name);
    // A) API routes error
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode || 500).json({
            status: err.status,
            err,
            message: err.message,
            error: err.error,
            stack: err.stack,
        });
    }
    return res.send('<h1>Check Development console</h1>');
};
const sendErrorProd = (err, req, res) => {
    logger_1.Logger.error({
        url: `${req.method} ${req.originalUrl}`,
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err.error,
    });
    console.error({
        url: `${req.method} ${req.originalUrl}`,
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err.error,
    });
    /** check errors in API routes  */
    if (req.originalUrl.startsWith('/api')) {
        /** checks for validation error */
        if (err.message === 'Request Validation Error') {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                error: err.error,
            });
        }
        // A) Operational, trusted error: send messagex to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                error: err.error,
            });
        }
        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong! please contact support',
        });
    }
    return res
        .status(HttpsResponse_1.default.HTTP_INTERNAL_SERVER_ERROR)
        .json({ message: 'unexpected server error' });
};
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    err.statusCode =
        err.statusCode || HttpsResponse_1.default.HTTP_INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV !== 'production') {
        return sendErrorDev(err, req, res);
    }
    let error = Object.assign(Object.assign({}, err), { status: err.status, message: err.message, stack: err.stack, error: err.error });
    if (error.name === 'SequelizeValidationError') {
        error = handleValidationErrorDB(error);
    }
    return sendErrorProd(error, req, res);
});
exports.default = globalErrorHandler;
