import { Request,Response,NextFunction } from "express"
import jwt from 'jsonwebtoken';
const checkJwt = (req:Request,res:Response,next:NextFunction)=>{
const path = req.path;
const whitelist = ["/login"]
const isWhitelist = whitelist.some((i)=> path.startsWith(i));
if(isWhitelist){
    return next();
}
const authHeader = req.headers["authorization"];
const token = authHeader && authHeader.split(";");
if(!token){
    return res.status(401).json({message:"no token provided"})
}
try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as any;

    (req as any).user = {
      id: decoded.id,
      fullname: decoded.fullname,
      username: decoded.username,
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