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
exports.getAllUserTop7to10 = exports.getAllUserTopScore = exports.countTotalUsers = exports.getALLUsers = exports.getUserById = exports.updateUser = exports.deleteUser = exports.createUser = void 0;
const client_1 = require("../config/client");
const constant_1 = require("../config/constant");
//create user
const createUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.create({
        data: {
            name,
            email,
            password
        }
    });
    return user;
});
exports.createUser = createUser;
//delete user
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.delete({
        where: { id: +id }
    });
    return user;
});
exports.deleteUser = deleteUser;
//update user
const updateUser = (id, name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.update({
        where: { id: +id },
        data: {
            name,
            email,
            password
        }
    });
    return user;
});
exports.updateUser = updateUser;
//get user by id
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({
        where: { id: +id }
    });
    return user;
});
exports.getUserById = getUserById;
//count total users for pagination
const countTotalUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const pagesize = constant_1.TOTAL_ITEMS_PER_PAGE;
    const totalUsers = yield client_1.prisma.user.count();
    const totalPages = Math.ceil(totalUsers / pagesize);
    return totalPages;
});
exports.countTotalUsers = countTotalUsers;
//get all users with pagination
const getALLUsers = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const pagesize = constant_1.TOTAL_ITEMS_PER_PAGE;
    const skip = (page - 1) * pagesize;
    const users = yield client_1.prisma.user.findMany({
        skip,
        take: 3,
        include: {
            results: {
                orderBy: {
                    score: "desc"
                }
            }
        }
    });
    return users;
});
exports.getALLUsers = getALLUsers;
const getAllUserTopScore = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield client_1.prisma.user.findMany({
        take: 3,
        include: {
            results: {
                orderBy: {
                    score: "desc"
                }
            }
        }
    });
    return users;
});
exports.getAllUserTopScore = getAllUserTopScore;
const getAllUserTop7to10 = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield client_1.prisma.user.findMany({
        skip: 3,
        take: 7,
        include: {
            results: {
                orderBy: {
                    score: "desc"
                }
            }
        }
    });
    return users;
});
exports.getAllUserTop7to10 = getAllUserTop7to10;
//# sourceMappingURL=user.service.js.map