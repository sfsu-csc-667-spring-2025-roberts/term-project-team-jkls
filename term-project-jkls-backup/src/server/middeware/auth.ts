import { NextFunction, Request, Response } from "express";

const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
    // @ts-ignore
    if(request.session.userId !== undefined) {
        // @ts-ignore
        response.locals.userId = request.session.userId;
        next(); 
    } else {
        response.redirect("/auth/login")
    }
}



export default authMiddleware;