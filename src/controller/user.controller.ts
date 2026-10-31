import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  countTotalUsers,
  createUser,
  deleteUser,
  getALLUsers,
  getAllUserTop7to10,
  getAllUserTopScore,
  getUserById,
  updateUser,
} from "../service/user.service";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const parsePositiveId = (value: string): number | null => {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
};

const isNotFoundError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";

const toPublicUser = ({ id, name, email }: { id: number; name: string; email: string }) =>
  ({ id, name, email });

const CreateUserApi = async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};
  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    typeof email !== "string" ||
    !isValidEmail(email) ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    res.status(400).json({
      code: "INVALID_USER",
      message: "Name, valid email, and password are required",
    });
    return;
  }

  try {
    const user = await createUser(name.trim(), email.trim(), password);
    res.status(201).json({
      user: toPublicUser(user),
      message: "User created successfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({
        code: "EMAIL_ALREADY_REGISTERED",
        message: "Email is already registered",
      });
      return;
    }
    console.error("Failed to create user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteUserApi = async (req: Request, res: Response) => {
  const id = parsePositiveId(req.params.id);
  if (id === null) {
    res.status(400).json({ code: "INVALID_USER_ID", message: "User ID must be a positive integer" });
    return;
  }

  try {
    const user = await deleteUser(id);
    res.status(200).json({ user: toPublicUser(user), message: "User deleted successfully" });
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.error(`Failed to delete user ${id}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateUserApi = async (req: Request, res: Response) => {
  const id = parsePositiveId(req.params.id);
  const { name, email, password } = req.body ?? {};
  if (id === null) {
    res.status(400).json({ code: "INVALID_USER_ID", message: "User ID must be a positive integer" });
    return;
  }
  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    typeof email !== "string" ||
    !isValidEmail(email) ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    res.status(400).json({
      code: "INVALID_USER",
      message: "Name, valid email, and password are required",
    });
    return;
  }

  try {
    const user = await updateUser(id, name.trim(), email.trim(), password);
    res.status(200).json({ user: toPublicUser(user), message: "User updated successfully" });
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({
        code: "EMAIL_ALREADY_REGISTERED",
        message: "Email is already registered",
      });
      return;
    }
    console.error(`Failed to update user ${id}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const GetUserByIdApi = async (req: Request, res: Response) => {
  const id = parsePositiveId(req.params.id);
  if (id === null) {
    res.status(400).json({ code: "INVALID_USER_ID", message: "User ID must be a positive integer" });
    return;
  }

  try {
    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ user: toPublicUser(user), message: "User retrieved successfully" });
  } catch (error) {
    console.error(`Failed to retrieve user ${id}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getALLUsersApi = async (req: Request, res: Response) => {
  const { page } = req.query;
  if (
    page !== undefined &&
    (typeof page !== "string" || !/^[1-9]\d*$/.test(page) || !Number.isSafeInteger(Number(page)))
  ) {
    res.status(400).json({ code: "INVALID_PAGE", message: "Page must be a positive integer" });
    return;
  }
  const currentPage = page === undefined ? 1 : Number(page);

  try {
    const countTotalUser = await countTotalUsers();
    const users = await getALLUsers(currentPage);
    res.status(200).json({
      users: users.map(({ id, name, email, results }) => ({ id, name, email, results })),
      countTotalUser,
      currentPage,
      message: "get All users successfully",
    });
  } catch (error) {
    console.error("Failed to retrieve users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getALLUsersTopScoreApi = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUserTopScore();
    res.status(200).json({ users, message: "get All users top score successfully" });
  } catch (error) {
    console.error("Failed to retrieve top scores:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUserTop7to10ScoreApi = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUserTop7to10();
    res.status(200).json({
      users,
      message: "get All user top 7 to 10 score successfully",
    });
  } catch (error) {
    console.error("Failed to retrieve users ranked 4 to 10:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  CreateUserApi,
  DeleteUserApi,
  UpdateUserApi,
  GetUserByIdApi,
  getALLUsersApi,
  getALLUsersTopScoreApi,
  getAllUserTop7to10ScoreApi,
};
