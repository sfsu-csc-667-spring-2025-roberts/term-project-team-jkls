import express from "express";
import { checkAndRefillBalance, getUserBalance } from "../../services/balance-refill";

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    // @ts-ignore
    const userId = request.session.user!.id;
    
    const refillResult = await checkAndRefillBalance(userId);
    
    response.json({
      balance: refillResult.balance,
      wasRefilled: refillResult.wasRefilled,
      nextRefillTime: refillResult.nextRefillTime,
      message: refillResult.wasRefilled 
        ? "Your balance has been refilled to $10,000!" 
        : refillResult.balance < 10000 
          ? `Next refill available: ${refillResult.nextRefillTime?.toLocaleString()}`
          : "Your balance is healthy!"
    });
  } catch (error) {
    console.error("Error checking balance:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.post("/refill", async (request, response) => {
  try {
    // @ts-ignore
    const userId = request.session.user!.id;
    
    const refillResult = await checkAndRefillBalance(userId);
    
    if (refillResult.wasRefilled) {
      response.json({
        success: true,
        balance: refillResult.balance,
        message: "Balance refilled to $10,000!"
      });
    } else if (refillResult.balance >= 10000) {
      response.json({
        success: false,
        balance: refillResult.balance,
        message: "Your balance is already at or above $10,000"
      });
    } else {
      response.json({
        success: false,
        balance: refillResult.balance,
        nextRefillTime: refillResult.nextRefillTime,
        message: `Next refill available: ${refillResult.nextRefillTime?.toLocaleString()}`
      });
    }
  } catch (error) {
    console.error("Error refilling balance:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

export default router;