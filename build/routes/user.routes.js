"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleare_1 = __importDefault(require("../api/middlewares/AuthMiddleare"));
const UserController_1 = __importDefault(require("../api/controllers/UserController"));
const router = (0, express_1.Router)();
router.post('/update', AuthMiddleare_1.default.VerifyToken, UserController_1.default.UpdateUserProfile);
router.get('/list-users', AuthMiddleare_1.default.VerifyToken, AuthMiddleare_1.default.ProtectRouteFor('admin'), UserController_1.default.ListUsers);
exports.default = router;
