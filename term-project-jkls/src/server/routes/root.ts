import express from "express"; 
const router = express.Router(); 
router.get("/", (_request, response) => { 
  response.render("root", { name: "Home" }); 
}); 
export default router; 