import express from "express"; 
import pool from "../../db"; 

const router = express.Router();

router.get("/", (_request, response) => { 
  response.render("root"); 
}); 

router.get("/db-test", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected", time: result.rows[0].now });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
});

export default router; 



