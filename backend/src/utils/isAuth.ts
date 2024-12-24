import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      users: {
        userId: string;
        sessionId: string;
      };
    }
  }
}

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(401).json({ error: "You are not authenticated" });
    return;
  }

  try {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          return res.status(403).json({ error: "Invalid token" });
        }
        req.users = {
          userId: decoded.userId,
          sessionId: decoded.sessionId,
        };
      }
    );

    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
};

export default isAuth;
