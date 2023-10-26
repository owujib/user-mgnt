"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const HttpsResponse_1 = __importDefault(require("./HttpsResponse"));
class Validator {
    static validateBody(requestDTO, requestBody) {
        const schema = joi_1.default.object(requestDTO);
        return schema.validate(requestBody, { abortEarly: false });
    }
    static RequestValidationError(payload) {
        return new ApiError_1.default('Request Validation Error', HttpsResponse_1.default.HTTP_BAD_REQUEST, payload);
    }
}
exports.default = Validator;
