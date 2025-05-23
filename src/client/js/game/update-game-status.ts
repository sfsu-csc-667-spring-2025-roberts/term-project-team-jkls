import { PlayerGameState } from "global";

export const updateGameStatus = (gameState: PlayerGameState) => {  
  const currentPlayerNameEl = document.getElementById('current-player-name');
  if (currentPlayerNameEl) {
    currentPlayerNameEl.textContent = gameState.currentPlayer?.username || 'Unknown';
  }
  
  const currentBetEl = document.getElementById('current-bet');
  if (currentBetEl) {
    currentBetEl.textContent = `$${gameState.currentBet || 0}`;
  }
  
  const currentRoundEl = document.getElementById('current-round');
  if (currentRoundEl) {
    currentRoundEl.textContent = gameState.currentRound?.toString() || '1';
  }
  
  const playerBalanceEl = document.getElementById('player-balance');
  const myPlayerData = Object.values(gameState.players).find(p => p.isCurrent);
  if (playerBalanceEl && myPlayerData) {
    playerBalanceEl.textContent = `$${myPlayerData.balance || 0}`;
  }
  
  const endTurnButton = document.getElementById('end-turn-button') as HTMLButtonElement;
  const placeBetButton = document.getElementById('place-bet-button') as HTMLButtonElement;
  const betAmountInput = document.getElementById('bet-amount') as HTMLInputElement;
  
  const isMyTurn = gameState.currentPlayer?.isCurrent === true;
  
  if (endTurnButton) {
    endTurnButton.disabled = !isMyTurn;
  }
  
  if (placeBetButton) {
    placeBetButton.disabled = !isMyTurn;
  }
  
  if (betAmountInput) {
    betAmountInput.disabled = !isMyTurn;
  }
  
};