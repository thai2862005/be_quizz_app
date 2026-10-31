"use strict";
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
exports.fetchAccountAPi = exports.registerUserApi = exports.LoginApi = void 0;
const auth_service_1 = require("../service/auth.service");
const client_1 = require("@prisma/client");
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isUniqueConstraintError = (error) => error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === "P2002";
const LoginApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (typeof email !== "string" || !isValidEmail(email) ||
        typeof password !== "string" || password.length === 0) {
        res.status(400).json({ code: "INVALID_CREDENTIALS", message: "A valid email and password are required" });
        return;
    }
    try {
        const access_token = yield (0, auth_service_1.handleLogin)(email, password);
        if (!access_token) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        res.status(200).json({ access_token, message: "Login successful" });
    }
    catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.LoginApi = LoginApi;
const registerUserApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, password, confirmPassword } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (typeof name !== "string" || name.trim().length === 0 ||
        typeof email !== "string" || !isValidEmail(email) ||
        typeof password !== "string" || password.length === 0 ||
        typeof confirmPassword !== "string" || confirmPassword.length === 0) {
        res.status(400).json({ code: "INVALID_REGISTRATION", message: "Name, valid email, password, and confirmation are required" });
        return;
    }
    if (password !== confirmPassword) {
        res.status(400).json({ code: "PASSWORD_MISMATCH", message: "Passwords do not match" });
        return;
    }
    try {
        const newUser = yield (0, auth_service_1.registerUser)(name.trim(), email.trim(), password);
        res.status(201).json({
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            message: "User registered successfully",
        });
    }
    catch (error) {
        if (isUniqueConstraintError(error)) {
            res.status(409).json({ code: "EMAIL_ALREADY_REGISTERED", message: "Email is already registered" });
            return;
        }
        console.error("User registration failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.registerUserApi = registerUserApi;
const fetchAccountAPi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        res.status(200).json({
            user,
            message: "Fetch account successful"
        });
    }
    catch (error) {
        console.error("Fetch account failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.fetchAccountAPi = fetchAccountAPi;
//# sourceMappingURL=auth.controller.js.map