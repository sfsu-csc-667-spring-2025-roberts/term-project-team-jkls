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

    console.log(`User [${userId.id}] connected with session id ${id}`);
    socket.join(`${userId.id}`);

    socket.on("disconnect", () => {
      console.log(`User [${userId.id}] disconnected`);
      socket.leave(`${userId.id}`);
    });
  });
};

export default configureSockets;