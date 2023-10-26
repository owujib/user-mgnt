"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, 'username is a required field'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'emails is a required field'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is a required field'],
        min: 5,
        max: 15,
    },
    last_login: {
        type: Date,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.default = mongoose_1.default.model('User', UserSchema);
