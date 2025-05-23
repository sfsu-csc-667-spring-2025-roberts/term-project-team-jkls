import express from "express";

import { create } from "./create";
import { join } from "./join";
import { get } from "./get";
import { ping } from "./ping";
import { start } from "./start";
import { validatePassword } from "./validate-password";
import { leave } from "./leave";
import { deleteGame } from "./delete";
import { bet } from "./bet";
import { endCurrentTurn } from "./end-turn";

const router = express.Router();

router.post("/create", create);
router.post("/join/:gameId", join);
router.get("/:gameId", get);
router.post("/:gameId/start", (req, res, next) => {
  start(req, res).catch(next);
});
router.post("/:gameId/validate-password", (req, res, next) => {
  validatePassword(req, res).catch(next);
});
router.post("/:gameId/ping", ping);
router.post("/:gameId/leave", leave);
router.post("/:gameId/delete", (req, res, next) => {
  deleteGame(req, res).catch(next);
});
router.post("/:gameId/bet", (req, res, next) => {
  bet(req, res).catch(next);
});
router.post("/:gameId/end-turn", (req, res, next) => {
  endCurrentTurn(req, res).catch(next);
});

export default router;