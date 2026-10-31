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
const jwt_midlewhere_1 = require("../midlewhere/jwt.midlewhere");
const router = express_1.default.Router();
const webRouter = (app) => {
    router.get("/", (req, res) => {
        res.send("Hello World!");
    });
    //quizzes
    router.get("/quizzes", quizz_controller_1.getALLQuizzesApi);
    router.get("/quizzes/:id/package", quizz_controller_1.getQuizPackageApi);
    router.get("/quizzes/:id", quizz_controller_1.getQuizzByIdApi);
    //users
    router.get("/users", jwt_midlewhere_1.checkJwt, user_controller_1.getALLUsersApi);
    router.post("/users", user_controller_1.CreateUserApi);
    router.delete("/users/:id", user_controller_1.DeleteUserApi);
    router.put("/users/:id", user_controller_1.UpdateUserApi);
    router.get("/users/:id", jwt_midlewhere_1.checkJwt, user_controller_1.GetUserByIdApi);
    //result  
    router.post("/Your-results", jwt_midlewhere_1.checkJwt, result_controller_1.saveQuizResultAPi);
    router.post("/results", jwt_midlewhere_1.checkJwt, result_controller_1.saveQuizResultByIdApi);
    router.get("/results/:id", jwt_midlewhere_1.checkJwt, result_controller_1.getQuizResultsApi);
    router.get("/results", jwt_midlewhere_1.checkJwt, result_controller_1.getQuizResultsApi);
    //top score users
    router.get("/top-scores", user_controller_1.getALLUsersTopScoreApi);
    //login 
    router.post("/login", auth_controller_1.LoginApi);
    //top 7 to 10 users
    router.get("/top-7-10-scores", user_controller_1.getAllUserTop7to10ScoreApi);
    //register
    router.post("/register", auth_controller_1.registerUserApi);
    //account
    router.get("/account", jwt_midlewhere_1.checkJwt, auth_controller_1.fetchAccountAPi);
    app.use("/api", router);
};
exports.default = webRouter;
//# sourceMappingURL=api.js.map