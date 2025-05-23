import { PlayerGameState } from "global";

export const updateGameStatus = (gameState: PlayerGameState) => {
  
  // Update current player name - this should show whose turn it actually is
  const currentPlayerNameEl = document.getElementById('current-player-name');
  if (currentPlayerNameEl) {
    const currentTurnUsername = gameState.currentTurnPlayer?.username || 'Waiting...';
    currentPlayerNameEl.textContent = currentTurnUsername;
  }
  
  // Update current bet
  const currentBetEl = document.getElementById('current-bet');
  if (currentBetEl) {
    currentBetEl.textContent = `$${gameState.currentBet || 0}`;
  }
  
  // Update round
  const currentRoundEl = document.getElementById('current-round');
  if (currentRoundEl) {
    currentRoundEl.textContent = gameState.currentRound?.toString() || '1';
  }
  
  // Update YOUR balance in status overlay (not the current turn player's balance)
  const playerBalanceEl = document.getElementById('player-balance');
  if (playerBalanceEl && gameState.currentPlayer) {
    playerBalanceEl.textContent = `$${gameState.currentPlayer.balance || 0}`;
  }
  
  // Update YOUR balance in header (top right)
  const userBalanceEl = document.getElementById('user-balance');
  if (userBalanceEl && gameState.currentPlayer) {
    const balance = gameState.currentPlayer.balance || 0;
    userBalanceEl.textContent = `$${balance.toLocaleString()}`;
    
    // Add visual warning for low balance
    if (balance < 1000) {
      userBalanceEl.classList.add('low-balance');
    } else {
      userBalanceEl.classList.remove('low-balance');
    }
  }
  
  // Enable/disable buttons based on whether it's YOUR turn
  const endTurnButton = document.getElementById('end-turn-button') as HTMLButtonElement;
  const placeBetButton = document.getElementById('place-bet-button') as HTMLButtonElement;
  const betAmountInput = document.getElementById('bet-amount') as HTMLInputElement;
  
  // Check if it's YOUR turn (not just if someone has a current turn)
  const isMyTurn = gameState.currentPlayer?.isCurrent === true;
  
  if (endTurnButton) {
    endTurnButton.disabled = !isMyTurn;
    
    // Visual feedback
    if (isMyTurn) {
      endTurnButton.style.backgroundColor = '#22989c';
      endTurnButton.style.color = 'white';
    } else {
      endTurnButton.style.backgroundColor = '#666';
      endTurnButton.style.color = '#ccc';
    }
  }
  
  if (placeBetButton) {
    placeBetButton.disabled = !isMyTurn;
  }
  
  if (betAmountInput) {
    betAmountInput.disabled = !isMyTurn;
  }
};