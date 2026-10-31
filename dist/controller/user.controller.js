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
exports.getAllUserTop7to10ScoreApi = exports.getALLUsersTopScoreApi = exports.getALLUsersApi = exports.GetUserByIdApi = exports.UpdateUserApi = exports.DeleteUserApi = exports.CreateUserApi = void 0;
const client_1 = require("@prisma/client");
const user_service_1 = require("../service/user.service");
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const parsePositiveId = (value) => {
    if (!/^[1-9]\d*$/.test(value)) {
        return null;
    }
    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
};
const isNotFoundError = (error) => error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === "P2025";
const toPublicUser = ({ id, name, email }) => ({ id, name, email });
const CreateUserApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (typeof name !== "string" ||
        name.trim().length === 0 ||
        typeof email !== "string" ||
        !isValidEmail(email) ||
        typeof password !== "string" ||
        password.length === 0) {
        res.status(400).json({
            code: "INVALID_USER",
            message: "Name, valid email, and password are required",
        });
        return;
    }
    try {
        const user = yield (0, user_service_1.createUser)(name.trim(), email.trim(), password);
        res.status(201).json({
            user: toPublicUser(user),
            message: "User created successfully",
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({
                code: "EMAIL_ALREADY_REGISTERED",
                message: "Email is already registered",
            });
            return;
        }
        console.error("Failed to create user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.CreateUserApi = CreateUserApi;
const DeleteUserApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parsePositiveId(req.params.id);
    if (id === null) {
        res.status(400).json({ code: "INVALID_USER_ID", message: "User ID must be a positive integer" });
        return;
    }
    try {
        const user = yield (0, user_service_1.deleteUser)(id);
        res.status(200).json({ user: toPublicUser(user), message: "User deleted successfully" });
    }
    catch (error) {
        if (isNotFoundError(error)) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        console.error(`Failed to delete user ${id}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.DeleteUserApi = DeleteUserApi;
const UpdateUserApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = parsePositiveId(req.params.id);
    const { name, email, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (id === null) {
        res.status(400).json({ code: "INVALID_USER_ID", message: "User ID must be a positive integer" });
        return;
    }
    if (typeof name !== "string" ||
        name.trim().length === 0 ||
        typeof email !== "string" ||
        !isValidEmail(email) ||
        typeof password !== "string" ||
        password.length === 0) {
        res.status(400).json({
            code: "INVALID_USER",
            message: "Name, valid email, and password are required",
        });
        return;
    }
    try {
        const user = yield (0, user_service_1.updateUser)(id, name.trim(), email.trim(), password);
        res.status(200).json({ user: toPublicUser(user), message: "User updated successfully" });
    }
    catch (error) {
        if (isNotFoundError(error)) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({
                code: "EMAIL_ALREADY_REGISTERED",
                message: "Email is already registered",
            });
            return;
        }
        console.error(`Failed to update user ${id}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.UpdateUserApi = UpdateUserApi;
const GetUserByIdApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parsePositiveId(req.params.id);
    if (id === null) {
        res.status(400).json({ code: "INVALID_USER_ID", message: "User ID must be a positive integer" });
        return;
    }
    try {
        const user = yield (0, user_service_1.getUserById)(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user: toPublicUser(user), message: "User retrieved successfully" });
    }
    catch (error) {
        console.error(`Failed to retrieve user ${id}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.GetUserByIdApi = GetUserByIdApi;
const getALLUsersApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page } = req.query;
    if (page !== undefined &&
        (typeof page !== "string" || !/^[1-9]\d*$/.test(page) || !Number.isSafeInteger(Number(page)))) {
        res.status(400).json({ code: "INVALID_PAGE", message: "Page must be a positive integer" });
        return;
    }
    const currentPage = page === undefined ? 1 : Number(page);
    try {
        const countTotalUser = yield (0, user_service_1.countTotalUsers)();
        const users = yield (0, user_service_1.getALLUsers)(currentPage);
        res.status(200).json({
            users: users.map(({ id, name, email, results }) => ({ id, name, email, results })),
            countTotalUser,
            currentPage,
            message: "get All users successfully",
        });
    }
    catch (error) {
        console.error("Failed to retrieve users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getALLUsersApi = getALLUsersApi;
const getALLUsersTopScoreApi = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_service_1.getAllUserTopScore)();
        res.status(200).json({ users, message: "get All users top score successfully" });
    }
    catch (error) {
        console.error("Failed to retrieve top scores:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getALLUsersTopScoreApi = getALLUsersTopScoreApi;
const getAllUserTop7to10ScoreApi = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_service_1.getAllUserTop7to10)();
        res.status(200).json({
            users,
            message: "get All user top 7 to 10 score successfully",
        });
    }
    catch (error) {
        console.error("Failed to retrieve users ranked 4 to 10:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllUserTop7to10ScoreApi = getAllUserTop7to10ScoreApi;
//# sourceMappingURL=user.controller.js.map