import { NextFunction, Request, Response } from "express";

const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
    // @ts-ignore
    if(request.session.user !== undefined) {
        // @ts-ignore
        response.locals.user = request.session.user;
        next(); 
    } else {
        response.redirect("/auth/login")
    }
}



export default authMiddleware;