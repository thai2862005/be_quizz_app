"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const quizz_controller_1 = require("../controller/quizz.controller");
const result_controller_1 = require("../controller/result.controller");
const auth_controller_1 = require("../controller/auth.controller");
const router = express_1.default.Router();
const webRouter = (app) => {
    router.get("/", (req, res) => {
        res.send("Hello World!");
    });
    //quizzes
    router.get("/quizzes", quizz_controller_1.getALLQuizzesApi);
    router.get("/quizzes/:id", quizz_controller_1.getQuizzByIdApi);
    //users
    router.get("/users", user_controller_1.getALLUsersApi);
    router.post("/users", user_controller_1.CreateUserApi);
    router.delete("/users/:id", user_controller_1.DeleteUserApi);
    router.put("/users/:id", user_controller_1.UpdateUserApi);
    router.get("/users/:id", user_controller_1.GetUserByIdApi);
    //result  
    router.post("/results", result_controller_1.saveQuizResultAPi);
    router.get("/results/:userId", result_controller_1.getQuizResultsApi);
    //top score users
    router.get("/top-scores", user_controller_1.getALLUsersTopScoreApi);
    //login 
    router.post("/login", auth_controller_1.LoginApi);
    app.use("/api", router);
};
exports.default = webRouter;
//# sourceMappingURL=api.js.map