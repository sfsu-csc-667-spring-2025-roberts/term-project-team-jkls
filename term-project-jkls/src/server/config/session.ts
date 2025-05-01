import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import type { Express, RequestHandler } from "express";

let middleware: RequestHandler | undefined = undefined

const setupSessions = (app: Express) => {
    const pgSession = connectPgSimple(session)

    if (middleware === undefined) {
        middleware = session({
            store: new pgSession({
                createTableIfMissing: true, 
            }),
            secret: process.env.SESSION_SECRET!,
            resave: true,
            saveUninitialized: false,
        })

        app.use(middleware)
    }



    return middleware
}


export {setupSessions};