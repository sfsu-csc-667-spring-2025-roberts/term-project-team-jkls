import multer from "multer";
import path from "path";
import express from "express"; 
import { Request, Response } from "express";

import User from '../db/users'

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/images");
  },
  filename: function (_req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/register", async (_req: Request, res: Response) => {
  res.render("auth/register");
});


router.post("/register", upload.single("profilePic"), async (request: Request, response: Response) => {
    const { email, password, username } = request.body;
     const profilePic = request.file?.filename || "default.png";
    try {
        const user = await User.register(email, password, username, profilePic);

        // @ts-ignore
        request.session.user = user; // Store user in session


        response.redirect("/lobby")
    } catch (error) {
        response.render("auth/register", { error: "An Error Has Occured" });
    }
});

router.get("/login", async (_request: Request, response: Response) => {
    response.render("auth/login")

    
});

router.post("/login", async (request: Request, response: Response) => {
    const { email, password } = request.body;

    try {
        const user = await User.login(email, password);

         // @ts-ignore
         request.session.user = user; // Store user in session

         response.redirect("/lobby")
         console.log("Redirecting to /lobby")
    } catch (error) {
        response.render("auth/login", { error: "Invalid email or password" });
    }
});

router.get("/logout", async (request: Request, response: Response) => {
    // @ts-ignore
    request.session.user = null; // Clear user from session

    request.session.destroy(() => {
        response.redirect("/")
    })
});



export default router;