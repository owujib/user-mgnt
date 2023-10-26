"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Role_1 = __importDefault(require("./Role"));
const User_1 = __importDefault(require("./User"));
const RoleSchema = new mongoose_1.default.Schema({
    role_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: Role_1.default,
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: User_1.default,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.default = mongoose_1.default.model('UserHasRole', RoleSchema);
