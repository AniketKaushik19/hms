import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../Context/AdminContext'
import { AppContext } from '../../Context/AppContext'
import { assets } from '../../assets/assets'
const AllAppointment = () => {
  const {aToken, appointments,getAllAppointment,cancelAppointment}=useContext(AdminContext)
  const {calculateAge,slotDateFormat,currency}=useContext(AppContext)
  useEffect(()=>{
    if(aToken){
      getAllAppointment()
    }
  },[aToken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appointments.map((item,index)=>{
         return <div className='flex felx-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-4 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden '>{index+1}</p>
            <div className='flex gap-2 items-center'>
              <img className='w-8 rounded-full' src={item.userData.image} alt="userImage" /><p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p className='text-sm'>{slotDateFormat(item.slotDate)},<br/> {item.slotTime}</p>
            <div className='flex gap-2 items-center'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="userImage" /><p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            {item.cancelled?
              <p className='text-red-400 text-xs font-medium '>Cancelled</p>
              : item.isComplete ? <p className='text-green-600 text-xs'>Completed</p> :
              <img onClick={()=>cancelAppointment(item._id)} src={assets.cancel_icon} alt="cancel icon" />
            }
          </div>
        })}
      </div>
    </div>
  )
}

export default AllAppointment