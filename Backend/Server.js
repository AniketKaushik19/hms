import express from "express";
import cors from 'cors'
import 'dotenv/config'
import connectDb from "./Config/Mongodb.js";
import connectCloudinary from "./Config/Cloudinary.js";
import adminRouter from "./Routes/adminRoute.js";
import doctorRouter from "./Routes/doctorRoute.js";
import userRouter from "./Routes/userRoute.js";

// app config
const app=express()
const port =process.env.PORT || 3000
connectDb()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
//localhost:4000/api/admin/add-Doctor
app.get('/',(req,res)=>{
    res.send('api working well')
})

app.listen(port ,()=>console.log(`Server lisining at port ${port}`))