import { NextFunction, Request, Response } from "express";
import { z } from "zod";
export const handleAsyncError = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => next(err));
  };
};
