import express from "express"
import { Request, Response } from "express";

const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    response.render("lobby")
})

export default router