import express from "express"
import dotenv from  "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, server } from "./socket/socket.js"
import path from "path"
dotenv.config()

const port = process.env.PORT || 5000
 
app.use(cors({
origin:"https://chat-app-project-beta-sooty.vercel.app",
credentials:true
}))
app.use(express.json())
app.use(cookieParser())

connectDb()

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/message",messageRouter)

server.listen(port,()=>{
    console.log("Server Started")
})



