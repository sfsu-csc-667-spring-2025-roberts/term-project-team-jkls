import { Server } from "socket.io";
import type { Express, RequestHandler } from "express";

const configureSockets = (
  io: Server,
  app: Express,
  sessionMiddleware: RequestHandler,
) => {
  app.set("io", io);

  io.engine.use(sessionMiddleware);

  io.on("connection", (socket) => {
    // @ts-ignore
    const { userId, id } = socket.request.session;

    console.log(`User [${userId}] connected with session id ${id}`);
    socket.join(`${userId}`);

    socket.on("disconnect", () => {
      console.log(`User [${userId}] disconnected`);
      socket.leave(`${userId}`);
    });
  });
};

export default configureSockets;