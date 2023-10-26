"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const path = require('path');
exports.default = () => {
    return mongoose_1.default.connect(process.env.NODE_ENV === 'production'
        ? process.env.DB_PROD_URL
        : process.env.DB_URL);
};
