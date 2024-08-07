import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import { errorHandler } from "./utils/error.js"

dotenv.config()

const app = express()
const MONGO_URI="mongodb+srv://shakyamayan90:Hustle244@cluster0.3zzbk.mongodb.net/";

mongoose.connect(MONGO_URI).then(()=>console.log("yesss")).catch((err)=>console.log(err.message))

app.get("/", (req, res)=>{
    res.send("hello")
})



const PORT=process.env.PORT||3000


// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());


import authRoutes from "./Routes/auth.routes.js"

app.use("/api/auth", authRoutes)

app.listen(PORT,()=>console.log("object"));

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "internal server error"

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})