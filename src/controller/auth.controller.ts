import { Request, Response } from "express";
import { handleLogin } from "../service/auth.service";
const LoginApi = async (req:Request, res:Response) => {
    const {email, password} = req.body;
    try {
        const access_token = await handleLogin(email, password);
        res.status(200).json({access_token, message:"Login successful"});
    } catch (error) {
        res.status(401).json({message:"Login failed",error: error.message});
    }
}
export {LoginApi}    