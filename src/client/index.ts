import io from "socket.io-client";

const socket = io();
const room = "room-alpha";

socket.emit("join-room", room);

socket.on("system-message", (msg:any) => console.log(msg));
socket.on("your-hand", (hand:any) => console.log("Your cards:", hand));
socket.on("game-started", (msg:any) => console.log(msg));
socket.on("game-update", (move: any)=> console.log("Move:", move));

function sendMove(move: string) {
  socket.emit("game-move", { room, move });
}
