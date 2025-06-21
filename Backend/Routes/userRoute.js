import express from 'express'
import { getProfile, loginUser, register, updateProfile,bookAppointment, listAppointment, cancelAppointment } from '../Controller/userController.js'
import authUser from '../Middleware/authUser.js'
import upload from '../Middleware/multer.js'

const userRouter=express.Router()

userRouter.post('/register',register)
userRouter.post('/login',loginUser)
userRouter.get('/get-Profile',authUser,getProfile)
userRouter.post('/update-Profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/my-appointments',authUser,listAppointment)
userRouter.post("/cancel-appointment",authUser,cancelAppointment)
export default userRouter
