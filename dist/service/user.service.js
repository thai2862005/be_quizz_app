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
        take: pagesize,
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
// Lấy Top 3 user theo điểm cao nhất
const getAllUserTopScore = () => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Group theo tổng sum
    const grouped = yield client_1.prisma.result.groupBy({
        by: ["userId"],
        _sum: { sum: true },
        orderBy: { _sum: { sum: "desc" } },
    });
    console.log("DEBUG: grouped length =", grouped.length);
    console.log("DEBUG: grouped sample (top 5) =", grouped.slice(0, 5));
    // 2) Nếu DB chưa có result nào → fallback: lấy 3 user đầu tiên
    if (!grouped || grouped.length === 0) {
        console.log("DEBUG: No results yet → fallback users.");
        const fallback = yield client_1.prisma.user.findMany({
            orderBy: { id: "asc" },
            take: 3,
            select: {
                id: true,
                name: true,
                email: true,
                results: { take: 0 },
            },
        });
        return fallback.map((u) => (Object.assign(Object.assign({}, u), { results: [] })));
    }
    // 3) Lấy top1..3 = index 0..2
    const top3 = grouped.slice(0, 3);
    console.log("DEBUG: grouped top3 =", top3);
    // 4) Lấy thông tin user + result cao nhất của từng user
    const users = yield Promise.all(top3.map((g) => __awaiter(void 0, void 0, void 0, function* () {
        return client_1.prisma.user.findUnique({
            where: { id: g.userId },
            select: {
                id: true,
                name: true,
                email: true,
                results: {
                    orderBy: { sum: "desc" },
                    take: 1,
                    select: {
                        id: true,
                        score: true,
                        sum: true,
                        userId: true,
                        quizId: true,
                    },
                },
            },
        });
    })));
    const filtered = users.filter(Boolean); // bỏ null
    // 5) Nếu không đủ 3 user (ví dụ chỉ có 1–2 người có result)
    if (filtered.length < 3) {
        const collectedIds = top3.map((t) => t.userId);
        const remaining = 3 - filtered.length;
        const extras = yield client_1.prisma.user.findMany({
            where: { id: { notIn: collectedIds } },
            orderBy: { id: "asc" },
            take: remaining,
            select: {
                id: true,
                name: true,
                email: true,
                results: { take: 0 },
            },
        });
        return [...filtered, ...extras.map((u) => (Object.assign(Object.assign({}, u), { results: [] })))];
    }
    // 6) Trả về đủ 3 user
    return filtered;
});
exports.getAllUserTopScore = getAllUserTopScore;
// Lấy Top 4 → 10 user theo điểm cao nhất
const getAllUserTop7to10 = () => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Lấy grouped theo tổng sum, sắp xếp giảm dần
    const grouped = yield client_1.prisma.result.groupBy({
        by: ["userId"],
        _sum: { sum: true },
        orderBy: { _sum: { sum: "desc" } },
    });
    if (!grouped || grouped.length === 0)
        return [];
    // 2) Xác định top 3 userId
    const top3UserIds = grouped.slice(0, 3).map(g => g.userId);
    // 3) Lấy top 4..10 bằng slice (loại bỏ top3)
    const sliced = grouped.slice(3, 10);
    // 4) Lấy thông tin user tương ứng
    const usersFromGrouped = yield Promise.all(sliced.map((g) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield client_1.prisma.user.findUnique({
            where: { id: g.userId },
            select: {
                id: true,
                name: true,
                email: true,
                results: {
                    orderBy: { score: "desc" },
                    take: 1,
                    select: { id: true, score: true, sum: true, userId: true, quizId: true },
                },
            },
        });
        return user;
    })));
    const collected = usersFromGrouped.filter(Boolean);
    // 5) Nếu chưa đủ 7 user, bổ sung user không nằm trong top3 và top4..10
    if (collected.length < 7) {
        const collectedUserIds = collected.map(u => u.id);
        const remaining = 7 - collected.length;
        const extras = yield client_1.prisma.user.findMany({
            where: { id: { notIn: [...top3UserIds, ...collectedUserIds] } },
            orderBy: { id: "asc" },
            take: remaining,
            select: { id: true, name: true, email: true, results: { take: 0 } },
        });
        return [...collected, ...extras.map(u => (Object.assign(Object.assign({}, u), { results: [] })))];
    }
    return collected;
});
exports.getAllUserTop7to10 = getAllUserTop7to10;
//# sourceMappingURL=user.service.js.map