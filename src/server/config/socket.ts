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
    const { user, id } = socket.request.session;

    if (!user) {
      console.log("User not authenticated");
      socket.disconnect();
      return;
    }

    console.log(`User [${user.id}] connected with session id ${id}`);
    socket.join(`${user.id}`);

    socket.on("join:game", async (gameId) => {
      console.log(`User ${user.id} joining game room: game:${gameId}`);
      await socket.join(`game:${gameId}`);
      
      const sockets = await io.in(`game:${gameId}`).fetchSockets();
      console.log(`Room game:${gameId} now has ${sockets.length} sockets`);
      
      socket.emit("joined:game", { gameId, userId: user.id });
    });

    socket.on("disconnect", () => {
      console.log(`User [${user.id}] disconnected`);
      socket.leave(`${user.id}`);
    });
  });
};

export default configureSockets;