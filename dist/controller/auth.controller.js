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
exports.LoginApi = void 0;
const auth_service_1 = require("../service/auth.service");
const LoginApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const access_token = yield (0, auth_service_1.handleLogin)(email, password);
        res.status(200).json({ access_token, message: "Login successful" });
    }
    catch (error) {
        res.status(401).json({ message: "Login failed", error: error.message });
    }
});
exports.LoginApi = LoginApi;
//# sourceMappingURL=auth.controller.js.map