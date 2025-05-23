import io from "socket.io-client";

export const socket = io();

export const waitForSocket = new Promise<void>((resolve) => {
  if (socket.connected) resolve();
  else socket.on("connect", () => resolve());
});
