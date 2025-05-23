/**
 * Updates the turn timer display
 * @param secondsLeft Number of seconds remaining in the turn
 * @param totalSeconds Total turn duration in seconds
 */
export const updateTurnTimer = (secondsLeft: number, totalSeconds: number): void => {  
  const statusOverlay = document.getElementById('game-status-overlay');
  
  const timerEl = document.getElementById('turn-timer');
  const progressEl = document.getElementById('timer-progress');
  const timerContainer = document.querySelector('.timer-container');

  
  if (!timerEl) {
    console.error('❌ Timer element #turn-timer not found!');
    return;
  }
  
  if (!progressEl) {
    console.error('❌ Timer progress element #timer-progress not found!');
    return;
  }
  
  if (!timerContainer) {
    console.error('❌ Timer container .timer-container not found!');
    return;
  }
  
  timerEl.textContent = secondsLeft.toString();
  
  const progressPercentage = Math.max(0, (secondsLeft / totalSeconds) * 100);
  progressEl.style.width = `${progressPercentage}%`;
  
  timerContainer.classList.remove('timer-warning', 'timer-danger');
  
  if (secondsLeft <= 10) {
    timerContainer.classList.add('timer-danger');
  } else if (secondsLeft <= 20) {
    timerContainer.classList.add('timer-warning');
  }
  
};

(window as any).testTimer = () => {
  updateTurnTimer(30, 45);
};