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
exports.getALLUsersTopScoreApi = exports.getALLUsersApi = exports.GetUserByIdApi = exports.UpdateUserApi = exports.DeleteUserApi = exports.CreateUserApi = void 0;
const user_service_1 = require("../service/user.service");
//create user
const CreateUserApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Logic to create a new user
    const { name, email, password } = req.body;
    const user = yield (0, user_service_1.createUser)(name, email, password);
    res.status(201).json({ user, message: "User created successfully" });
});
exports.CreateUserApi = CreateUserApi;
//delete user
const DeleteUserApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Logic to delete a user
    const { id } = req.params;
    const user = yield (0, user_service_1.deleteUser)(+id);
    res.status(200).json({ user, message: "User deleted successfully" });
});
exports.DeleteUserApi = DeleteUserApi;
//update user
const UpdateUserApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Logic to update a user
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = yield (0, user_service_1.updateUser)(+id, name, email, password);
    res.status(200).json({ user, message: "User updated successfully" });
});
exports.UpdateUserApi = UpdateUserApi;
//get user by id
const GetUserByIdApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Logic to get a user by ID
    const { id } = req.params;
    const user = yield (0, user_service_1.getUserById)(+id);
    res.status(200).json({ user, message: "User retrieved successfully" });
});
exports.GetUserByIdApi = GetUserByIdApi;
//get all users with pagination
const getALLUsersApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page } = req.query;
    let currentPage = page ? +page : 1;
    if (currentPage <= 0)
        currentPage = 1;
    const countTotalUser = yield (0, user_service_1.countTotalUsers)();
    const users = yield (0, user_service_1.getALLUsers)(+currentPage);
    console.log("Users found:", users.length);
    res.status(200).json({
        users,
        countTotalUser,
        currentPage,
        message: "get All users successfully"
    });
});
exports.getALLUsersApi = getALLUsersApi;
const getALLUsersTopScoreApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, user_service_1.getAllUserTopScore)();
    console.log("Users found:", users.length);
    res.status(200).json({
        users,
        message: "get All users top score successfully"
    });
});
exports.getALLUsersTopScoreApi = getALLUsersTopScoreApi;
//# sourceMappingURL=user.controller.js.map