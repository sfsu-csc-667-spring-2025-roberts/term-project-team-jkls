import UI from "./elements";
import { configureSocketEvents } from "./game/configure-socket-events";
import { getGameId } from "./utils";
import { waitForSocket } from "./sockets";
import { socket } from "./sockets";

// Add debug logging
console.log('🚀 Games.ts loading...');

waitForSocket.then(() => {
  const gameId = getGameId();
  
  // Configure socket events first
  configureSocketEvents();
  
  // Join game room
  console.log("🎮 Joining game room:", gameId);
  socket.emit("join:game", gameId);
  
  // Listen for join confirmation
  socket.once("joined:game", (data: any) => {    
    if (UI.PLAY_AREA?.classList.contains("started")) {
      setTimeout(() => {
        fetch(`/games/${gameId}/ping`, { method: "post" });
      }, 500);
    }
  });
  
}).catch(error => {
  console.error('Error in waitForSocket:', error);
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
  
  // Check balance and potentially refill
  checkAndUpdateBalance();
  
  const endTurnButton = document.getElementById('end-turn-button') as HTMLButtonElement;
  const placeBetButton = document.getElementById('place-bet-button') as HTMLButtonElement;
  const betAmountInput = document.getElementById('bet-amount') as HTMLInputElement;
  
  if (endTurnButton) {
    endTurnButton.addEventListener('click', () => {
      endTurn();
    });
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

async function checkAndUpdateBalance() {
  try {
    const response = await fetch('/balance');
    const data = await response.json();
    
    const userBalanceEl = document.getElementById('user-balance');
    if (userBalanceEl) {
      userBalanceEl.textContent = `$${data.balance.toLocaleString()}`;
      
      if (data.balance < 1000) {
        userBalanceEl.classList.add('low-balance');
      } else {
        userBalanceEl.classList.remove('low-balance');
      }
    }
    
    // Show refill notification if balance was refilled
    if (data.wasRefilled) {
      showBalanceNotification("💰 Your balance has been refilled to $10,000!", "success");
    } else if (data.balance < 10000 && data.nextRefillTime) {
      const nextRefill = new Date(data.nextRefillTime);
      const now = new Date();
      const hoursUntilRefill = Math.ceil((nextRefill.getTime() - now.getTime()) / (1000 * 60 * 60));
      
      if (hoursUntilRefill <= 2) {
        showBalanceNotification(`💰 Balance refill available in ${hoursUntilRefill} hour(s)`, "info");
      }
    }
    
    console.log('💰 Balance check completed:', data);
  } catch (error) {
    console.error('❌ Error checking balance:', error);
  }
}

function showBalanceNotification(message: string, type: "success" | "info" | "warning") {
  const notification = document.createElement('div');
  notification.className = `balance-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function endTurn() {
  const gameId = getGameId();
  
  fetch(`/games/${gameId}/end-turn`, {
    method: 'POST'
  })
  .then(response => response.json())
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
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('💰 Bet placed successfully:', data);
      
      // Update balance display
      const userBalanceEl = document.getElementById('user-balance');
      if (userBalanceEl && data.newBalance !== undefined) {
        userBalanceEl.textContent = `$${data.newBalance.toLocaleString()}`;
      }
    } else {
      alert(data.error || 'Failed to place bet');
    }
  })
  .catch(error => {
    console.error('Error placing bet:', error);
  });
}

socket.on(`game:${getGameId()}:player-joined`, (data: any) => {
  window.location.reload();
});

socket.on(`game:${getGameId()}:player-left`, (data: any) => {
  window.location.reload();
});