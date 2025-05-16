import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import type { Express, RequestHandler } from "express";

let sessionMiddleware: RequestHandler;

const configureSession = (app: Express) => {
  const store = new (connectPgSimple(session))({
    createTableIfMissing: true,
  });

  sessionMiddleware = session({
    store,
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  });

  app.use(sessionMiddleware);
  return sessionMiddleware;
};

export default configureSession;
export { sessionMiddleware };
