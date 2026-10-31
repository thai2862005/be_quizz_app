import { Request, Response } from "express";
import { handleLogin, registerUser } from "../service/auth.service";
import { Prisma } from "@prisma/client";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isUniqueConstraintError = (error: unknown) =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

const LoginApi = async (req:Request, res:Response) => {
    const {email, password} = req.body ?? {};
    if (typeof email !== "string" || !isValidEmail(email) ||
        typeof password !== "string" || password.length === 0) {
        res.status(400).json({ code: "INVALID_CREDENTIALS", message: "A valid email and password are required" });
        return;
    }

    try {
        const access_token = await handleLogin(email, password);
        if (!access_token) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        res.status(200).json({access_token, message:"Login successful"});
    } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const registerUserApi = async (req:Request, res:Response) => {
    const {name, email, password, confirmPassword} = req.body ?? {};
    if (typeof name !== "string" || name.trim().length === 0 ||
        typeof email !== "string" || !isValidEmail(email) ||
        typeof password !== "string" || password.length === 0 ||
        typeof confirmPassword !== "string" || confirmPassword.length === 0) {
        res.status(400).json({ code: "INVALID_REGISTRATION", message: "Name, valid email, password, and confirmation are required" });
        return;
    }
    if (password !== confirmPassword) {
        res.status(400).json({ code: "PASSWORD_MISMATCH", message: "Passwords do not match" });
        return;
    }

    try {
        const newUser = await registerUser(name.trim(), email.trim(), password);
        res.status(201).json({
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            message: "User registered successfully",
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            res.status(409).json({ code: "EMAIL_ALREADY_REGISTERED", message: "Email is already registered" });
            return;
        }
        console.error("User registration failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const fetchAccountAPi = async (req:Request, res:Response) => {
    const user = (req as any).user;
    try {
        res.status(200).json({      
            user
        , message: "Fetch account successful" });
    } catch (error) {
        console.error("Fetch account failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    }
export {LoginApi, registerUserApi, fetchAccountAPi}    