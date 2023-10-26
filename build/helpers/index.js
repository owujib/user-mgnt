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
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const HttpsResponse_1 = __importDefault(require("./HttpsResponse"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const JwtAccessToken_1 = __importDefault(require("../models/JwtAccessToken"));
class Helper {
    static signToken(payload) {
        const token = jsonwebtoken_1.default.sign(payload, process.env.APP_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return { token };
    }
    static veifyToken(payload) {
        const token = jsonwebtoken_1.default.verify(payload, process.env.APP_KEY);
        return { token };
    }
    static hash(value, saltValue) {
        return bcryptjs_1.default.hashSync(value, saltValue);
    }
    static correctPassword(inputPassword, userPassword) {
        return bcryptjs_1.default.compareSync(inputPassword, userPassword);
    }
    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    static getPublicId(imageURL) {
        const [, publicIdWithExtensionName] = imageURL.split('upload/');
        const extensionName = path_1.default.extname(publicIdWithExtensionName);
        const publicId = publicIdWithExtensionName
            .replace(extensionName, '')
            .split('/')
            .slice(1)
            .join('/');
        return publicId;
    }
    static createAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = Helper.signToken({
                    id: user._id,
                    email: user.email,
                });
                const date = Helper.addDays(new Date(), 2);
                const jwtToken = yield JwtAccessToken_1.default.create({
                    token,
                    user_id: user._id,
                    revoked: false,
                    expires_at: date,
                    expires_at_ms: date.getTime(),
                });
                return jwtToken === null || jwtToken === void 0 ? void 0 : jwtToken.token;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * @description one byte = 1000000
     * to convert to megabyte times by byte
     * to convert to gigabyte time by 1e9
     */
    static convertToBytes(value) {
        const BYTES = 1000000;
        return value * BYTES;
    }
    static generateUniqueFilename(filename) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        return `${filename.split('.')[0]}-${uniqueSuffix}${path_1.default.extname(filename)}`;
    }
    /**
     * ```markdown
     * `supportedFiles = ['image/jpeg', 'image/png', 'application/pdf'];`
     *
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
     * ```
     */
    static requestFileValidation(supportedFiles) {
        return (_, file, callback) => {
            if (supportedFiles.includes(file.mimetype)) {
                return callback(null, true);
            }
            else {
                return callback(new ApiError_1.default('Unsupported file format', HttpsResponse_1.default.HTTP_BAD_REQUEST, {}));
            }
        };
    }
    static calculateTimeZoneWithPlusOneGMT(date, timeZone) {
        // Get the current time in GMT
        const gmtTime = date.toUTCString();
        // Create a new Date object with the GMT time and add 1 hour
        const plusOneGMTTime = new Date(gmtTime);
        plusOneGMTTime.setHours(plusOneGMTTime.getHours() + timeZone);
        // Return the new Date object
        return plusOneGMTTime;
    }
    static randomStringGenerator(length) {
        let result = '';
        const Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const CharactersLength = Characters.length;
        // NOTE: Max Length Allowed Is 500...
        if (length >= 500) {
            length = 500;
        }
        // Shuffle The Characters String According To The Passed In The Length...
        for (let i = 0; i < length; i++) {
            result += Characters.charAt(Math.floor(Math.random() * CharactersLength));
        }
        // Return The Generated String...
        return result;
    }
}
exports.default = Helper;
