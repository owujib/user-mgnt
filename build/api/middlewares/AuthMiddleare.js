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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const axios_1 = require("axios");
const JwtAccessToken_1 = __importDefault(require("../../models/JwtAccessToken"));
const User_1 = __importDefault(require("../../models/User"));
const Role_1 = __importDefault(require("../../models/Role"));
const UserHasRole_1 = __importDefault(require("../../models/UserHasRole"));
const HandleAsync_1 = __importDefault(require("../../utils/HandleAsync"));
dotenv_1.default.config({ path: path_1.default.resolve('../../.env') });
class AuthMiddleware {
    VerifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1) Getting token and check of it's there
                let token;
                if (req.headers.authorization &&
                    req.headers.authorization.startsWith('Bearer')) {
                    token = req.headers.authorization.split(' ')[1];
                }
                // check is token is present in header
                if (!token) {
                    return next(new ApiError_1.default('You do not an cctive session', axios_1.HttpStatusCode.Unauthorized, { message: 'Please login' }));
                }
                // check for token
                const jwtToken = yield JwtAccessToken_1.default.findOne({
                    token,
                    revoked: false,
                });
                if (!jwtToken) {
                    return next(new ApiError_1.default('Unauthorized access', axios_1.HttpStatusCode.Unauthorized, {
                        message: 'Unauthorized Access Please log in',
                    }));
                }
                const expiredAt = (0, moment_1.default)(jwtToken.expires_at);
                const currentDate = (0, moment_1.default)(Date.now());
                if (currentDate.isAfter(expiredAt)) {
                    yield JwtAccessToken_1.default.updateOne({ token: jwtToken.token }, {
                        revoked: true,
                    });
                    return next(new ApiError_1.default('session has expired please log in again', axios_1.HttpStatusCode.Unauthorized, {
                        message: 'Session has expired',
                    }));
                }
                // 2) docode token
                const decoded = jsonwebtoken_1.default.verify(token, process.env.APP_KEY);
                // 2) Verification token
                const user = yield User_1.default.findById(decoded.id);
                // check if user exists
                if (!user) {
                    return next(new ApiError_1.default('data invalid as user does not exist', axios_1.HttpStatusCode.Unauthorized, { message: 'User could not be found' }));
                }
                req.user = user;
                return next();
            }
            catch (error) {
                return next(error);
            }
        });
    }
    ProtectRouteFor(role) {
        return (0, HandleAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const roleValue = yield Role_1.default.findOne({ name: role });
            const userRoles = yield UserHasRole_1.default.findOne({
                user_id: req.user._id,
                role_id: roleValue === null || roleValue === void 0 ? void 0 : roleValue._id,
            });
            if (!userRoles) {
                return next(new ApiError_1.default('You do not have permission to perform this action', axios_1.HttpStatusCode.Forbidden, {
                    message: 'You do not have access to this resource',
                }));
            }
            return next();
        }));
    }
    RestrictTo(role) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, HandleAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                const roleValue = yield Role_1.default.findOne({ name: role });
                const userRoles = yield UserHasRole_1.default.findOne({
                    user_id: req.user._id,
                    role_id: roleValue === null || roleValue === void 0 ? void 0 : roleValue._id,
                });
                if (userRoles) {
                    return next(new ApiError_1.default('You do not have permission to perform this action', axios_1.HttpStatusCode.Forbidden, {
                        message: 'You do not have access to this resource',
                    }));
                }
                return next();
            }));
        });
    }
}
exports.default = new AuthMiddleware();
