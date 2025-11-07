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
const client_1 = require("./client");
const initSeedConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    const roleCount = yield client_1.prisma.role.count();
    const userCount = yield client_1.prisma.user.count();
    const quizCount = yield client_1.prisma.quiz.count();
    const adminRole = yield client_1.prisma.role.findFirst({ where: { name: "ADMIN" } });
    const userRole = yield client_1.prisma.role.findFirst({ where: { name: "USER" } });
    // 🧩 1. Tạo user mẫu nếu chưa có
    if (userCount === 0) {
        yield client_1.prisma.user.createMany({
            data: [
                { name: "Alice", email: "alice@example.com", password: "password123", roleId: adminRole.id },
                { name: "Bob", email: "bob@example.com", password: "password123", roleId: adminRole.id },
                { name: "Charlie", email: "charlie@example.com", password: "password123", roleId: adminRole.id },
            ],
        });
        console.log("✅ Users seeded!");
    }
    // 🧩 2. Tạo quiz mẫu nếu chưa có
    if (quizCount === 0) {
        // Lấy user đầu tiên làm người tạo quiz
        const firstUser = yield client_1.prisma.user.findFirst();
        yield client_1.prisma.quiz.create({
            data: {
                title: "Quiz về Java cơ bản",
                description: "Kiểm tra kiến thức cơ bản về OOP và cú pháp Java.",
                // liên kết quiz với user
                user: {
                    connect: { id: firstUser.id },
                },
                questions: {
                    create: [
                        {
                            content: "Từ khóa nào dùng để kế thừa một lớp trong Java?",
                            answers: {
                                create: [
                                    { content: "inherit", isCorrect: false },
                                    { content: "extends", isCorrect: true },
                                    { content: "super", isCorrect: false },
                                    { content: "implements", isCorrect: false },
                                ],
                            },
                        },
                        {
                            content: "Phương thức khởi tạo trong Java là gì?",
                            answers: {
                                create: [
                                    { content: "init()", isCorrect: false },
                                    { content: "ClassName()", isCorrect: true },
                                    { content: "new()", isCorrect: false },
                                    { content: "create()", isCorrect: false },
                                ],
                            },
                        },
                    ],
                },
            },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });
        console.log("✅ Quiz + Questions + Answers seeded!");
    }
    else {
        console.log("⚠️ Data already exists, skipping seed.");
    }
    if (roleCount === 0) {
        yield client_1.prisma.role.createMany({
            data: [
                { name: "ADMIN", description: "Quản trị viên hệ thống" },
                { name: "USER", description: "Người dùng hệ thống" }
            ]
        });
    }
});
exports.default = initSeedConfig;
//# sourceMappingURL=seed.js.map