import { Request,Response,NextFunction } from "express"
import jwt from 'jsonwebtoken';
const checkJwt = (req:Request,res:Response,next:NextFunction)=>{
const authHeader = req.headers["authorization"];
const token = authHeader && authHeader.split(" ")[1];
if(!token){
    return res.status(401).json({message:"no token provided"})
}
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ message: "Authentication is not configured" });
}
try {
    const decoded = jwt.verify(token, secretKey);
    if (typeof decoded === "string" || typeof decoded.id !== "number") {
      return res.status(401).json({
        data: null,
        message: "Token không hợp lệ (Cần truyền lên Token)",
      });
    }

    (req as any).user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      roleId: decoded.roleId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      data: null,
      message: "Token không hợp lệ (Cần truyền lên Token)",
    });
  }
}
export {checkJwt}