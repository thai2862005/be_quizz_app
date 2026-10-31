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
require("dotenv/config");
const client_1 = require("./client");
const runSeed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleCount = yield client_1.prisma.role.count();
        if (roleCount === 0) {
            console.log("Starting seed...");
            yield client_1.prisma.role.createMany({
                data: [
                    { name: "ADMIN", description: "Quản trị viên hệ thống" },
                    { name: "USER", description: "Người dùng hệ thống" }
                ],
            });
        }
        console.log("✅ Seed check completed!");
    }
    catch (e) {
        console.error("Seed error:", e);
    }
});
exports.default = runSeed;
//# sourceMappingURL=seed-simple.js.map