"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.isUser = exports.isAdmin = void 0;
// Middleware kiểm tra quyền ADMIN
const isAdmin = (req, res, next) => {
    var _a;
    if (req.path.startsWith('/admin')) {
        const user = req.user;
        if (((_a = user === null || user === void 0 ? void 0 : user.role) === null || _a === void 0 ? void 0 : _a.name) === 'ADMIN') {
            return next();
        }
        else {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.',
            });
        }
    }
    next(); // Nếu không phải đường dẫn /admin thì cho qua
};
exports.isAdmin = isAdmin;
// Middleware kiểm tra quyền USER hoặc ADMIN
const isUser = (req, res, next) => {
    var _a, _b;
    const user = req.user;
    console.log("check user role user", user);
    if (((_a = user === null || user === void 0 ? void 0 : user.role) === null || _a === void 0 ? void 0 : _a.name) === 'USER' || ((_b = user === null || user === void 0 ? void 0 : user.role) === null || _b === void 0 ? void 0 : _b.name) === 'ADMIN') {
        return next();
    }
    else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized. User or Admin role required.',
        });
    }
};
exports.isUser = isUser;
// Middleware kiểm tra đăng nhập
const isAuthenticated = (req, res, next) => {
    const isAuthenticated = req.isAuthenticated();
    if (isAuthenticated) {
        return res.status(400).json({
            success: false,
            message: 'Already authenticated.',
        });
    }
    else {
        return next();
    }
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=role.midlewhere.js.map