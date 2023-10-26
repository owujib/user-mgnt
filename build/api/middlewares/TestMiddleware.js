"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MiddleWare {
    verify(req, res, next) {
        return next();
    }
}
exports.default = new MiddleWare();
