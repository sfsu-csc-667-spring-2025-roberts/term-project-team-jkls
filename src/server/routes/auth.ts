import express from "express"; 
import { Request, Response } from "express";

import User from '../db/users'

const router = express.Router();


router.get("/register", async (request: Request, response: Response) => {
    response.render("auth/register")
});

router.post("/register", async (request: Request, response: Response) => {
    const { email, password } = request.body;

    try {
        const userId = await User.register(email, password);

        // @ts-ignore
        request.session.userId = userId; // Store userId in session


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
        const userId = await User.login(email, password);

         // @ts-ignore
         request.session.userId = userId; // Store userId in session

         response.redirect("/lobby")
         console.log("Redirecting to /lobby")
    } catch (error) {
        response.render("auth/login", { error: "Invalid email or password" });
    }
});

router.get("/logout", async (request: Request, response: Response) => {
    // @ts-ignore
    request.session.userId = null; // Clear userId from session

    request.session.destroy(() => {
        response.redirect("/")
    })
});



export default router;