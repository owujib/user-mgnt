"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./User"));
const PasswordResetSchema = new mongoose_1.default.Schema({
    reset_token: {
        type: String,
        unique: true,
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: User_1.default,
    },
    reset_token_expires_at: {
        type: Date,
    },
    reset_token_expires_at_ms: {
        type: Number,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.default = mongoose_1.default.model('PasswordReset', PasswordResetSchema);
