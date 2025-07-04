import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../Models/UserModel.js'
import doctorModel from '../Models/DoctorModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import appointmentModel from '../Models/AppointmentModel.js'

//api to register user

const register=async(req ,res)=>{
    try{
        const {name,email,password}=req.body

        if(!name|| !password || !email){
            return res.json({success:false,message:'Missing Details'})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:'Enter a valid email'})

        }
        if(password.length<8){
            return res.json({success:false,message:'enter the strong password'})
        }

        //hashing user password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword =await bcrypt.hash(password,salt)

        const userData={
            name,
            email,
            password:hashedPassword
        }

        const newUser =new userModel(userData)
        const user=await newUser.save()
        //_id token create
        const token=jwt.sign({id:user.id},process.env.JWT_SECRET)
        res.json({success:true,token})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api user login

const loginUser=async (req,res) => {
    try{
        const {email,password}=req.body
        console.log(email,password)
        const user=await userModel.findOne({email})
        if(!user){
           return res.json({success:false,message:"user does not exist"})
        }
        const isMatch =await bcrypt.compare(password,user.password)
        if(isMatch){
                const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
                res.json({success:true,token})
        }
         else{
                res.json({success:false,message:"Invalid credentials"})
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api for profile data
const getProfile=async(req,res)=>{
    try{
        const {userId}=req.body
        const userData=await userModel.findById(userId).select('-password')
        res.json({success:true,userData})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.messsage})
    }
}

//API for update profile 
const updateProfile=async(req,res)=>{
    try{
        const{userId,name,phone,address,dob,gender}=req.body
        const imageFile=req.file
        if(!userId || !name ||!phone || !address || !dob||!gender){
            return res.json({success:false, message:'data missing'})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

       if(imageFile){
        //upload image to cloudniary
        const imageUpload=await cloudinary.uploader.upload(imageFile.path ,{resource_type:"image"})
        const imageUrl=imageUpload.secure_url
        await userModel.findByIdAndUpdate(userId,{image:imageUrl})
       }
       res.json({success:true,message:"Profile Updated"})
    }
    catch(error){
      console.log(error)
      res.json({success:false,message:error.message})
    }
}

// API to book appointment 

const bookAppointment =async(req,res)=>{
    try{
        const {userId ,docId, slotDate, slotTime}=req.body
        const docData =await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({success:false,message:"Doctor not available"})
        }

        let slots_booked ={...docData.slots_booked} 
        //checking for slot availablity
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:"Slot not available"})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate]=[slotTime]
            
        }

        const userData =await userModel.findById(userId).select('-password')
        
        // delete docData.slots_booked

        const appointmentData ={
            userId,docId,
            userData,docData,
            amount:docData.fees,
            slotTime,slotDate,
            date:Date.now()
        }

        const newAppointment =new appointmentModel(appointmentData)
        await newAppointment.save()

        //Save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true ,message:"Appointment Booked"})
    }
    catch(error){
        console.log(error)
      res.json({success:false,message:error.message})
    }
}

//   Api to get user appointments 
const listAppointment =async (req,res) => {
    try{
        const {userId}=req.body
        const appointment=await appointmentModel.find({userId})
        res.json({success:true,appointment})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to cancel appointment
const cancelAppointment =async(req,res)=>{
    try{
        const {userId,appointmentId}=req.body
        const appointmentData =await appointmentModel.findById(appointmentId)

        //verify appointment user
        if(appointmentData.userId!==userId){
            return res.json({success:false,message:'Unauthorized action'})
        }
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

    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
export  {register, loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment}