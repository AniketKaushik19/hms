import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
export const MyAppointment = () => {
  const {backendUrl,token,getDoctorsData}=useContext(AppContext)
  const [appointments,setAppointment]=useState([])
  const months=[" ","Jan", "Feb",'Mar','Apr','May','Jun','Jul',"Aug",'Sep','Oct','Nov','Dec']
  const slotDateFormat=(slotDate)=>{
    const dateArray=slotDate.split('_')
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2]
  }
  const getUserAppointment=async () => {
    try{
      console
      const {data}=await axios.get(backendUrl+'/api/user/my-appointments',{headers:{token}})
      if(data.success){
        setAppointment(data.appointment.reverse())
        console.log(data.appointment)
      }
      else{
        console.log("error")
      }
    }
    catch(error){
        console.log(error)
        toast.error(error.message)
    }
  }
  const cancelAppointment=async (appointmentId) => {
    try{
      const {data}=await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{token}})
      if(data.success){
        toast.success(data.message)
        getUserAppointment()
        getDoctorsData()
      }
      else{
        toast.error(data.message)
      }
    }
    catch(error){
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    if(token){
      getUserAppointment()
    }
  },[token])
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointment</p>
      <div>
          {appointments.map((item,index)=>(
            <div className='gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
               <img className='w-32 rounded-lg bg-indigo-50' src={item.docData.image} alt="doctor image" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address :</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1 '><span className='text-sm mr-1 text-neutral-700 font-medium '>Date & Time : </span >{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div>

              </div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && !item.isComplete &&
                <button className='text-sm text-stone-500 text-center sm:min-w-48 py-3 border rounded-full hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>
              }
                {!item.cancelled && !item.isComplete && 
                <button className='text-sm text-stone-500 text-center sm:min-w-48 py-3 border rounded-full hover:bg-red-600 hover:text-white
                transition-all duration-300' onClick={()=>cancelAppointment(item._id)}>Cancel appointment</button>
                }
                {item.cancelled && !item.isComplete &&<button className='sm:min-w-48 my-9 py-2 border border-red-500 text-red-500 rounded-md'> 
                  Appointment Cancelled
                  </button>}
                {item.isComplete &&<button className='sm:min-w-48 my-9 py-2 border border-green-500 text-green-600 rounded-md'> 
                  Appointment Completed
                  </button>}
              </div>
            </div>
          ))}
      </div>
      </div>
  )
}
