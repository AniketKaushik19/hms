import {createContext, useState} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext=createContext()
const AdminContextProvider=(props)=>{
    const [aToken,setAToken]=useState(localStorage.getItem("aToken")?localStorage.getItem("aToken"):false)
    const [doctors,setDoctors]=useState([])
    const [appointments,setAppointments]=useState([])
    const [dashData,setDashData]=useState(false)
    const backendurl=import.meta.env.MODE==="development" ? "http://localhost:3000" : "/admin"
    
    const getAllDoctors=async () => {
        try{
            const {data}=await axios.post(backendurl+'/api/admin/all-doctors',{},{headers:{aToken}})
            
            if(data.success){
                setDoctors(data.doctors)
                console.log(data.doctors)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
        
    }
    
    const changeAvailablity=async (docId) => {
        try{
            const {data}=await axios.post(backendurl+'/api/admin/change-avaliablity',{docId},{headers:{aToken}})
            
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }
    
    const getAllAppointment =async () => {
        try{
            const {data}=await axios.get(backendurl+'/api/admin/appointments',{headers:{aToken}})
            if(data.success){
                setAppointments(data.appointments)
                console.log(data.appointments)
            }else{
                toast.error(data.appointments)
            }
        }catch(error){
            toast.error(error.message)
        }
    }
    
    const  cancelAppointment =async (appointmentId) => {
        try{
            const {data}=await axios.post(backendurl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllAppointment()
            }
            else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    const getDashData=async()=>{
        try{
            const {data}=await axios.get(backendurl+'/api/admin/dashboard',{headers:{aToken}})
            if(data.success){
                setDashData(data.dashData)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }
    const value={
        aToken,setAToken,backendurl,
        doctors,getAllDoctors,
        changeAvailablity,
        appointments,setAppointments,
        getAllAppointment,
        cancelAppointment,dashData,
        getDashData
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider
