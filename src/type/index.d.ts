import { User } from '../models/User'; // nếu bạn có model User, nếu không thì xóa dòng này

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: {
        id: number;
        name: string;
      };
    }

    interface Request {
      user?: User;
      isAuthenticated?: () => boolean;
    }
  }
}
