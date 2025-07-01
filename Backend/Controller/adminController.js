import validator from "validator"
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from "cloudinary"
import DoctorModel from '../Models/DoctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../Models/AppointmentModel.js'
import userModel from "../Models/UserModel.js"
// API FOR ADDING DOCTOR
const addDoctor=async(req,res)=>{
    try{
        const {name,email,password ,speciality, degree ,experience ,
            about, fees,address
        }=req.body
        const imageFile=req.file
        // console.log({name,email,password ,speciality, degree ,experience ,
        //     about, fees,address
        // },imageFile,)

        //checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address ){
            return res.json({success:false,message:"Missing details"})
        }
        
        // validating email 
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter valid email"})
        }

        //validate password
        if(password.length<8){
            return res.json({success:false,message:"Enter the strong password"})
        }
        
        // hashing doctor password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password, salt)
       
        // uploading to cloudinary
        const imageUpload =await cloudinary.uploader.upload(imageFile.path ,{resource_type:"image"})
        const imageUrl=imageUpload.secure_url

        const doctorData ={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            // date:Date.now() 

        }

        const newDoctor =new DoctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true, message:"Successfully added doctor"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

//Api for admin login
const loginAdmin=async(req,res)=>{
    try{
        const {email,password} = req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"invalid credential"})
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get all doctors list for admin panel

const allDoctors=async(req,res)=>{
    try{
        const doctors=await DoctorModel.find({}).select('-password')
        res.json({success:true ,doctors})
    }
    catch(error){
        res.json({success:false ,message:error.message})
    }
}

// API to get all appointment list
const appointmentsAdmin =async (req,res) => {
    try{
        const appointments =await appointmentModel.find({})
        res.json({success:true ,appointments})
    }catch(error){
        res.json({success:false ,message:error.message})
    }
}

//api for appointment cancellation
const cancelAppointment =async(req,res)=>{
    try{
        const {appointmentId}=req.body
        const appointmentData =await appointmentModel.findById(appointmentId)

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

         //releasing doctors slot
        const {docId , slotDate , slotTime}=appointmentData
        const doctorData =await DoctorModel.findById(docId)
        let slots_booked=doctorData.slots_booked
        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        }
        await DoctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:"Appointment Cancelled"})

    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get dashboard data for admin panel
const adminDashboard=async (req,res) => {
    try{
        const doctors=await DoctorModel.find({})
        const users=await userModel.find({})
        const appointments=await appointmentModel.find({})

        const dashData={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
export {addDoctor, loginAdmin, allDoctors,appointmentsAdmin,cancelAppointment,adminDashboard}