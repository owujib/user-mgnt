"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const HttpsResponse_1 = __importDefault(require("./helpers/HttpsResponse"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const FileHandler_1 = require("./decorators/FileHandler");
const helpers_1 = __importDefault(require("./helpers"));
const logger_1 = __importStar(require("./config/logger"));
const database_1 = __importDefault(require("./config/database"));
process.env.TZ = 'Africa/Lagos';
class Kernel {
    constructor() {
        this.app = (0, express_1.default)();
        this.middlewares();
        this.webhooks();
        this.routes();
        this.errorHandler();
        this.databaseConnection();
    }
    middlewares() {
        this.app.set('views', path_1.default.join(__dirname, '../views'));
        this.app.set('view engine', 'ejs');
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.set('PORT', process.env.PORT || 5500);
        this.app.set('NODE_ENV', process.env.NODE_ENV);
        this.app.use((0, morgan_1.default)('combined', { stream: logger_1.default.stream }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
    }
    webhooks() { }
    routes() {
        this.app.use('/api/auth', auth_routes_1.default);
        this.app.use('/api/user', user_routes_1.default);
        this.app.get('/home', (req, res, next) => res.status(200).json({
            nessage: 'hello',
        }));
        /**example of file upload */
        this.app.post('/upload', (0, FileHandler_1.uploadHelper)({
            fields: [{ name: 'image', maxCount: 1 }],
            validationFunction: helpers_1.default.requestFileValidation([
                'image/jpeg',
                'image/png',
            ]),
            limit: null,
        }), (req, res, next) => {
            return res
                .status(200)
                .json({ files: req.files.image[0], file: req.file });
        });
    }
    errorHandler() {
        /**404 routes */
        this.app.all('*', (req, res, next) => {
            return next(new ApiError_1.default('Route not found', HttpsResponse_1.default.HTTP_NOT_FOUND, {
                message: 'The route you are looking for has been moved or does not exist',
            }));
        });
        /**global error handler */
        this.app.use((err, req, res, next) => {
            err.statusCode =
                err.statusCode || HttpsResponse_1.default.HTTP_INTERNAL_SERVER_ERROR;
            err.status = err.status || 'error';
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                error: err.error,
            });
        });
    }
    databaseConnection() {
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield (0, database_1.default)();
                    logger_1.Logger.info('Database connection is successful');
                }
                catch (error) {
                    logger_1.Logger.error('Database connection error: ', error);
                }
            });
        })();
    }
}
exports.default = new Kernel().app;
