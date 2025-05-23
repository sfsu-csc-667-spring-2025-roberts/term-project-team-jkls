import UI from "./elements";
import { configureSocketEvents } from "./game/configure-socket-events";
import { getGameId } from "./utils";
import { waitForSocket } from "./sockets";
import { socket } from "./sockets";

// Add debug logging
console.log('🚀 Games.ts loading...');

waitForSocket.then(() => {
  const gameId = getGameId();
  console.log("✅ Socket connected, configuring events for game:", gameId);
  
  // Configure socket events first
  configureSocketEvents();
  
  // Join game room
  console.log("🎮 Joining game room:", gameId);
  socket.emit("join:game", gameId);
  
  // Listen for join confirmation
  socket.once("joined:game", (data) => {
    console.log("🎯 Confirmed joined game room:", data);
    
    // If game has already started, ping to get current state
    if (UI.PLAY_AREA?.classList.contains("started")) {
      console.log("🏓 Game already started, pinging for current state...");
      setTimeout(() => {
        fetch(`/games/${gameId}/ping`, { method: "post" });
      }, 500);
    }
  });
  
}).catch(error => {
  console.error('❌ Error in waitForSocket:', error);
});

UI.START_GAME_BUTTON?.addEventListener("click", (e) => {
  e.preventDefault();
  
  if (UI.START_GAME_BUTTON.hasAttribute('disabled')) {
    return;
  }
  
  console.log('🎮 Host starting game...');
  fetch(`/games/${getGameId()}/start`, { method: "post" });
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM Content Loaded');
  
  const endTurnButton = document.getElementById('end-turn-button') as HTMLButtonElement;
  const placeBetButton = document.getElementById('place-bet-button') as HTMLButtonElement;
  const betAmountInput = document.getElementById('bet-amount') as HTMLInputElement;
  
  console.log('🔍 DOM loaded - checking buttons:', {
    endTurnButton: !!endTurnButton,
    placeBetButton: !!placeBetButton,
    betAmountInput: !!betAmountInput
  });
  
  if (endTurnButton) {
    console.log('🔘 End turn button found, adding event listener');
    endTurnButton.addEventListener('click', () => {
      console.log('🔄 End turn button clicked');
      endTurn();
    });
  } else {
    console.error('❌ End turn button not found!');
  }
  
  if (placeBetButton && betAmountInput) {
    placeBetButton.addEventListener('click', () => {
      const betAmount = parseInt(betAmountInput.value);
      if (!isNaN(betAmount) && betAmount > 0) {
        placeBet(betAmount);
      }
    });
  }
});

function endTurn() {
  const gameId = getGameId();
  
  console.log('🔄 Attempting to end turn for game:', gameId);
  
  fetch(`/games/${gameId}/end-turn`, {
    method: 'POST'
  })
  .then(response => {
    console.log('📤 End turn response status:', response.status);
    if (!response.ok) {
      throw new Error('Failed to end turn');
    }
    return response.json();
  })
  .then(data => {
    console.log('✅ End turn successful:', data);
  })
  .catch(error => {
    console.error('❌ Error ending turn:', error);
  });
}

function placeBet(amount: number) {
  const gameId = getGameId();
  
  fetch(`/games/${gameId}/bet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to place bet');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error placing bet:', error);
  });
}

socket.on(`game:${getGameId()}:player-joined`, (data: any) => {
  console.log('👥 Player joined, reloading...', data);
  window.location.reload();
});

socket.on(`game:${getGameId()}:player-left`, (data: any) => {
  console.log('👤 Player left, reloading...', data);
  window.location.reload();
});