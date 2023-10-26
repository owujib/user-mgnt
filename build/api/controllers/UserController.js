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
const _1 = __importDefault(require("."));
const HttpsResponse_1 = __importDefault(require("../../helpers/HttpsResponse"));
const Validator_1 = __importDefault(require("../../helpers/Validator"));
const joi_1 = __importDefault(require("joi"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const User_1 = __importDefault(require("../../models/User"));
class UserController extends _1.default {
    constructor() {
        super();
    }
    UpdateUserProfile(req, res, next) {
        const _super = Object.create(null, {
            sendSuccessResponse: { get: () => super.sendSuccessResponse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = Validator_1.default.validateBody({
                    email: joi_1.default.string().email(),
                    username: joi_1.default.string(),
                }, req.body);
                if (error) {
                    return next(Validator_1.default.RequestValidationError(error === null || error === void 0 ? void 0 : error.details.map((err) => err.message)));
                }
                if (yield User_1.default.findOne({
                    $or: [{ email: req.body.email }, { username: req.body.username }],
                })) {
                    return next(new ApiError_1.default('Email or Username has already been taken', HttpsResponse_1.default.HTTP_BAD_REQUEST, {
                        message: 'Try again',
                    }));
                }
                const user = yield User_1.default.findOneAndUpdate({ email: req.user.email }, {
                    $set: Object.assign({}, req.body),
                });
                if (!user) {
                    return next(new ApiError_1.default('Sorry Could not find user details', HttpsResponse_1.default.HTTP_BAD_REQUEST, {
                        message: 'Account does not exit',
                    }));
                }
                return _super.sendSuccessResponse.call(this, res, { email: user.email, _id: user._id, username: user.username }, 'Password Reset Successful', HttpsResponse_1.default.HTTP_OK);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    ListUsers(req, res, next) {
        const _super = Object.create(null, {
            sendSuccessResponse: { get: () => super.sendSuccessResponse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.default.find();
                return _super.sendSuccessResponse.call(this, res, { users }, 'Password Reset Successful', HttpsResponse_1.default.HTTP_OK);
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports.default = new UserController();
