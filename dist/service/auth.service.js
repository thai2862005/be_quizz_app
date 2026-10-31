"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.handleLogin = void 0;
const client_1 = require("../config/client");
const jwt = __importStar(require("jsonwebtoken"));
const handleLogin = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({
        where: { email: username },
        include: { role: true },
    });
    if (!user || user.password !== password) {
        return null;
    }
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error("JWT_SECRET is not configured");
    }
    const expiresIn = (process.env.JWT_EXPIRES_IN || "1h");
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        role: user.role,
    };
    const access_token = jwt.sign(payload, secretKey, {
        expiresIn,
    });
    return access_token;
});
exports.handleLogin = handleLogin;
const registerUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userRole = yield client_1.prisma.role.findUnique({
        where: { name: "USER" },
    });
    if (userRole) {
        const newUser = yield client_1.prisma.user.create({
            data: {
                name,
                email,
                password,
                roleId: userRole.id,
            },
        });
        return newUser;
    }
    throw new Error("USER role not found");
});
exports.registerUser = registerUser;
//# sourceMappingURL=auth.service.js.map