import cookieParser from "cookie-parser"; 
import dotenv from "dotenv"; 
import express from "express"; 
import httpErrors from "http-errors"; 
import morgan from "morgan"; 
import * as path from "path"; 
import pool from "../db";
import livereload from "livereload";
import connectLivereload from "connect-livereload";
import { setupSessions } from "./config/session";

dotenv.config(); 
const app = express(); 
const PORT = process.env.PORT || 3000; 

if (process.env.NODE_ENV !== "production") {
  const reloadServer = livereload.createServer({ port: 35730 });


  reloadServer.watch(path.join(process.cwd(), "public", "js"));

  reloadServer.server.once("connection", () => {
    setTimeout(() => {
      reloadServer.refresh("/");
    }, 100);
  })

  app.use(connectLivereload());
}

setupSessions(app);

import * as routes from "./routes";
import { sessionMiddleware } from "./middeware/auth";



app.use(morgan("dev")); 
app.use(express.json()); 

app.use(express.urlencoded({ extended: false })); 
app.use(express.static(path.join(process.cwd(), "public")));


app.use(cookieParser()); 
app.set("views", path.join(process.cwd(), "src", "server", 
"views")); 
app.set("view engine", "ejs"); 

// PAGES //
app.use("/", routes.root); 
app.use("/auth", routes.auth);
app.use("/lobby", sessionMiddleware, routes.lobby);

app.use((_request, _response, next) => { 
  next(httpErrors(404)); 
}); 

pool.query("SELECT NOW()")
  .then(result => {
    console.log("Connected to DB. Server time:", result.rows[0].now);
  })
  .catch(err => {
    console.error("Couldn't connect to database:", err);
  });


import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("chat", (msg) => {
    console.log("Message from client:", msg);
    io.emit("chat", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server with socket.io running at http://localhost:${PORT}`);
});
