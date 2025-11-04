import { PrismaClient } from '@prisma/client';
import express, { Express } from 'express';
import { createUser, deleteUser, updateUser, getUserById, getALLUsers, countTotalUsers, getAllUserTopScore} from '../service/user.service';
import { Request, Response } from 'express';
//create user
const CreateUserApi = async(req:Request, res:Response) => {
  // Logic to create a new user
  const { name, email, password } = req.body;
    const user = await createUser(name, email, password);
    res.status(201).json({ user, message: "User created successfully"});
}
//delete user
const DeleteUserApi = async  (req:Request, res:Response) => {
  // Logic to delete a user
    const { id } = req.params;
    const user = await deleteUser(+id);
    res.status(200).json({ user, message:"User deleted successfully" });
}
//update user
const UpdateUserApi =async (req:Request, res:Response) => {

    // Logic to update a user
  const { id } = req.params;
  const { name, email, password } = req.body;
    const user = await updateUser(+id, name, email, password);
    res.status(200).json({ user, message:"User updated successfully"});
}
//get user by id
const GetUserByIdApi = async(req:Request, res:Response) => {
  // Logic to get a user by ID
  const { id } = req.params;
  const user = await getUserById(+id);
  res.status(200).json({ user, message: "User retrieved successfully"});
}
//get all users with pagination
const getALLUsersApi = async (req: Request, res: Response) => {
    const { page } = req.query;
    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;

    const countTotalUser = await countTotalUsers();
    const users = await getALLUsers(+currentPage);
    console.log("Users found:", users.length);

    res.status(200).json({ 
        users,
        countTotalUser,
        currentPage,
        message: "get All users successfully"
    });
}

const getALLUsersTopScoreApi = async (req: Request, res: Response) => {

    const users = await getAllUserTopScore();
    console.log("Users found:", users.length);

    res.status(200).json({ 
        users,
        message: "get All users top score successfully"
    });
}
export { CreateUserApi, DeleteUserApi, UpdateUserApi, GetUserByIdApi, getALLUsersApi,getALLUsersTopScoreApi };
