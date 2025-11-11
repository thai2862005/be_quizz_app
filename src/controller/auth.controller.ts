import { Request, Response } from "express";
import { handleLogin, registerUser } from "../service/auth.service";
const LoginApi = async (req:Request, res:Response) => {
    const {email, password} = req.body;
    try {
        const access_token = await handleLogin(email, password);
        res.status(200).json({access_token, message:"Login successful"});
    } catch (error) {
        res.status(401).json({message:"Login failed",error: error.message});
    }
}

const registerUserApi = async (req:Request, res:Response) => {
    const {name, email, password} = req.body;
    try {
        const newUser = await registerUser(name, email, password);
        res.status(201).json({ user: newUser, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "User registration failed", error: error.message });
    }
}
export {LoginApi, registerUserApi}    