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
const joi_1 = __importDefault(require("joi"));
const moment_1 = __importDefault(require("moment"));
const _1 = __importDefault(require("."));
const helpers_1 = __importDefault(require("../../helpers"));
const HttpsResponse_1 = __importDefault(require("../../helpers/HttpsResponse"));
const Validator_1 = __importDefault(require("../../helpers/Validator"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const Authmail_1 = __importDefault(require("../../mail/Authmail"));
const User_1 = __importDefault(require("../../models/User"));
const Role_1 = __importDefault(require("../../models/Role"));
const UserHasRole_1 = __importDefault(require("../../models/UserHasRole"));
const PasswordReset_1 = __importDefault(require("../../models/PasswordReset"));
class AuthController extends _1.default {
    constructor() {
        super();
    }
    Register(req, res, next) {
        const _super = Object.create(null, {
            sendSuccessResponse: { get: () => super.sendSuccessResponse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = Validator_1.default.validateBody({
                    email: joi_1.default.string().email().required(),
                    username: joi_1.default.string(),
                    password: joi_1.default.string().required().min(5).max(15),
                }, req.body);
                if (error) {
                    return next(Validator_1.default.RequestValidationError(error === null || error === void 0 ? void 0 : error.details.map((err) => err.message)));
                }
                if (yield User_1.default.findOne({
                    $or: [{ email: req.body.email }, { username: req.body.username }],
                })) {
                    return next(new ApiError_1.default('Email or Username already taken', HttpsResponse_1.default.HTTP_BAD_REQUEST, {
                        message: 'Account exists',
                    }));
                }
                const userCount = yield User_1.default.countDocuments();
                const newUserName = `${req.body.email.split('@')[0]}0${userCount}`;
                const user = new User_1.default(Object.assign(Object.assign({}, req.body), { password: helpers_1.default.hash(req.body.password, 10), username: !req.body.username ? newUserName : req.body.username }));
                const token = yield helpers_1.default.createAccessToken(user);
                //add user roles
                const role = yield Role_1.default.findOne({ name: 'user' });
                if (!role) {
                    return next(new ApiError_1.default('Server error', HttpsResponse_1.default.HTTP_BAD_GATEWAY, {
                        message: 'Please contact support: ROLE_ERROR',
                    }));
                }
                const userRole = yield UserHasRole_1.default.create({
                    user_id: user._id,
                    role_id: role._id,
                });
                yield user.save();
                new Authmail_1.default(user.email).sendWelcome({ title: 'Welcome' });
                //   await new AuthMail(user).sendWelcome({ title: 'welcome' });
                return _super.sendSuccessResponse.call(this, res, {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    access_token: token,
                }, 'Account has been created', HttpsResponse_1.default.HTTP_CREATED);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    Login(req, res, next) {
        const _super = Object.create(null, {
            sendSuccessResponse: { get: () => super.sendSuccessResponse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = Validator_1.default.validateBody({
                    identity: joi_1.default.string().required(),
                    password: joi_1.default.string().required().min(5).max(15),
                }, req.body);
                if (error) {
                    return next(Validator_1.default.RequestValidationError(error === null || error === void 0 ? void 0 : error.details.map((err) => err.message)));
                }
                const user = yield User_1.default.findOne({
                    $or: [{ email: req.body.identity }, { username: req.body.identity }],
                });
                if (!user) {
                    return next(new ApiError_1.default('Sorry Could not find user details', HttpsResponse_1.default.HTTP_BAD_REQUEST, {
                        message: 'Account does not exit',
                    }));
                }
                if (!helpers_1.default.correctPassword(req.body.password, user.password)) {
                    return next(new ApiError_1.default('Something went wrong', HttpsResponse_1.default.HTTP_BAD_REQUEST, {
                        message: 'Please check you information and try again',
                    }));
                }
                const token = yield helpers_1.default.createAccessToken(user);
                user.last_login = new Date();
                yield user.save();
                return _super.sendSuccessResponse.call(this, res, {
                    _id: user._id,
                    last_login: user.last_login,
                    username: user.username,
                    email: user.email,
                    access_token: token,
                }, 'Login successfull', HttpsResponse_1.default.HTTP_OK);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    ForgotPassword(req, res, next) {
        const _super = Object.create(null, {
            sendSuccessResponse: { get: () => super.sendSuccessResponse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ email: req.params.email });
                if (!user) {
                    return next(new ApiError_1.default('Sorry credentials not found', HttpsResponse_1.default.HTTP_NOT_FOUND, {
                        message: 'No record found',
                    }));
                }
                let minutes = (0, moment_1.default)().add(20, 'minutes');
                const date = helpers_1.default.calculateTimeZoneWithPlusOneGMT(new Date(minutes.toDate()), !req.query.tz ? 1 : Number(req.query.tz));
                const code = helpers_1.default.randomStringGenerator(5);
                const newResetToken = yield PasswordReset_1.default.create({
                    reset_token: code,
                    user_id: user._id,
                    reset_token_expires_at: date,
                    reset_token_expires_at_ms: date.getTime(),
                });
                yield new Authmail_1.default(user.email).forgotPasswordMail({
                    title: 'Forgot password Mail',
                    code,
                });
                return _super.sendSuccessResponse.call(this, res, { email: user.email }, 'Email Sent', HttpsResponse_1.default.HTTP_OK);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    ResetPassword(req, res, next) {
        const _super = Object.create(null, {
            sendSuccessResponse: { get: () => super.sendSuccessResponse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = Validator_1.default.validateBody({
                    code: joi_1.default.string().email(),
                    password: joi_1.default.string().min(5).max(15),
                }, req.body);
                if (error) {
                    return next(Validator_1.default.RequestValidationError(error === null || error === void 0 ? void 0 : error.details.map((err) => err.message)));
                }
                const resetCode = yield PasswordReset_1.default.findOne({
                    reset_token: req.body.code,
                });
                if (!resetCode) {
                    return next(new ApiError_1.default('Sorry try again', HttpsResponse_1.default.HTTP_NOT_FOUND, {
                        message: 'Code not found',
                    }));
                }
                let user = yield User_1.default.findOneAndUpdate({ _id: resetCode.user_id }, { password: helpers_1.default.hash(req.body.password, 10) });
                if (!user) {
                    return next(new ApiError_1.default('Sorry credentials not found', HttpsResponse_1.default.HTTP_NOT_FOUND, {
                        message: 'No record found',
                    }));
                }
                return _super.sendSuccessResponse.call(this, res, { email: user.email, _id: user._id, username: user.username }, 'Password Reset Successful', HttpsResponse_1.default.HTTP_OK);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    UpdatePassword(req, res, next) {
        const _super = Object.create(null, {
            sendSuccessResponse: { get: () => super.sendSuccessResponse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = Validator_1.default.validateBody({
                    new_password: joi_1.default.string().min(5).max(15),
                    current_password: joi_1.default.string().min(5).max(15),
                }, req.body);
                if (error) {
                    return next(Validator_1.default.RequestValidationError(error === null || error === void 0 ? void 0 : error.details.map((err) => err.message)));
                }
                const user = req.user;
                console.log(user);
                const isCurrentPasswordValid = helpers_1.default.correctPassword(req.body.current_password, user.password);
                if (!isCurrentPasswordValid) {
                    return next(new ApiError_1.default('Current Password is invalid', HttpsResponse_1.default.HTTP_NOT_FOUND, {
                        message: 'Try again',
                    }));
                }
                if (req.body.current_password === req.body.new_password) {
                    return next(new ApiError_1.default('Passwords can not be same', HttpsResponse_1.default.HTTP_NOT_FOUND, {
                        message: 'Try again',
                    }));
                }
                console.log(user, req.body);
                // Update the user's password in the database
                const hashedNewPassword = helpers_1.default.hash(req.body.new_password, 10);
                user.password = hashedNewPassword;
                yield user.save();
                // Respond with success
                return _super.sendSuccessResponse.call(this, res, { email: user.email, _id: user._id, username: user.username }, 'Password updated successfully', HttpsResponse_1.default.HTTP_OK);
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports.default = new AuthController();
