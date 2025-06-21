import express from 'express'
import { addDoctor,adminDashboard,allDoctors,appointmentsAdmin,cancelAppointment,loginAdmin } from '../Controller/adminController.js'
import authAdmin from '../Middleware/authAdmin.js'
import upload from '../Middleware/multer.js'
import { changeAvailabltiy } from '../Controller/doctorController.js'

const adminRouter=express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-avaliablity',authAdmin,changeAvailabltiy)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-Appointment',authAdmin ,cancelAppointment)
adminRouter.get('/Dashboard',authAdmin,adminDashboard)
export default adminRouter