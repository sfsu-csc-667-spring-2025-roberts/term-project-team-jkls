import type { Request, Response, NextFunction } from "express";

const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // @ts-ignore
  if (request.session.userId) {
    // @ts-ignore
    response.locals.user = request.session.userId;

    next();
  } else {
    response.redirect("/auth/login");
  }
};

export default authMiddleware;