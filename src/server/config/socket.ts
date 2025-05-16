// import { Server, Socket } from "socket.io";

// const rooms: Record<string, { p: string[] }> = {};

// function getCards() {
//   const s = ['♠', '♥', '♦', '♣'];
//   const v = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
//   let d:string[] = [];
//   for (let i = 0; i < s.length; i++) {
//     for (let j = 0; j < v.length; j++) {
//       d.push(v[j] + s[i]);
//     }
//   }
//   for (let i = d.length - 1; i > 0; i--) {
//     const r = Math.floor(Math.random() * (i + 1));
//     [d[i], d[r]] = [d[r], d[i]];
//   }
//   return d.slice(0, 5);
// }

// export default function(io: Server) {
//   io.on("connection", (sock: Socket) => {
//     console.log("Player connected:", sock.id);
//     sock.on("join-room", (rm: string) => {
//       sock.join(rm);
//       if (!rooms[rm]) rooms[rm] = { p: [] };
//       rooms[rm].p.push(sock.id);
//       console.log(sock.id, "->", rm);
//       io.to(rm).emit("system-message", `${sock.id} joined`);

//       if (rooms[rm].p.length === 2) {
//         for (let id of rooms[rm].p) {
//           let h = getCards();
//           io.to(id).emit("your-hand", h);
//         }
//         io.to(rm).emit("game-started", "deal done");
//       }
//     });

//     sock.on("game-move", (data: { roomId: string; move: string }) => {
//       sock.to(data.roomId).emit("game-update", data.move);
//     });

//     sock.on("disconnect", () => {
//       console.log("x:", sock.id);
//       for (const r in rooms) {
//         rooms[r].p = rooms[r].p.filter(id => id !== sock.id);
//       }
//     });
//   });
// }

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