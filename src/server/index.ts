import * as path from "path";
import * as http from "http";

import express from "express";
import httpErrors from "http-errors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import dotenv from "dotenv";
dotenv.config();

import * as config from "./config";
import * as routes from "./routes";
import * as middleware from "./middeware";
import balanceRoutes from "./routes/balance";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const sessionMw = config.session(app);
app.use(sessionMw)
config.socket(io, app, sessionMw);

const PORT = process.env.PORT || 3000;

app.use(middleware.currentUser);
app.use(middleware.room);
config.liveReload(app);

app.use(
  "/assets",
  express.static(path.join(__dirname, "..", "public", "assets"))
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(express.static(path.join(process.cwd(), "public")));
app.use(middleware.room);

app.set("views", path.join(process.cwd(), "src", "server", "views"));
app.set("view engine", "ejs");

app.use("/", routes.root);
app.use("/auth", routes.auth);
app.use("/chat", middleware.auth, routes.chat);
app.use("/lobby", middleware.auth, routes.lobby);
app.use("/games", middleware.auth, routes.games);
app.use("/balance", middleware.auth, balanceRoutes); // Add this line

app.use((_request, _response, next) => {
  next(httpErrors(404));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});