import { prisma } from "../config/client";
import {jwt} from "jsonwebtoken"
 const handleLogin = async (username: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: {email:username},
      include: { role: true }, 
    });

    if (!user) {
      throw new Error(`Username ${username} not found`);
    }

   

    const secretKey :any = process.env.SECRET_KEY;
    const expiresIn :any = process.env.EXPIRES_IN;

    const payload = {
      id: user.id,
      name:user.name,
      email:user.email,
      roleId: user.roleId,
      role: user.role
    }

    const access_token = jwt.sign(payload, secretKey, { expiresIn });
    return access_token;
  };

    

  export {handleLogin}