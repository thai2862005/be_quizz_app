import { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: PrismaUser & {
        role?: {
          id: number;
          name: string;
        };
      };
      isAuthenticated?: () => boolean;
    }
  }
}

export {};
