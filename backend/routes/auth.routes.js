import express from "express"
import { signup,login,logOut } from "../controllers/auth.controller.js"

const authRouter = express.Router()
authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.get("/logout",logOut)

export default authRouter