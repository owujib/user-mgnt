"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../api/controllers/AuthController"));
const AuthMiddleare_1 = __importDefault(require("../api/middlewares/AuthMiddleare"));
const router = (0, express_1.Router)();
router.post('/register', AuthController_1.default.Register);
router.post('/login', AuthController_1.default.Login);
router.post('/forgot-password/:email', AuthController_1.default.ForgotPassword);
router.post('/reset-password', AuthController_1.default.ResetPassword);
router.post('/update-password', AuthMiddleare_1.default.VerifyToken, AuthController_1.default.UpdatePassword);
exports.default = router;
