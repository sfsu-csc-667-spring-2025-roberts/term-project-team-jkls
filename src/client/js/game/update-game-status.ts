import { PlayerGameState } from "global";

export const updateGameStatus = (gameState: PlayerGameState) => {  
  const currentPlayerNameEl = document.getElementById('current-player-name');
  if (currentPlayerNameEl) {
    const currentTurnUsername = gameState.currentTurnPlayer?.username || 'Waiting...';
    currentPlayerNameEl.textContent = currentTurnUsername;
  }
  
  const currentBetEl = document.getElementById('current-bet');
  if (currentBetEl) {
    currentBetEl.textContent = `$${gameState.currentBet || 0}`;
  }
  
  const currentRoundEl = document.getElementById('current-round');
  if (currentRoundEl) {
    currentRoundEl.textContent = gameState.currentRound?.toString() || '1';
  }
  
  const totalPotEl = document.getElementById('total-pot');
  if (totalPotEl) {
    const potAmount = gameState.grandTotalPot || 0;
    totalPotEl.textContent = `$${potAmount.toLocaleString()}`;
    
    if (potAmount >= 50000) {
      totalPotEl.classList.add('big-pot');
    } else if (potAmount >= 20000) {
      totalPotEl.classList.add('medium-pot');
    } else {
      totalPotEl.classList.remove('big-pot', 'medium-pot');
    }
  }
  
  const userBalanceEl = document.getElementById('user-balance');
  if (userBalanceEl && gameState.currentPlayer) {
    const balance = gameState.currentPlayer.balance || 0;
    userBalanceEl.textContent = `$${balance.toLocaleString()}`;
    
    if (balance < 1000) {
      userBalanceEl.classList.add('low-balance');
    } else {
      userBalanceEl.classList.remove('low-balance');
    }    
  }
  
  const placeBetButton = document.getElementById('place-bet-button') as HTMLButtonElement;
  const betAmountInput = document.getElementById('bet-amount') as HTMLInputElement;
  
  const isMyTurn = gameState.currentPlayer?.isCurrent === true;
  
  if (placeBetButton) {
    placeBetButton.disabled = !isMyTurn;
    
    if (isMyTurn) {
      placeBetButton.style.backgroundColor = '#ff8b77';
      placeBetButton.style.color = 'white';
      placeBetButton.textContent = 'Bet';
    } else {
      placeBetButton.style.backgroundColor = '#666';
      placeBetButton.style.color = '#ccc';
      placeBetButton.textContent = 'Waiting...';
    }
  }
  
  if (betAmountInput) {
    betAmountInput.disabled = !isMyTurn;
    
    const minimumBet = Math.max(1, (gameState.currentBet || 0) + 1);
    betAmountInput.min = minimumBet.toString();
    
    betAmountInput.placeholder = `Min: $${minimumBet}`;
    
    if (parseInt(betAmountInput.value) < minimumBet) {
      betAmountInput.value = minimumBet.toString();
    }
  }
};