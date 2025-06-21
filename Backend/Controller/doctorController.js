import doctorModel from "../Models/DoctorModel.js"
import appointmentModel from '../Models/AppointmentModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const changeAvailabltiy=async (req,res) => {
    try{
        const {docId}=req.body

        const docData=await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true ,message:'Avaliablity changed'})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorList=async (req,res) => {
    try{
        const doctor=await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true , doctor })
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API for doctor login
const loginDoctor=async (req,res) => {
    try{
        const {email,password}=req.body
        const doctor=await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:true,message:"Invalid credentials"})
        }
        const isMatch=await bcrypt.compare(password,doctor.password)
        if(isMatch){
            const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            return res.json({success:true,message:"Invalid credentials"})
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get doctor appointments for doctor panel
const appoointmentsDoctor=async (req, res) => {
    try{
       const {docId}=req.body 
       const appointments=await appointmentModel.find({docId})
       res.json({success:true,appointments})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API to make appointment completed in doctor panel 
const appointmentComplete=async (req,res) => {
    try{
        const {appointmentId}=req.body
        const appointmentData=appointmentModel.findById(appointmentId)
        
            await appointmentModel.findByIdAndUpdate(appointmentId,{isComplete:true})
            return res.json({success:true,message:'Appointment completed'})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to cancel appointment
const appointmentCancel=async (req,res) => {
    try{
        const {appointmentId}=req.body
        const appointmentData =await appointmentModel.findById(appointmentId)

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //releasing doctors slot
        const {docId , slotDate , slotTime}=appointmentData
        const doctorData =await doctorModel.findById(docId)
        let slots_booked=doctorData.slots_booked
        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        }
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:"Appointment Cancelled"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get dashboard data for doctors
const doctorDashboard=async (req,res) => {
    try{
        const {docId}=req.body
        const appointments=await appointmentModel.find({docId})
        let earnings=0
        appointments.map((item)=>{
            if(item.isComplete || item.payment){
                earnings+=item.amount
            }
        })
        let patients=[]
        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })
        const dashData={
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
//API for get doctor profile for doctor panel
const doctorProfile=async (req,res) => {
    try{
        const {docId}=req.body
        const profileData =await doctorModel.findById(docId).select('-password')
        res.json({success:true,profileData})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

//API to update doctor profile data from doctor panel
const updateDoctorProfile =async (req,res) => {
    try{
        const {docId,fees,address,available}=req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:'Profile Updated'})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
export {changeAvailabltiy,doctorList,loginDoctor,appoointmentsDoctor,appointmentCancel,appointmentComplete,doctorDashboard,doctorProfile,updateDoctorProfile}