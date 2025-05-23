import UI from "./elements";
import { configureSocketEvents } from "./game/configure-socket-events";
import { getGameId } from "./utils";
import { waitForSocket } from "./sockets";
import { socket } from "./sockets";

configureSocketEvents();

// Add event listener for the start game button
UI.START_GAME_BUTTON?.addEventListener("click", (e) => {
  e.preventDefault();
  
  if (UI.START_GAME_BUTTON.hasAttribute('disabled')) {
    return; // Don't do anything if button is disabled
  }
  
  fetch(`/games/${getGameId()}/start`, { method: "post" });
});


socket.on(`game:${getGameId()}:player-joined`, (data: any) => {
  window.location.reload();
});

socket.on(`game:${getGameId()}:player-left`, (data: any) => {
  window.location.reload();
});

waitForSocket.then(() => {
  if (UI.PLAY_AREA?.classList.contains("started")) {
    fetch(`/games/${getGameId()}/ping`, { method: "post" });
  }
});