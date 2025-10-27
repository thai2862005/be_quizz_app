import { Request, Response, NextFunction } from 'express';

// Middleware kiểm tra quyền ADMIN
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/admin')) {
    const user = req.user as any;

    if (user?.role?.name === 'ADMIN') {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }
  }
  next(); // Nếu không phải đường dẫn /admin thì cho qua
};

// Middleware kiểm tra quyền USER hoặc ADMIN
const isUser = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  console.log("check user role user", user);

  if (user?.role?.name === 'USER' || user?.role?.name === 'ADMIN') {
    return next();
  } else {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. User or Admin role required.',
    });
  }
};

// Middleware kiểm tra đăng nhập
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const isAuthenticated = req.isAuthenticated();

  if (isAuthenticated) {
    return res.status(400).json({
      success: false,
      message: 'Already authenticated.',
    });
  } else {
    return next();
  }
};

export { isAdmin, isUser, isAuthenticated };
