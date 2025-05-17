// src/server/middleware/currentUser.ts
import { Request, Response, NextFunction } from "express";

export default function currentUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.currentUser = (req.session as any)?.user ?? null;
  next();
}
