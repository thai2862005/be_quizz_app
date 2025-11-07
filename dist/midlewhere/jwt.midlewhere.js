"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkJwt = (req, res, next) => {
    const path = req.path;
    const whitelist = ["/login"];
    const isWhitelist = whitelist.some((i) => path.startsWith(i));
    if (isWhitelist) {
        return next();
    }
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(";");
    if (!token) {
        return res.status(401).json({ message: "no token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.user = {
            id: decoded.id,
            fullname: decoded.fullname,
            username: decoded.username,
            roleId: decoded.roleId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            data: null,
            message: "Token không hợp lệ (Cần truyền lên Token)",
        });
    }
};
exports.checkJwt = checkJwt;
//# sourceMappingURL=jwt.midlewhere.js.map