import express from 'express';
import { Express } from 'express';
import { CreateUserApi, DeleteUserApi, getALLUsersApi, getALLUsersTopScoreApi, getAllUserTop7to10ScoreApi, GetUserByIdApi, UpdateUserApi } from '../controller/user.controller';
import { getALLQuizzesApi, getQuizzByIdApi } from '../controller/quizz.controller';
import { getQuizResultsApi, saveQuizResultAPi, saveQuizResultByIdApi } from '../controller/result.controller';
import { fetchAccountAPi, LoginApi, registerUserApi } from '../controller/auth.controller';
import { checkJwt } from '../midlewhere/jwt.midlewhere';
const router = express.Router();
const webRouter =(app:Express) => {
  router.get("/", (req, res) => {
    res.send("Hello World!");
  });

//quizzes
router.get("/quizzes", getALLQuizzesApi);
router.get("/quizzes/:id", getQuizzByIdApi);
//users
router.get("/users",checkJwt, getALLUsersApi);
router.post("/users", CreateUserApi);
router.delete("/users/:id", DeleteUserApi);
router.put("/users/:id", UpdateUserApi);
router.get("/users/:id",checkJwt, GetUserByIdApi);
//result  
router.post("/Your-results",checkJwt,saveQuizResultAPi);
router.post("/results",checkJwt,saveQuizResultByIdApi);
router.get("/results/:id",checkJwt,getQuizResultsApi);
router.get("/results",checkJwt,getQuizResultsApi)
//top score users
router.get("/top-scores",getALLUsersTopScoreApi)
//login 
router.post("/login",LoginApi);
//top 7 to 10 users
router.get("/top-7-10-scores  ",getAllUserTop7to10ScoreApi);
//register
router.post("/register",registerUserApi);
//account
router.get("/account",checkJwt,fetchAccountAPi);
    app.use("/api",router);

};


export default webRouter;