"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const JwtAccessTokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    revoked: {
        type: Boolean,
        default: false,
    },
    expires_at: {
        type: Date,
    },
    expires_at_ms: {
        type: Number,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.default = mongoose_1.default.model('JwtAccessToken', JwtAccessTokenSchema);
