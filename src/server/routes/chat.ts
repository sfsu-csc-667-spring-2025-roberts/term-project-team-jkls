import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.post("/:roomId", (request: Request, response: Response) => {
  const { roomId } = request.params;
  const { message } = request.body;
  if (!request.session.user) {
    response.status(401).send("Not logged in");
    return;
  }
  const { id, email, username, profile_pic } = request.session.user;
  const io = request.app.get("io");

  if (!io) {
    response.status(500).send("Socket.io not initialized");
    return;
  }

  if (!message) {
    response.status(400).send("Message is required");
    return;
  }



  io.emit(`chat:message:${roomId}`, {
    message,
    sender: {
      id,
      username,
      email,
      profile_pic
    },
    timestamp: new Date(),
  });

  response.status(200).send();
});

export default router;