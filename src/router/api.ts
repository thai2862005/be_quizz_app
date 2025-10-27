import express from 'express';
import { Express } from 'express';
import { CreateUserApi, DeleteUserApi, getALLUsersApi, GetUserByIdApi, UpdateUserApi } from '../controller/user.controller';
import { getALLQuizzesApi } from '../controller/quizz.controller';
const router = express.Router();
const webRouter =(app:Express) => {
  router.get("/", (req, res) => {
    res.send("Hello World!");
  });

//quizzes
router.get("/quizzes", getALLQuizzesApi);
//users
router.get("/users", getALLUsersApi);
router.post("/users", CreateUserApi);
router.delete("/users/:id", DeleteUserApi);
router.put("/users/:id", UpdateUserApi);
router.get("/users/:id", GetUserByIdApi);
    app.use("/api", router);

};


export default webRouter;