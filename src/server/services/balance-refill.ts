import db from "../db/connection";

const REFILL_AMOUNT = 10000;
const REFILL_INTERVAL_HOURS = 24;

export const checkAndRefillBalance = async (userId: number): Promise<{ 
  balance: number; 
  wasRefilled: boolean; 
  nextRefillTime?: Date;
}> => {  
  const user = await db.one(
    `SELECT balance, last_refill FROM users WHERE id = $1`,
    [userId]
  );
  
  const currentBalance = parseInt(user.balance);
  const lastRefill = new Date(user.last_refill);
  const now = new Date();
  const hoursSinceRefill = (now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60);
    
  // If balance is >= 10,000, no refill needed
  if (currentBalance >= REFILL_AMOUNT) {
    return { 
      balance: currentBalance, 
      wasRefilled: false,
      nextRefillTime: new Date(lastRefill.getTime() + (REFILL_INTERVAL_HOURS * 60 * 60 * 1000))
    };
  }
  
  // If balance is < 10,000 but hasn't been 24 hours yet
  if (hoursSinceRefill < REFILL_INTERVAL_HOURS) {
    const nextRefillTime = new Date(lastRefill.getTime() + (REFILL_INTERVAL_HOURS * 60 * 60 * 1000));
    return { 
      balance: currentBalance, 
      wasRefilled: false,
      nextRefillTime
    };
  }
    
  await db.none(
    `UPDATE users 
     SET balance = $2, last_refill = NOW() 
     WHERE id = $1`,
    [userId, REFILL_AMOUNT]
  );
    
  return { 
    balance: REFILL_AMOUNT, 
    wasRefilled: true 
  };
};

export const getUserBalance = async (userId: number): Promise<number> => {
  const { balance } = await db.one(
    `SELECT balance FROM users WHERE id = $1`,
    [userId]
  );
  return parseInt(balance);
};

export const updateUserBalance = async (userId: number, amount: number): Promise<number> => {
  const { balance } = await db.one(
    `UPDATE users 
     SET balance = balance + $2 
     WHERE id = $1 
     RETURNING balance`,
    [userId, amount]
  );
  return parseInt(balance);
};

export const canAffordBet = async (userId: number, betAmount: number): Promise<boolean> => {
  const balance = await getUserBalance(userId);
  return balance >= betAmount;
};