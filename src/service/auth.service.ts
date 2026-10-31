import { prisma } from "../config/client";
import * as jwt from "jsonwebtoken";

const handleLogin = async (username: string, password: string): Promise<string | null> => {
  const user = await prisma.user.findUnique({
    where: { email: username },
    include: { role: true },
  });

  if (!user || user.password !== password) {
    return null;
  }

  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error("JWT_SECRET is not configured");
  }

  const expiresIn =
    (process.env.JWT_EXPIRES_IN || "1h") as jwt.SignOptions["expiresIn"];

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    roleId: user.roleId,
    role: user.role,
  };

  const access_token = jwt.sign(payload, secretKey, {
    expiresIn,
  });

  return access_token;
};

const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const userRole = await prisma.role.findUnique({
    where: { name: "USER" },
  });

  if (userRole) {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        roleId: userRole.id,
      },
    });

    return newUser;
  }

  throw new Error("USER role not found");
};

export { handleLogin, registerUser };